import { Logger } from '../utils/logger';

export class PayloadGenerator {
    /**
     * OpenAPI Schema를 기반으로 더미 페이로드를 생성합니다.
     * @param schema OpenAPI 스키마 객체
     * @returns 생성된 더미 데이터
     */
    static generateFromSchema(schema: any): any {
        if (!schema) return undefined;

        // 1. Example이 있을 경우 최우선 사용
        if (schema.example !== undefined) return schema.example;
        if (schema.examples && Array.isArray(schema.examples) && schema.examples.length > 0) return schema.examples[0];

        // 2. 타입별 기본값 생성
        const type = schema.type;

        switch (type) {
            case 'string':
                if (schema.enum) return schema.enum[0];
                if (schema.format === 'date-time') return new Date().toISOString();
                if (schema.format === 'date') return new Date().toISOString().split('T')[0];
                if (schema.format === 'email') return 'test@example.com';
                return 'string';

            case 'number':
            case 'integer':
                if (schema.enum) return schema.enum[0];
                return 0;

            case 'boolean':
                return true;

            case 'array':
                const items = schema.items;
                return [this.generateFromSchema(items)];

            case 'object':
                const properties = schema.properties || {};
                const obj: any = {};
                for (const [key, prop] of Object.entries(properties)) {
                    obj[key] = this.generateFromSchema(prop);
                }
                return obj;

            default:
                // schema.allOf, anyOf, oneOf 등 복합 스키마는 첫 번째 요소 사용
                if (schema.oneOf || schema.anyOf || schema.allOf) {
                    const list = schema.oneOf || schema.anyOf || schema.allOf;
                    return this.generateFromSchema(list[0]);
                }
                return {};
        }
    }

    /**
     * OpenAPI operation에서 페이로드를 추출합니다.
     */
    static generateFromOperation(operation: any): any {
        const requestBody = operation.requestBody;
        if (!requestBody || !requestBody.content) return undefined;

        // application/json 우선 처리
        const content = requestBody.content['application/json'];
        if (!content || !content.schema) return undefined;

        return this.generateFromSchema(content.schema);
    }
}
