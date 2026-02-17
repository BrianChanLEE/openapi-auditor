import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI } from 'openapi-types';
import { Logger } from '../utils/logger';

export interface ApiEndpoint {
    path: string;
    method: string;
    operationId?: string;
    summary?: string;
    parameters: any[];
    requestBody?: any;
    responses: any;
}

export class OpenApiLoader {
    static async load(pathOrUrl: string): Promise<OpenAPI.Document> {
        try {
            Logger.info(`OpenAPI 문서 로드 중: ${pathOrUrl}`);
            const api = await SwaggerParser.bundle(pathOrUrl);
            Logger.info(`OpenAPI 문서 로드 완료: ${api.info.title} (${api.info.version})`);
            return api;
        } catch (error: any) {
            Logger.error(`OpenAPI 문서 로드 실패: ${pathOrUrl} | Error: ${error.message}`);
            throw error;
        }
    }

    static parseEndpoints(doc: any): ApiEndpoint[] {
        const endpoints: ApiEndpoint[] = [];
        const paths = doc.paths || {};

        for (const [path, methods] of Object.entries(paths)) {
            for (const [method, operation] of Object.entries(methods as any)) {
                if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
                    const op = operation as any;
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

        Logger.info(`총 ${endpoints.length}개의 API 엔드포인트 추출 완료`);
        return endpoints;
    }
}
