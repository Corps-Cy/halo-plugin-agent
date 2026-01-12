#!/usr/bin/env node

// Updated relative paths for flattened structure
const { colors } = require('../src/core/ui');
const path = require('path');
const fs = require('fs');
const { init: initLocales } = require('../src/data/locales');

// Import Commands
const cmdInit = require('../src/commands/init');
const cmdNew = require('../src/commands/new');
const cmdContext = require('../src/commands/context');
const cmdApply = require('../src/commands/apply');
const cmdCode = require('../src/commands/code');
const cmdStart = require('../src/commands/start');
const cmdDoctor = require('../src/commands/doctor');

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
${c.dim}      Halo Plugin Spec Kit${c.reset}
`;

function showHelp() {
    console.log(LOGO);
    console.log(`\n${c.bright}🚀 Available Commands:${c.reset}\n`);
    
    const pad = (str, len = 25) => str.padEnd(len);

    console.log(`  ${c.green}hps init${c.reset} ${pad('[name]')} ${c.dim}Initialize HPS project & specs${c.reset}`);
    console.log(`  ${c.green}hps new${c.reset}  ${pad('<feature>')} ${c.dim}Draft a new feature spec${c.reset}`);
    console.log(`  ${c.green}hps code${c.reset} ${pad('<feature>')} ${c.dim}Generate AI coding prompts${c.reset}`);
    console.log(`  ${c.green}hps doctor${c.reset} ${pad('')} ${c.dim}Check & fix environment${c.reset}`);
    console.log(`  ${c.green}hps start${c.reset} ${c.dim}(deprecated)${c.reset}   Launch AI tool`);
    console.log(`  ${c.green}hps context${c.reset} ${c.dim}(internal)${c.reset}     Assemble context`);
    console.log(`  ${c.green}hps apply${c.reset} ${c.dim}(internal)${c.reset}       Merge specs`);
    
    console.log(`\n${c.bright}💡 Quick Start:${c.reset}`);
    console.log(`  1. ${c.cyan}hps init my-plugin${c.reset}`);
    console.log(`  2. ${c.cyan}cd my-plugin && hps new sign-in${c.reset}`);
    console.log(`  3. ${c.cyan}hps code sign-in${c.reset}`);
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
        } else if (command === 'new') {
            await cmdNew(args.slice(1));
        } else if (command === 'start') {
            await cmdStart(args.slice(1));
        } else if (command === 'context') {
            await cmdContext(args[1]);
        } else if (command === 'apply') {
            await cmdApply(args[1]);
        } else if (command === 'code') {
            await cmdCode(args.slice(1));
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