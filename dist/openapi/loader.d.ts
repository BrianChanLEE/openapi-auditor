import { OpenAPI } from 'openapi-types';
export interface ApiEndpoint {
    path: string;
    method: string;
    operationId?: string;
    summary?: string;
    parameters: any[];
    requestBody?: any;
    responses: any;
}
export declare class OpenApiLoader {
    static load(pathOrUrl: string): Promise<OpenAPI.Document>;
    static parseEndpoints(doc: any): ApiEndpoint[];
}
