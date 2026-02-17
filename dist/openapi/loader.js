"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiLoader = void 0;
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
const logger_1 = require("../utils/logger");
class OpenApiLoader {
    static async load(pathOrUrl) {
        try {
            logger_1.Logger.info(`OpenAPI 문서 로드 중: ${pathOrUrl}`);
            const api = await swagger_parser_1.default.bundle(pathOrUrl);
            logger_1.Logger.info(`OpenAPI 문서 로드 완료: ${api.info.title} (${api.info.version})`);
            return api;
        }
        catch (error) {
            logger_1.Logger.error(`OpenAPI 문서 로드 실패: ${pathOrUrl} | Error: ${error.message}`);
            throw error;
        }
    }
    static parseEndpoints(doc) {
        const endpoints = [];
        const paths = doc.paths || {};
        for (const [path, methods] of Object.entries(paths)) {
            for (const [method, operation] of Object.entries(methods)) {
                if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
                    const op = operation;
                    endpoints.push({
                        path,
                        method: method.toUpperCase(),
                        operationId: op.operationId,
                        summary: op.summary,
                        parameters: op.parameters || [],
                        requestBody: op.requestBody,
                        responses: op.responses,
                    });
                }
            }
        }
        logger_1.Logger.info(`총 ${endpoints.length}개의 API 엔드포인트 추출 완료`);
        return endpoints;
    }
}
exports.OpenApiLoader = OpenApiLoader;
//# sourceMappingURL=loader.js.map