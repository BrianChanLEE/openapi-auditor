export declare class PayloadGenerator {
    /**
     * OpenAPI Schema를 기반으로 더미 페이로드를 생성합니다.
     * @param schema OpenAPI 스키마 객체
     * @returns 생성된 더미 데이터
     */
    static generateFromSchema(schema: any): any;
    /**
     * OpenAPI operation에서 페이로드를 추출합니다.
     */
    static generateFromOperation(operation: any): any;
}
