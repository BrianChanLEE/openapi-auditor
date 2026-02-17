import chalk from 'chalk';

export class Logger {
    private static mask(data: any): any {
        if (typeof data === 'string') {
            // Mask common auth headers/tokens in strings
            return data.replace(/(Authorization|Cookie|token|secret)([:= ])(\s*)([^\s,;&]+)/gi, '$1$2$3****');
        }
        if (typeof data === 'object' && data !== null) {
            const masked = { ...data };
            const sensitiveKeys = ['authorization', 'cookie', 'token', 'secret', 'password'];
            for (const key of Object.keys(masked)) {
                if (sensitiveKeys.includes(key.toLowerCase())) {
                    masked[key] = '****';
                } else if (typeof masked[key] === 'object') {
                    masked[key] = this.mask(masked[key]);
                }
            }
            return masked;
        }
        return data;
    }

    private static format(message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        let formattedData = '';
        if (data !== undefined) {
            const maskedData = this.mask(data);
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
