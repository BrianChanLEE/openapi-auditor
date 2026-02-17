import { ApiEndpoint } from '../openapi/loader';
import { UserRole, JwtProvider } from '../auth/jwt-provider';
import { PayloadGenerator } from '../generator/payload-generator';
import { ApiRunner, TestResult } from './api-runner';
import { Logger } from '../utils/logger';

export class TestSuite {
    private runner: ApiRunner;

    constructor(runner: ApiRunner) {
        this.runner = runner;
    }

    async runAll(endpoints: ApiEndpoint[]): Promise<TestResult[]> {
        const results: TestResult[] = [];
        const roles = Object.values(UserRole);

        Logger.info(`전체 테스트 시작: ${endpoints.length}개 API x ${roles.length}개 Role`);

        for (const ep of endpoints) {
            for (const role of roles) {
                const token = JwtProvider.generateToken(role);
                const headers = JwtProvider.getAuthHeader(token);

                // requestBody에서 스키마 추출하여 페이로드 생성
                const schema = (ep.requestBody as any)?.content?.['application/json']?.schema;
                const payload = PayloadGenerator.generateFromSchema(schema);

                const result = await this.runner.run(
                    ep.path,
                    ep.method,
                    role,
                    headers,
                    payload
                );

                results.push(result);

                const statusStr = result.status ? `Status: ${result.status}` : `Error: ${result.error}`;
                Logger.info(`테스트 결과: [${ep.method}] ${ep.path} (${role}) | ${statusStr} (${result.latency}ms)`);
            }
        }

        Logger.info(`전체 테스트 완료: 총 ${results.length}건 실행`);
        return results;
    }
}
