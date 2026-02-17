import { JwtProvider, UserRole } from '../auth/jwt-provider';
import { PayloadGenerator } from '../generator/payload-generator';
import { ApiRunner, TestResult } from './api-runner';
import { ApiEndpoint } from '../openapi/loader';
import { Logger } from '../utils/logger';
import { GraphUtils } from '../utils/graph';

export class TestSuite {
    constructor(private runner: ApiRunner) { }

    async runAll(endpoints: ApiEndpoint[]): Promise<TestResult[]> {
        const roles = Object.values(UserRole);
        Logger.info(`전체 테스트 시작: ${endpoints.length}개 API x ${roles.length}개 Role`);

        // v1.2.0 의존성 기반 정렬 실행
        let sortedEndpoints = endpoints;
        try {
            sortedEndpoints = GraphUtils.topologicalSort(
                endpoints,
                e => e.dependsOn,
                e => e.operationId || `${e.method} ${e.path}`
            );
            Logger.info('의존성 그래프 최적화 완료: 정의된 순서대로 진단을 수행합니다');
        } catch (e: any) {
            Logger.warn(`의존성 정렬 실패: ${e.message}. 기본 순서로 계속합니다.`);
        }

        const allResults: TestResult[] = [];
        for (const endpoint of sortedEndpoints) {
            if (endpoint.seed) {
                Logger.info(`[SEED] 데이터 선행 작업 수행 중: ${endpoint.method} ${endpoint.path}`);
            }

            for (const role of roles) {
                const token = JwtProvider.generateToken(role);
                const headers: any = JwtProvider.getAuthHeader(token);

                // requestBody에서 스키마 추출하여 페이로드 생성
                const schema = (endpoint.requestBody as any)?.content?.['application/json']?.schema;
                const payload = PayloadGenerator.generateFromSchema(schema);

                if (payload) {
                    headers['Content-Type'] = 'application/json';
                }

                try {
                    const result = await this.runner.run(
                        endpoint.path,
                        endpoint.method,
                        role,
                        headers,
                        payload
                    );
                    allResults.push(result);

                    const statusStr = result.status ? `Status: ${result.status}` : `Error: ${result.error}`;
                    Logger.info(`테스트 결과: [${endpoint.method}] ${endpoint.path} (${role}) | ${statusStr} (${result.latency}ms)`);
                } catch (error: any) {
                    Logger.error(`요청 실패: [${endpoint.method}] ${endpoint.path} | ${error.message}`);
                    allResults.push({
                        path: endpoint.path,
                        method: endpoint.method,
                        role: role,
                        requestHeaders: headers,
                        requestPayload: payload,
                        latency: 0,
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                }
            }

            if (endpoint.cleanup) {
                Logger.info(`[CLEANUP] 리소스 정리 작업 수행 중: ${endpoint.method} ${endpoint.path}`);
            }
        }

        Logger.info(`전체 테스트 완료: 총 ${allResults.length}건 실행`);
        return allResults;
    }
}
