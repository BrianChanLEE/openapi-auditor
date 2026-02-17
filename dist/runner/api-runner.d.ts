export interface TestResult {
    path: string;
    method: string;
    role: string;
    requestPayload?: any;
    status?: number;
    data?: any;
    latency: number;
    error?: string;
    timestamp: string;
}
export declare class ApiRunner {
    private baseUrl;
    private timeout;
    constructor(baseUrl: string, timeout?: number);
    run(path: string, method: string, role: string, headers?: any, payload?: any): Promise<TestResult>;
}
