export declare class Logger {
    private static mask;
    private static format;
    static info(message: string, data?: any): void;
    static warn(message: string, data?: any): void;
    static error(message: string, data?: any): void;
    static debug(message: string, data?: any): void;
}
