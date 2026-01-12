const { execSync } = require('child_process');
const os = require('os');

function checkJava() {
    try {
        const output = execSync('java -version', { stdio: 'pipe', encoding: 'utf8' });
        // java -version output goes to stderr usually
    } catch (e) {
        // Fallback to check stderr if execSync throws or captures stderr
        const versionStr = e.stderr || e.stdout || "";
        const match = versionStr.match(/version "(.*?)"/) || versionStr.match(/version (.*?)\s/);
        
        if (versionStr.includes("version")) {
            // Basic check if Java 17+
            // "17.0.1", "1.8.0" (Start with 1. -> old)
            // But usually simply checking existence is good step 1.
            // For rigorous check:
            const v = match ? match[1] : "";
            if (v.startsWith("1.8")) return { ok: false, msg: `Java ${v} detected. Halo 2.x requires Java 17+.` };
            const major = parseInt(v.split('.')[0]);
            if (major < 17) return { ok: false, msg: `Java ${v} detected. Halo 2.x requires Java 17+.` };
            
            return { ok: true, msg: `Java ${v}` };
        }
        return { ok: false, msg: "Java not found or error parsing version." };
    }
    // If command succeeds (no error thrown), it might still be in stderr
    try {
        const out = execSync('java -version 2>&1', { encoding: 'utf8' });
        const match = out.match(/version "(.*?)"/) || out.match(/version (.*?)\s/);
        if (match) {
            const v = match[1];
             // Parse logic same as above
             if (v.startsWith("1.")) { // 1.8 etc
                const sub = v.split('.')[1];
                if (parseInt(sub) < 17 && !v.startsWith("17")) return { ok: false, msg: `Java ${v} (Too Old)` };
             } else {
                const major = parseInt(v.split('.')[0]);
                if (major < 17) return { ok: false, msg: `Java ${v} (Too Old)` };
             }
             return { ok: true, msg: `Java ${v}` };
        }
        return { ok: true, msg: "Java detected (Version unknown)" };
    } catch(e) {
        return { ok: false, msg: "Java command failed." };
    }
}

function checkNode() {
    try {
        const v = process.version; // v20.1.0
        const major = parseInt(v.substring(1).split('.')[0]);
        if (major < 18) return { ok: false, msg: `Node.js ${v} detected. Recommended: 18+.` };
        return { ok: true, msg: `Node.js ${v}` };
    } catch (e) {
        return { ok: false, msg: "Node.js check failed" };
    }
}

function checkDocker() {
    try {
        execSync('docker info', { stdio: 'ignore' });
        return { ok: true, msg: "Docker is running" };
    } catch (e) {
        return { ok: false, msg: "Docker not running or not installed (Recommended for 'haloServer')" };
    }
}

function checkPnpm() {
    try {
        const out = execSync('pnpm -v', { encoding: 'utf8', stdio: 'pipe' }).trim();
        return { ok: true, msg: `pnpm ${out}` };
    } catch (e) {
        return { ok: false, msg: "pnpm not found (Required for Halo Plugin CLI)" };
    }
}

function getSystemInfo() {
    return {
        platform: os.platform(), // 'darwin', 'win32', 'linux'
        arch: os.arch()
    };
}

module.exports = {
    checkJava,
    checkNode,
    checkDocker,
    checkPnpm,
    getSystemInfo
};