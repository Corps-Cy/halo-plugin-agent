const fs = require('fs');
const path = require('path');
const { colors, selectOption, TaskRunner, BACK_SIGNAL } = require('../core/ui');
const { installSkill } = require('../core/utils');

async function skillCommand(args) {
    const runner = new TaskRunner();
    let selectedTool = 'opencode';

    runner.addTask(() => "Select AI Agent", async () => {
        const options = [
            { label: "Opencode Agent", value: "opencode", description: "Install to .opencode/skills/" },
            { label: "Cursor IDE", value: "cursor", description: "Install to .cursor/rules/" },
            { label: "Windsurf IDE", value: "windsurf", description: "Install to .windsurf/rules/" },
            { label: "Trae IDE", value: "trae", description: "Install to .trae/rules/" },
            { label: "General / Other", value: "general", description: "Install to .hps/skills/" }
        ];

        const result = await selectOption("Select your AI Agent to install the skill:", options);
        if (result === BACK_SIGNAL) return;
        selectedTool = result;
    });

    runner.addTask(() => "Install Skill", async () => {
        const targetDir = process.cwd();
        console.log(`\n${colors.dim}Installing into: ${targetDir}${colors.reset}`);
        
        try {
            const msg = installSkill(targetDir, selectedTool);
            console.log(`\n${colors.green}${msg}${colors.reset}\n`);
        } catch (e) {
            console.error(`\n${colors.red}Error:${colors.reset} ${e.message}`);
        }
    });

    await runner.run();
}

module.exports = skillCommand;
