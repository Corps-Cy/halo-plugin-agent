const readline = require('readline');
const Renderer = require('./Renderer');
const ProgressBar = require('./components/ProgressBar');
const SelectMenu = require('./components/SelectMenu');
const { t } = require('../../data/locales');

const BACK_SIGNAL = Symbol('BACK');

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    white: "\x1b[37m"
};

const renderer = new Renderer();

const state = {
    // title: "", // REMOVED: Managed externally
    tasks: { total: 0, current: 0, name: "" },
    prompt: null, 
    done: false
};

function render() {
    let output = "";
    // Title is printed once at start, not re-rendered every frame to avoid clearing issues
    
    if (state.tasks.total > 0 && !state.done) {
        output += ProgressBar({
            current: state.tasks.current,
            total: state.tasks.total,
            taskName: state.tasks.name,
            colors
        }) + "\n";
    }
    
    if (state.prompt) {
        output += SelectMenu({
            question: state.prompt.question,
            options: state.prompt.options,
            selectedIndex: state.prompt.selectedIndex,
            colors
        });
        
        const canGoBack = state.tasks.current > 1;
        const navHint = canGoBack 
            ? t('nav_hint') 
            : t('nav_hint_first');
            
        output += `\n${colors.dim}${navHint}${colors.reset}\n`;
    }
    
    if (state.done) {
        output += `\n${colors.green}✔ ${t('init_complete')}${colors.reset}\n`;
    }
    
    renderer.render(output);
}

function setupInput() {
    if (process.stdin.isTTY) {
        process.stdin.resume();
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', handleKeypress);
    }
}

function cleanupInput() {
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
        process.stdin.removeListener('keypress', handleKeypress);
    }
    process.stdin.pause();
}

function handleKeypress(str, key) {
    if (!state.prompt) return; 
    
    if (key.name === 'c' && key.ctrl) process.exit();
    
    if (key.name === 'up') {
        state.prompt.selectedIndex = (state.prompt.selectedIndex - 1 + state.prompt.options.length) % state.prompt.options.length;
        render();
    }
    if (key.name === 'down') {
        state.prompt.selectedIndex = (state.prompt.selectedIndex + 1) % state.prompt.options.length;
        render();
    }
    
    if (key.name === 'left') {
        if (state.tasks.current <= 1) return;
        
        const resolve = state.prompt.resolve;
        state.prompt = null;
        render();
        resolve(BACK_SIGNAL);
        return;
    }

    if (key.name === 'return') {
        const result = state.prompt.options[state.prompt.selectedIndex].value;
        const resolve = state.prompt.resolve;
        state.prompt = null; 
        render();
        resolve(result);
    }
}

// ... Logger ...
const log = {
    step: () => {},
    success: () => {},
    info: () => {},
    error: (msg) => {
        renderer.showCursor();
        console.error(`\n${colors.red}✖ ${msg}${colors.reset}`);
        cleanupInput();
    }
};

function isTaskInteractive(taskName) {
    if (!taskName) return false;
    return taskName.includes("Select") || taskName.includes("选择") || taskName.includes("言語") || taskName.includes("AI") || taskName.includes("Launch") || taskName.includes("启动");
}

class TaskRunner {
    constructor() {
        this.tasks = [];
    }

    addTask(nameFn, fn, hidden = false) {
        this.tasks.push({ nameFn, fn, hidden });
    }

    async run() {
        setupInput();
        renderer.hideCursor();
        
        // Print Title ONCE
        console.log(`\n${colors.bright}${colors.blue}${t('start_workflow') || "🚀 Starting..."}${colors.reset}\n`);
        
        const visibleTasks = this.tasks.filter(t => !t.hidden);
        state.tasks.total = visibleTasks.length;
        
        let index = 0;

        // REMOVED: Initial Render (loop handles it)
        // render(); 

        while (index < this.tasks.length) {
            const task = this.tasks[index];
            const taskName = typeof task.nameFn === 'function' ? task.nameFn() : task.nameFn;
            
            let currentVisible = 0;
            for(let j=0; j<=index; j++) {
                if(!this.tasks[j].hidden) currentVisible++;
            }
            state.tasks.current = currentVisible;
            state.tasks.name = taskName;
            
            // Render BEFORE the task execution to show updated progress/name
            render(); 

            try {
                const result = await task.fn();
                
                if (result === BACK_SIGNAL) {
                    let prevIndex = index - 1;
                    while (prevIndex >= 0) {
                        const prevTask = this.tasks[prevIndex];
                        const prevName = typeof prevTask.nameFn === 'function' ? prevTask.nameFn() : prevTask.nameFn;
                        if (isTaskInteractive(prevName)) {
                            break; 
                        }
                        prevIndex--;
                    }
                    
                    if (prevIndex >= 0) {
                        index = prevIndex;
                        continue; 
                    } else {
                        continue;
                    }
                }

                if (!task.hidden && !isTaskInteractive(taskName)) {
                    await new Promise(r => setTimeout(r, 400));
                }
                
                index++; 

            } catch (e) {
                log.error(e.message);
                process.exit(1);
            }
        }

        state.done = true;
        render();
        renderer.showCursor();
        cleanupInput();
    }
}

function selectOption(question, options) {
    if (!process.stdin.isTTY) return Promise.resolve(options[0].value);
    return new Promise((resolve) => {
        state.prompt = { question, options, selectedIndex: 0, resolve };
        render();
    });
}

function askQuestion(query) {
    if (!process.stdin.isTTY) return Promise.resolve('default');
    
    return new Promise(resolve => {
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        process.stdin.removeListener('keypress', handleKeypress);
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        renderer.showCursor();
        
        // Use a clean prompt format
        const promptText = `\n${colors.cyan}? ${query}${colors.reset} `;
        
        rl.question(promptText, (answer) => {
            rl.close();
            renderer.hideCursor();
            
            // CLEANUP: 
            // 1. Move cursor up to the line where prompt started.
            //    Prompt starts with \n, so it's 1 line down from where render() left off.
            //    Plus user input + enter might add another line?
            //    Let's move up 2 lines (Prompt + Input/Newline) and clear down.
            
            // Note: This assumes the prompt+input didn't wrap multiple lines.
            readline.moveCursor(process.stdout, 0, -2);
            readline.clearScreenDown(process.stdout);
            
            if (process.stdin.isTTY) process.stdin.setRawMode(true);
            process.stdin.on('keypress', handleKeypress);
            process.stdin.resume();
            
            resolve(answer.trim());
        });
    });
}

module.exports = { colors, log, TaskRunner, selectOption, askQuestion, BACK_SIGNAL };
