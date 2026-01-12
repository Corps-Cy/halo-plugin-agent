const { execSync } = require('child_process');
const os = require('os');
const { colors } = require('../ui');

const PLATFORM = os.platform(); // 'darwin', 'win32', 'linux'

// --- Helpers ---
function execSafe(cmd) {
    try {
        execSync(cmd, { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}

function getManualLink(tool) {
    const links = {
        java: "https://adoptium.net/temurin/releases/?version=17",
        node: "https://nodejs.org/en/download/",
        pnpm: "https://pnpm.io/installation",
        docker: "https://www.docker.com/products/docker-desktop/"
    };
    return links[tool] || "";
}

// --- Installers ---
const installers = {
    pnpm: {
        name: "pnpm",
        install: () => {
            // Try npm first
            if (execSafe('npm --version')) {
                execSync('npm install -g pnpm', { stdio: 'pipe' });
                return true;
            }
            // Mac brew
            if (PLATFORM === 'darwin' && execSafe('brew --version')) {
                execSync('brew install pnpm', { stdio: 'pipe' });
                return true;
            }
            return false;
        }
    },
    java: {
        name: "Java 17+",
        install: () => {
            if (PLATFORM === 'darwin' && execSafe('brew --version')) {
                // Use Temurin (Adoptium) as it's standard and easy via cask
                execSync('brew install --cask temurin@17', { stdio: 'pipe' });
                return true;
            }
            if (PLATFORM === 'win32' && execSafe('winget --version')) {
                execSync('winget install -e --id EclipseAdoptium.Temurin.17.JDK', { stdio: 'pipe' });
                return true;
            }
            // Linux: Too varied (apt, yum, dnf, pacman). Skip auto-install.
            return false;
        }
    },
    node: {
        name: "Node.js 18+",
        install: () => {
            if (PLATFORM === 'darwin' && execSafe('brew --version')) {
                execSync('brew install node@20', { stdio: 'pipe' });
                return true;
            }
            if (PLATFORM === 'win32' && execSafe('winget --version')) {
                execSync('winget install -e --id OpenJS.NodeJS.LTS', { stdio: 'pipe' });
                return true;
            }
            // We assume nvm/n might be used, which makes auto-install tricky.
            return false;
        }
    }
};

async function attemptInstall(toolKey, log) {
    const installer = installers[toolKey];
    if (!installer) return false;

    try {
        log.info(`Attempting to install ${installer.name}...`);
        const success = installer.install();
        if (success) {
            log.success(`Successfully installed ${installer.name}`);
            return true;
        }
    } catch (e) {
        const msg = e.stderr ? e.stderr.toString() : (e.message || "Unknown error");
        log.error(`Installation failed: ${msg.split('\n')[0]}`);
    }
    return false;
}

module.exports = {
    getManualLink,
    attemptInstall
};
