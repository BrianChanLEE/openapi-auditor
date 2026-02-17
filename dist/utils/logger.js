"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    static mask(data) {
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
                }
                else if (typeof masked[key] === 'object') {
                    masked[key] = this.mask(masked[key]);
                }
            }
            return masked;
        }
        return data;
    }
    static format(message, data) {
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
    static info(message, data) {
        console.log(chalk_1.default.blue(`[INFO] ${this.format(message, data)}`));
    }
    static warn(message, data) {
        console.warn(chalk_1.default.yellow(`[WARN] ${this.format(message, data)}`));
    }
    static error(message, data) {
        console.error(chalk_1.default.red(`[ERROR] ${this.format(message, data)}`));
    }
    static debug(message, data) {
        if (process.env.DEBUG) {
            console.debug(chalk_1.default.gray(`[DEBUG] ${this.format(message, data)}`));
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map