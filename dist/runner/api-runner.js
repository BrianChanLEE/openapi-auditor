"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRunner = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
class ApiRunner {
    constructor(baseUrl, timeout = 5000) {
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        this.timeout = timeout;
    }
    async run(path, method, role, headers = {}, payload) {
        const startTime = Date.now();
        const url = `${this.baseUrl}${path}`;
        const config = {
            url,
            method: method,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            data: payload,
            timeout: this.timeout,
            validateStatus: () => true, // 모든 상태 코드를 수용하여 분석기로 전달
        };
        try {
            logger_1.Logger.debug(`요청 호출: [${method}] ${url} (Role: ${role})`);
            const response = await (0, axios_1.default)(config);
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
        }
        catch (error) {
            const latency = Date.now() - startTime;
            logger_1.Logger.error(`요청 실패: [${method}] ${path} | Error: ${error.message}`);
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
exports.ApiRunner = ApiRunner;
//# sourceMappingURL=api-runner.js.map