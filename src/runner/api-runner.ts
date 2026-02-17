import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from '../utils/logger';

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

export class ApiRunner {
    private baseUrl: string;
    private timeout: number;

    constructor(baseUrl: string, timeout: number = 5000) {
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        this.timeout = timeout;
    }

    async run(
        path: string,
        method: string,
        role: string,
        headers: any = {},
        payload?: any
    ): Promise<TestResult> {
        const startTime = Date.now();
        const url = `${this.baseUrl}${path}`;

        const config: AxiosRequestConfig = {
            url,
            method: method as any,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            data: payload,
            timeout: this.timeout,
            validateStatus: () => true, // 모든 상태 코드를 수용하여 분석기로 전달
        };

        try {
            Logger.debug(`요청 호출: [${method}] ${url} (Role: ${role})`);
            const response: AxiosResponse = await axios(config);
            const latency = Date.now() - startTime;

            return {
                path,
                method,
                role,
                requestPayload: payload,
                status: response.status,
                data: response.data,
                latency,
                timestamp: new Date().toISOString(),
            };
        } catch (error: any) {
            const latency = Date.now() - startTime;
            Logger.error(`요청 실패: [${method}] ${path} | Error: ${error.message}`);

            return {
                path,
                method,
                role,
                requestPayload: payload,
                latency,
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
}
