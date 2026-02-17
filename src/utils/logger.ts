import chalk from 'chalk';
import { Masker } from './masker';

export class Logger {
    private static format(message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        let formattedData = '';
        if (data !== undefined) {
            const maskedData = Masker.mask(data);
            formattedData = typeof maskedData === 'object'
                ? ` | Data: ${JSON.stringify(maskedData)}`
                : ` | Data: ${maskedData}`;
        }
        return `[${timestamp}] ${message}${formattedData}`;
    }

    static info(message: string, data?: any): void {
        console.log(chalk.blue(`[INFO] ${this.format(message, data)}`));
    }

    static warn(message: string, data?: any): void {
        console.warn(chalk.yellow(`[WARN] ${this.format(message, data)}`));
    }

    static error(message: string, data?: any): void {
        console.error(chalk.red(`[ERROR] ${this.format(message, data)}`));
    }

    static debug(message: string, data?: any): void {
        if (process.env.DEBUG) {
            console.debug(chalk.gray(`[DEBUG] ${this.format(message, data)}`));
        }
    }
}
