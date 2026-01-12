const { checkJava, checkNode, checkDocker, checkPnpm, getSystemInfo } = require('../core/env/checker');
const { attemptInstall, getManualLink } = require('../core/env/installer');
const { TaskRunner, selectOption, colors, log } = require('../core/ui');
const { t } = require('../data/locales');

async function cmdDoctor(args = []) {
    const runner = new TaskRunner();
    
    // State
    const status = {
        java: { ok: false, msg: "" },
        node: { ok: false, msg: "" },
        pnpm: { ok: false, msg: "" },
        docker: { ok: false, msg: "" }
    };
    
    let criticalFail = false;

    // 1. Run Checks
    runner.addTask(() => t('env_check_title'), async () => {
        const sys = getSystemInfo();
        console.log(`\n${colors.dim}System: ${sys.platform} (${sys.arch})${colors.reset}`);
        
        // Parallel checks? No, sequence is fine for CLI logging
        status.java = checkJava();
        status.node = checkNode();
        status.docker = checkDocker();
        status.pnpm = checkPnpm();
        
        const logLine = (label, s) => {
            const icon = s.ok ? `${colors.green}✔${colors.reset}` : `${colors.red}✖${colors.reset}`;
            console.log(`${icon} ${label}: ${s.msg}`);
        };

        logLine("Java", status.java);
        logLine("Node.js", status.node);
        logLine("Docker", status.docker);
        logLine("pnpm", status.pnpm);
        
        await new Promise(r => setTimeout(r, 500));
    });

    // 2. Auto-Fix Loop
    const tools = ['pnpm', 'java', 'node']; // Order matters. pnpm is easiest.
    
    // Warn about Docker (Non-critical)
    if (!status.docker.ok) {
         console.log(`\n${colors.dim}${t('warn_docker')}${colors.reset}`);
         console.log(`${colors.cyan}${t('advice_no_docker')}${colors.reset}`);
         console.log(`${colors.dim}${t('advice_no_docker_link')}${colors.reset}`);
    }

    for (const tool of tools) {
        // We add these tasks dynamically? 
        // No, TaskRunner structure is static list. 
        // We can add them conditionally inside the command function, but before runner.run().
        
        // Actually, we can just process them here inside a single logical task or break them up.
        // For `hps init` integration, we want interactive prompting.
        
        runner.addTask(() => `Verifying ${tool}...`, async () => {
            if (status[tool].ok) return;

            console.log(`\n${colors.yellow}⚠️  Missing requirement: ${tool}${colors.reset}`);
            
            const link = getManualLink(tool);
            const canInstall = true; // We accept all tools defined in installer.js

            const result = await selectOption(
                `Install ${tool} automatically?`,
                [
                    { label: `Yes, install (Recommended)`, value: "yes" },
                    { label: "No, I'll install manually", value: "no" }
                ]
            );

            if (result === 'yes') {
                const installed = await attemptInstall(tool, log);
                if (installed) {
                    // Re-check
                    const reCheck = require('../core/env/checker')[`check${tool.charAt(0).toUpperCase() + tool.slice(1)}`]();
                    if (reCheck.ok) {
                        status[tool] = reCheck;
                        return;
                    }
                }
                console.log(`${colors.red}Automatic installation failed.${colors.reset}`);
            }

            console.log(`Please install manually: ${colors.cyan}${link}${colors.reset}`);
            criticalFail = true;
        }, true); // Hidden task, manages its own output
    }

    await runner.run();
    
    if (criticalFail) {
        console.log(`\n${colors.red}❌ Environment check failed. Please fix issues above and retry.${colors.reset}`);
        process.exit(1);
    } else {
        console.log(`\n${colors.green}✔ Environment is ready!${colors.reset}\n`);
    }
}

module.exports = cmdDoctor;
