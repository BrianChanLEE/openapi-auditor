import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from '../utils/logger';

export interface TestResult {
    path: string;
    method: string;
    role: string;
    requestPayload?: any;
    requestHeaders?: any;
    status?: number;
    data?: any;
    responseHeaders?: any;
    latency: number;
    error?: string;
    timestamp: string;
}

export class ApiRunner {
    private baseUrl: string;
    private timeout: number;
    private maxRetries: number = 3;

    constructor(baseUrl: string, timeout: number = 5000) {
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        this.timeout = timeout;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async run(
        path: string,
        method: string,
        role: string,
        headers: any = {},
        payload?: any
    ): Promise<TestResult> {
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
            validateStatus: () => true,
        };

        let lastError: any;
        let attempt = 0;

        while (attempt <= this.maxRetries) {
            const startTime = Date.now();
            try {
                if (attempt > 0) {
                    Logger.info(`재시도 중... (${attempt}/${this.maxRetries}): [${method}] ${path}`);
                }

                Logger.debug(`요청 호출: [${method}] ${url} (Role: ${role})`);
                const response: AxiosResponse = await axios(config);
                const latency = Date.now() - startTime;

                if (response.status === 429 && attempt < this.maxRetries) {
                    const retryAfter = parseInt(response.headers['retry-after'] || '0') * 1000 || Math.pow(2, attempt) * 1000;
                    Logger.warn(`HTTP 429 감지. ${retryAfter}ms 후 재시도합니다.`);
                    await this.sleep(retryAfter);
                    attempt++;
                    continue;
                }

                return {
                    path,
                    method,
                    role,
                    requestPayload: payload,
                    requestHeaders: config.headers,
                    status: response.status,
                    data: response.data,
                    responseHeaders: response.headers,
                    latency,
                    timestamp: new Date().toISOString(),
                };
            } catch (error: any) {
                const latency = Date.now() - startTime;
                lastError = error;

                if (attempt < this.maxRetries && (error.code === 'ECONNABORTED' || error.response?.status >= 500)) {
                    const backoff = Math.pow(2, attempt) * 1000;
                    Logger.warn(`네트워크 오류/서버 에러 (${error.message}). ${backoff}ms 후 재시도합니다.`);
                    await this.sleep(backoff);
                    attempt++;
                    continue;
                }

                Logger.error(`요청 실패: [${method}] ${path} | Error: ${error.message}`);
                return {
                    path,
                    method,
                    role,
                    requestPayload: payload,
                    requestHeaders: config.headers,
                    latency,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                };
            }
        }

        return {
            path,
            method,
            role,
            requestPayload: payload,
            requestHeaders: config.headers,
            latency: 0,
            error: `최대 재시도 횟수 초과: ${lastError?.message}`,
            timestamp: new Date().toISOString(),
        };
    }
}
