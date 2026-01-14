const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { locales, getLang } = require('../data/locales');
const { knowledgeMap, coreDocs } = require('../data/knowledge_graph');

const HPS_DIR = '.hps';

function readFileSafe(filePath) {
    if (!fs.existsSync(filePath)) {
        return ""; // Return empty string instead of error message to avoid pollution
    }
    return fs.readFileSync(filePath, 'utf8');
}

function loadHpsConfig() {
    const configPath = path.join(HPS_DIR, 'config.json');
    if (fs.existsSync(configPath)) {
        try {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        } catch (e) {
            return {};
        }
    }
    return {};
}

function copyToClipboard(text) {
    try {
        if (process.platform === 'darwin') {
            execSync('pbcopy', { input: text });
            return true;
        } else if (process.platform === 'win32') {
            execSync('clip', { input: text });
            return true;
        } else {
            try { execSync('xclip -selection clipboard', { input: text, stdio: 'ignore' }); return true; } catch(e){}
            try { execSync('xsel -b', { input: text, stdio: 'ignore' }); return true; } catch(e){}
            return false;
        }
    } catch (err) {
        return false;
    }
}

function getResourcesPath() {
    return path.join(__dirname, '../../resources');
}

function getHaloContext() {
    const resDir = getResourcesPath();
    const masterSpec = readFileSafe(path.join(resDir, 'ai_specs', '00_master_spec.md'));
    const collabManual = readFileSafe(path.join(resDir, 'ai_specs', '01_collaboration_manual.md'));
    const javaImportRef = readFileSafe(path.join(resDir, 'ai_specs', '02_java_import_reference.md'));
    // Force include Strict Anti-Patterns
    const antiPatterns = readFileSafe(path.join(resDir, 'ai_specs', 'STRICT_RULES.md'));

    let docIndex = "";
    const docDir = path.join(resDir, 'docs_summaries');
    if (fs.existsSync(docDir)) {
        const files = fs.readdirSync(docDir).filter(f => f.endsWith('.md')).sort();
        docIndex = files.map(f => `- ${f}`).join('\n');
    }

    return { masterSpec, collabManual, docIndex, antiPatterns, javaImportRef };
}

function generateContextContent(context) {
    const lang = getLang();
    const txt = locales[lang] || locales['en'];
    
    // Ensure no undefined values
    const masterSpec = context.masterSpec || "";
    const collabManual = context.collabManual || "";
    const antiPatterns = context.antiPatterns || "";
    const javaImportRef = context.javaImportRef || "";
    const docIndex = context.docIndex || "";

    return `${txt.system_identity}
${txt.role_desc}

${txt.kb_title}

${txt.master_spec_title}
${masterSpec}

${javaImportRef}

${antiPatterns}

${txt.collab_title}
${collabManual}

${txt.doc_index_title}
${txt.doc_index_desc}
${docIndex}

${txt.instructions_title}
${txt.inst_1}
${txt.inst_2}
${txt.inst_3}
`;
}

function getSmartContext(userRequirement) {
    const resDir = getResourcesPath();
    const sourceDocsDir = path.join(resDir, 'docs_summaries');
    const aiSpecsDir = path.join(resDir, 'ai_specs'); // Add ai_specs as a source
    const antiPatternsPath = path.join(aiSpecsDir, 'STRICT_RULES.md');
    
    if (!fs.existsSync(sourceDocsDir)) {
        return { content: "Warning: Documentation library not found in package.", stats: { total: 0, loaded: 0 } };
    }

    const requirementLower = userRequirement.toLowerCase();
    const loadedDocs = new Set(coreDocs);
    const matchedKeywords = new Set();

    knowledgeMap.forEach(entry => {
        const isMatch = entry.keywords.some(k => requirementLower.includes(k));
        if (isMatch) {
            entry.keywords.forEach(k => { if (requirementLower.includes(k)) matchedKeywords.add(k); });
            entry.docs.forEach(doc => loadedDocs.add(doc));
        }
    });

    let combinedContent = "";
    
    // Always inject Anti-Patterns first
    if (fs.existsSync(antiPatternsPath)) {
        combinedContent += readFileSafe(antiPatternsPath) + "\n\n";
    }

    let loadedCount = 0;

    loadedDocs.forEach(docFile => {
        // Try finding the file in docs_summaries first, then ai_specs
        const pathInDocs = path.join(sourceDocsDir, docFile);
        const pathInSpecs = path.join(aiSpecsDir, docFile);
        
        if (fs.existsSync(pathInDocs)) {
            const content = fs.readFileSync(pathInDocs, 'utf8');
            combinedContent += `\n\n# Reference: ${docFile}\n${content}`;
            loadedCount++;
        } else if (fs.existsSync(pathInSpecs)) {
            const content = fs.readFileSync(pathInSpecs, 'utf8');
            combinedContent += `\n\n# Reference: ${docFile}\n${content}`;
            loadedCount++;
        }
    });

    const allFiles = fs.readdirSync(sourceDocsDir).filter(f => f.endsWith('.md'));
    const skippedFiles = allFiles.filter(f => !loadedDocs.has(f));
    const indexContent = `\n\n# Other Available Docs (Not Loaded)\nAI can request these if needed:\n` + skippedFiles.map(f => `- ${f}`).join('\n');

    return {
        content: combinedContent + indexContent,
        stats: {
            total: allFiles.length,
            loaded: loadedCount,
            keywords: Array.from(matchedKeywords)
        }
    };
}

module.exports = {
    HPS_DIR,
    readFileSafe,
    loadHpsConfig,
    getHaloContext,
    generateContextContent,
    getSmartContext,
    copyToClipboard
};
