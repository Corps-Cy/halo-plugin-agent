#!/usr/bin/env node

// Updated relative paths for flattened structure
const { colors } = require('../src/core/ui');
const path = require('path');
const fs = require('fs');
const { init: initLocales } = require('../src/data/locales');

// Import Commands
const cmdInit = require('../src/commands/init');
const cmdDoctor = require('../src/commands/doctor');
const cmdSkill = require('../src/commands/skill');

// Get Version from package.json (Up one level)
let version = 'unknown';
try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    version = pkg.version;
} catch (e) {
    // ignore
}

const c = colors;

// FINAL LOGO DESIGN: Professional Cyan
const LOGO = `
${c.cyan}██╗  ██╗${c.reset}${c.dim}██████╗ ${c.reset}${c.cyan}███████╗${c.reset}
${c.cyan}██║  ██║${c.reset}${c.dim}██╔══██╗${c.reset}${c.cyan}██╔════╝${c.reset}
${c.cyan}███████║${c.reset}${c.dim}██████╔╝${c.reset}${c.cyan}███████╗${c.reset}
${c.cyan}██╔══██║${c.reset}${c.dim}██╔═══╝ ${c.reset}${c.cyan}╚════██║${c.reset}
${c.cyan}██║  ██║${c.reset}${c.dim}██║     ${c.reset}${c.cyan}███████║${c.reset}
${c.cyan}╚═╝  ╚═╝${c.reset}${c.dim}╚═╝     ${c.reset}${c.cyan}╚══════╝${c.reset} ${c.magenta}v${version}${c.reset}
${c.dim}      Halo Plugin Spec Kit (Agentic Edition)${c.reset}
`;

function showHelp() {
    console.log(LOGO);
    console.log(`\n${c.bright}🚀 Available Commands:${c.reset}\n`);
    
    const pad = (str, len = 25) => str.padEnd(len);

    console.log(`  ${c.green}hps init${c.reset} ${pad('[name]')} ${c.dim}Initialize a new Halo plugin project${c.reset}`);
    console.log(`  ${c.green}hps doctor${c.reset} ${pad('')} ${c.dim}Check & fix environment dependencies${c.reset}`);
    console.log(`  ${c.green}hps skill${c.reset} ${pad('')} ${c.dim}Install the AI Skill to your local agent${c.reset}`);
    
    console.log(`\n${c.bright}💡 Workflow:${c.reset}`);
    console.log(`  1. Run ${c.cyan}hps doctor${c.reset} to verify Java/Node/Halo env.`);
    console.log(`  2. Run ${c.cyan}hps init my-plugin${c.reset} to create the project.`);
    console.log(`  3. Ask your AI Agent: "Help me build a Todo feature for my-plugin."`);
    console.log(``);
}

// --- Main Dispatcher (Native) ---
const args = process.argv.slice(2);
const command = args[0];

(async () => {
    try {
        initLocales(); 

        if (!command || command === 'help' || command === '--help' || command === '-h') {
            showHelp();
            return;
        }

        if (command === 'init') {
            await cmdInit(args.slice(1));
        } else if (command === 'doctor') {
            await cmdDoctor(args.slice(1));
        } else if (command === 'skill') {
            await cmdSkill(args.slice(1));
        } else {
            console.log(`${colors.red}Unknown command: ${command}${colors.reset}`);
            showHelp();
        }
    } catch (err) {
        console.error(`\n${colors.red}Fatal Error:${colors.reset}`, err.message);
        if (process.env.DEBUG) console.error(err);
        process.exit(1);
    }
})();
