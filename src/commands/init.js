const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { TaskRunner, selectOption, askQuestion, colors, log, BACK_SIGNAL } = require('../core/ui/index');
const { getHaloContext, generateContextContent, HPS_DIR, installSkill } = require('../core/utils');
const templates = require('../data/templates');
const { t, setLang, getLang } = require('../data/locales');
const envChecks = require('../core/env/checker');
const { attemptInstall, getManualLink } = require('../core/env/installer');

async function cmdInit(args) {
    const runner = new TaskRunner();
    
    // Initial args
    let projectName = args[0] || null;
    let domain = "run.halo.plugin";
    let author = "";
    let includeUI = true;
    let uiTool = "rsbuild";
    
    let targetDir = process.cwd();
    let selectedTool = 'general';
    let pendingLaunch = null; 

    // --- Phase 1: Interactive Collection (Reversible) ---

    // 1. Language
    runner.addTask(() => t('select_lang'), async () => {
        const langOptions = [
            { label: "中文 (Chinese)", value: "zh", description: "使用中文界面和提示词" },
            { label: "English", value: "en", description: "Use English interface and prompts" },
            { label: "日本語 (Japanese)", value: "ja", description: "日本語インターフェースとプロンプトを使用" }
        ];
        const result = await selectOption(t('select_lang'), langOptions);
        if (result === BACK_SIGNAL) return BACK_SIGNAL;
        
        setLang(result);
    });

    // 2. Environment Check (NEW - Enhanced)
    runner.addTask(() => t('env_check_title'), async () => {
        log.suspend(); 
        // Run checks
        const sys = envChecks.getSystemInfo();
        const status = {
            java: envChecks.checkJava(),
            node: envChecks.checkNode(),
            docker: envChecks.checkDocker(),
            pnpm: envChecks.checkPnpm()
        };
        
        // Helper to format log lines
        const logLine = (labelKey, statusObj) => {
            const statusText = statusObj.ok 
                ? `${colors.green}✔ ${statusObj.msg}${colors.reset}`
                : `${colors.red}✖ ${statusObj.msg}${colors.reset}`;
            return t(labelKey).replace('{status}', statusText);
        };

        console.log(`\n${colors.dim}----------------------------------------${colors.reset}`);
        console.log(t('check_os').replace('{os}', sys.platform).replace('{arch}', sys.arch));
        console.log(logLine('check_java', status.java));
        console.log(logLine('check_node', status.node));
        console.log(logLine('check_docker', status.docker));
        console.log(logLine('check_pnpm', status.pnpm));
        console.log(`${colors.dim}----------------------------------------${colors.reset}\n`);

        // Check for Auto-Install Opportunities
        const missing = [];
        if (!status.pnpm.ok) missing.push('pnpm');
        if (!status.java.ok) missing.push('java');
        if (!status.node.ok) missing.push('node');

        if (missing.length > 0) {
            // Interactive Fix Loop
            for (const tool of missing) {
                const link = getManualLink(tool);
                // Docker is skipped for auto-install, pnpm/java/node are supported
                if (tool === 'docker') continue; 

                const installPrompt = `Missing ${tool}. Install automatically?`;
                const choice = await selectOption(installPrompt, [
                    { label: "Yes (Recommended)", value: "yes" },
                    { label: "No (Manual)", value: "no" }
                ]);
                
                if (choice === BACK_SIGNAL) return BACK_SIGNAL;

                if (choice === 'yes') {
                    console.log(`${colors.cyan}Attempting to install ${tool}...${colors.reset}`);
                    const installed = await attemptInstall(tool, { info: console.log, success: console.log, error: console.error });
                    
                    if (installed) {
                        // Re-verify
                        const reCheck = envChecks[`check${tool.charAt(0).toUpperCase() + tool.slice(1)}`]() ;
                        if (reCheck.ok) {
                            console.log(`${colors.green}✔ Installed ${tool} successfully!${colors.reset}`);
                            status[tool] = reCheck; // Update status
                            continue;
                        }
                    }
                    console.log(`${colors.red}✖ Auto-install failed.${colors.reset}`);
                }
                
                // If failed or user said no
                console.log(`${colors.yellow}Please install ${tool} manually: ${link}${colors.reset}`);
                if (tool === 'pnpm') {
                     // pnpm is critical for next steps
                     process.exit(1); 
                }
            }
        }

        // Final Warning Summary
        if (!status.java.ok) console.log(`${colors.yellow}${t('warn_java')}${colors.reset}`);
        if (!status.docker.ok) {
            console.log(`${colors.dim}${t('warn_docker')}${colors.reset}`);
            console.log(`${colors.cyan}${t('advice_no_docker')}${colors.reset}`);
            console.log(`${colors.dim}${t('advice_no_docker_link')}${colors.reset}`);
        }
        
        await new Promise(r => setTimeout(r, 1000));
    });

    // 3. Project Name
    runner.addTask(() => t('input_project_name'), async () => {
        if (!projectName) {
            projectName = await askQuestion(t('input_project_name'));
            if (!projectName) throw new Error("Project name is required");
        }
    });

    // 4. Domain
    runner.addTask(() => t('input_domain'), async () => {
         const ans = await askQuestion(t('input_domain'));
         if (ans && ans.trim().length > 0) domain = ans;
    });

    // 5. Author
    runner.addTask(() => t('input_author'), async () => {
         const ans = await askQuestion(t('input_author'));
         if (ans) author = ans;
    });

    // 6. UI Selection (Combined Enable/Tool)
    runner.addTask(() => t('ui_enable_title'), async () => {
        const options = [
            { label: t('ui_opt_rsbuild'), value: "rsbuild" },
            { label: t('ui_opt_vite'), value: "vite" },
            { label: t('ui_opt_none'), value: "none" }
        ];
        const result = await selectOption(t('ui_enable_title'), options);
        if (result === BACK_SIGNAL) return BACK_SIGNAL;
        
        if (result === 'none') {
            includeUI = false;
        } else {
            includeUI = true;
            uiTool = result;
        }
    });

    // 7. AI Selection (Moved UP)
    runner.addTask(() => t('config_ai'), async () => {
        const options = [
            { label: "Opencode Agent", value: "opencode", description: "Install for Opencode (.opencode/skills)" },
            { label: "Cursor IDE", value: "cursor", description: "Install for Cursor (.cursor/rules)" },
            { label: "Windsurf IDE", value: "windsurf", description: "Install for Windsurf (.windsurf/rules)" },
            { label: "Trae IDE", value: "trae", description: "Install for Trae (.trae/rules)" },
            { label: "GitHub Copilot", value: "copilot", description: "Generate .github/copilot-instructions.md" },
            { label: "Claude Code", value: "claude", description: t('opt_claude') },
            { label: "Ollama / Local LLM", value: "ollama", description: t('opt_ollama') },
            { label: "Gemini (Google)", value: "gemini", description: t('opt_gemini') },
            { label: "General", value: "general", description: t('opt_general') }
        ];

        const result = await selectOption(t('select_ai'), options);
        if (result === BACK_SIGNAL) return BACK_SIGNAL;

        selectedTool = result;
    });

    // --- Phase 2: Execution (No Return) ---

    // 8. Create Project (Official CLI)
    runner.addTask(() => t('creating_via_cli'), async () => {
        targetDir = path.join(process.cwd(), projectName);
        
        // Check if it's already a Halo plugin project to avoid re-creation
        const isProject = fs.existsSync(targetDir) && (
            fs.existsSync(path.join(targetDir, 'plugin.yaml')) || 
            fs.existsSync(path.join(targetDir, 'src/main/resources/plugin.yaml')) ||
            fs.existsSync(path.join(targetDir, 'build.gradle'))
        );

        if (isProject) {
             // Already a project, we assume the user wants to add HPS support to an existing plugin.
        } else {
            const uiFlag = includeUI ? `--includeUI --uiTool=${uiTool}` : '--includeUI=false';
            const authorPart = author ? `--author="${author}"` : '';
            const cmd = `pnpm create halo-plugin ${projectName} --name=${projectName} --domain=${domain} ${authorPart} ${uiFlag}`;
            
            try {
                // AI NOTE: Must use log.suspend() and stdio: 'inherit'. 
                // 'pipe' will freeze the process if pnpm asks for input.
                // log.suspend() is required to reset the custom terminal renderer.
                log.suspend();
                console.log(`\n${colors.dim}> ${cmd}${colors.reset}\n`);
                execSync(cmd, { stdio: 'inherit' });
                console.log(""); 
            } catch (e) {
                throw new Error(`CLI Failed: ${e.message}`);
            }
        }
    });

    // 9. HPS Init & Config
    runner.addTask(() => t('init_kb'), async () => {
        const hpsDir = path.join(targetDir, HPS_DIR);
        
        if (!fs.existsSync(hpsDir)) {
             [
                path.join(hpsDir, 'current_state'),
                path.join(hpsDir, 'changes'),
                path.join(hpsDir, 'prompts'),
                path.join(hpsDir, 'knowledge')
            ].forEach(d => fs.mkdirSync(d, { recursive: true }));
        }
        
        // Write Project Spec
        fs.writeFileSync(path.join(hpsDir, 'project.md'), templates.hpsProjectSpec(projectName));
        
        // Write Config
        const config = { ai_tool: selectedTool, language: getLang(), project_name: projectName };
        fs.writeFileSync(path.join(hpsDir, 'config.json'), JSON.stringify(config, null, 2));

        // Copy Documentation Summaries to local .hps/knowledge (Crucial for non-Cursor tools)
        try {
            const resDir = path.join(__dirname, '../../resources/docs_summaries');
            const targetKBDir = path.join(hpsDir, 'knowledge');
            if (fs.existsSync(resDir)) {
                const files = fs.readdirSync(resDir);
                files.forEach(file => {
                    if (file.endsWith('.md')) {
                        fs.copyFileSync(path.join(resDir, file), path.join(targetKBDir, file));
                    }
                });
            }
        } catch (e) {
            console.error("Failed to copy knowledge base: " + e.message);
        }

    }, true); // Hidden

    // 10. Gen AI Context Files
    runner.addTask(() => t('gen_files'), async () => {
        const contextData = getHaloContext(); 
        const fullContext = generateContextContent(contextData); 
        
        const write = (p, c) => {
            const dest = path.join(targetDir, p);
            const parent = path.dirname(dest);
            if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
            fs.writeFileSync(dest, c);
        };

        if (selectedTool === 'cursor') {
            const rules = templates.cursorRules(getLang()) + "\n\n" + fullContext;
            write('.cursorrules', rules);
        } else {
            const hpsContext = templates.hpsMd(projectName);
            write('HPS.md', hpsContext + "\n\n" + fullContext);
            const prompt = templates.systemPrompt(getLang()) + "\n\n" + fullContext;
            write(path.join(HPS_DIR, 'prompts/SYSTEM_INSTRUCTION.md'), prompt);
            
            if (selectedTool === 'ollama') {
                const modelfile = `FROM llama3
SYSTEM """
${prompt}
"""`;
                write(path.join(HPS_DIR, 'Modelfile'), modelfile);
            } else if (selectedTool === 'copilot') {
                write('.github/copilot-instructions.md', prompt);
            }
        }

        // Install Agentic Skill (New Feature)
        try {
            const skillMsg = installSkill(targetDir, selectedTool);
            console.log(`\n${colors.cyan}${skillMsg}${colors.reset}`);
        } catch (e) {
            console.error("Skill install error:", e.message);
        }
    }, true); // Hidden

    // Run TaskRunner
    await runner.run();
    
    if (projectName) {
        console.log(`${colors.green}${t('project_ready')} cd ${projectName}${colors.reset}`);
        
        if (selectedTool !== 'general') {
            console.log(`${colors.dim}Skill installed for ${selectedTool}. You can now ask your AI agent to help build the plugin.${colors.reset}`);
        }
    }
}

module.exports = cmdInit;