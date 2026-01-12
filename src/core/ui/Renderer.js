const readline = require('readline');

class Renderer {
    constructor(stream = process.stdout) {
        this.stream = stream;
        this.linesRendered = 0;
    }

    /**
     * Calculate the visual width of a string, accounting for ANSI codes (0 width)
     * and CJK characters (2 width).
     */
    getVisualWidth(str) {
        // Remove ANSI codes
        // eslint-disable-next-line no-control-regex
        const plain = str.replace(/\x1b\[[0-9;]*m/g, '');
        
        let width = 0;
        for (let i = 0; i < plain.length; i++) {
            const code = plain.charCodeAt(i);
            // Rough check for CJK/Full-width characters
            // Range: 0x2E80-0x9FFF (CJK), 0xAC00-0xD7A3 (Hangul), 0xF900-0xFAFF (CJK Comp), 0xFE10-0xFE1F (Vertical), 0xFE30-0xFE6F (CJK Sym), 0xFF00-0xFFEF (Fullwidth)
            if (
                (code >= 0x2E80 && code <= 0x9FFF) || 
                (code >= 0xAC00 && code <= 0xD7A3) || 
                (code >= 0xF900 && code <= 0xFAFF) || 
                (code >= 0xFE10 && code <= 0xFE1F) ||
                (code >= 0xFE30 && code <= 0xFE6F) ||
                (code >= 0xFF00 && code <= 0xFFEF)
            ) {
                width += 2;
            } else {
                width += 1;
            }
        }
        return width;
    }

    countVisualLines(content) {
        const columns = this.stream.columns || 80;
        const rawLines = content.split('\n');
        
        let totalRows = 0;
        
        for (let i = 0; i < rawLines.length; i++) {
            const line = rawLines[i];
            const width = this.getVisualWidth(line);
            
            // If line is empty, it still occupies 1 row (unless it's the very last split element of "A\n")
            // Actually "A\n".split('\n') -> ["A", ""]. The "" is the newline effect.
            // If split results in "", it means there was a trailing newline, so we are on a new line.
            // But wait, "A\n" occupies 2 rows? Row 1: "A", Row 2: (Cursor start).
            // Yes.
            
            if (width === 0) {
                 // Empty line occupies 1 row
                 totalRows += 1;
            } else {
                // Determine wrapping
                // If width is 80 and columns is 80, does it wrap? 
                // Usually writing 80 chars moves cursor to next line automatically OR stays at end.
                // It depends on terminal. Most wrap.
                // Math.ceil(81/80) = 2. Math.ceil(80/80) = 1.
                
                const rows = Math.ceil(width / columns) || 1; // At least 1
                totalRows += rows;
            }
        }
        
        // Correction: content.split('\n') for "A\nB" gives ["A", "B"]. 
        // Logic above sums rows for A and B.
        // If content is "A\n", split gives ["A", ""].
        // A is 1 row. "" is 1 row. Total 2. Correct.
        // If content is "A", split gives ["A"]. Total 1. Correct.
        
        // However, we need to subtract 1 because `linesRendered` implies "how many lines UP to move to get to start".
        // If we occupy 1 row, we move up 0 lines (we are on the same line).
        // If we occupy 2 rows, we move up 1 line.
        
        return Math.max(0, totalRows - 1);
    }

    render(content) {
        // 1. Clear previous output
        if (this.linesRendered > 0) {
            readline.moveCursor(this.stream, 0, -this.linesRendered);
            readline.cursorTo(this.stream, 0); 
            readline.clearScreenDown(this.stream);
        } else if (this.linesRendered === 0 && content.length > 0) {
             readline.cursorTo(this.stream, 0);
             readline.clearScreenDown(this.stream);
        }

        // 2. Write new content
        this.stream.write(content);

        // 3. Track lines for next clear
        this.linesRendered = this.countVisualLines(content);
    }

    hideCursor() {
        this.stream.write('\x1b[?25l');
    }

    showCursor() {
        this.stream.write('\x1b[?25h');
    }
}

module.exports = Renderer;
