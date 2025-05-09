import * as fs from 'fs';
import * as path from 'path';

export function logToFile(message: string, logFile: string) {
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(logFile, `${new Date().toISOString()} - ${message}\n`);
}