"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSuite = void 0;
const jwt_provider_1 = require("../auth/jwt-provider");
const payload_generator_1 = require("../generator/payload-generator");
const logger_1 = require("../utils/logger");
class TestSuite {
    constructor(runner) {
        this.runner = runner;
    }
    async runAll(endpoints) {
        const results = [];
        const roles = Object.values(jwt_provider_1.UserRole);
        logger_1.Logger.info(`전체 테스트 시작: ${endpoints.length}개 API x ${roles.length}개 Role`);
        for (const ep of endpoints) {
            for (const role of roles) {
                const token = jwt_provider_1.JwtProvider.generateToken(role);
                const headers = jwt_provider_1.JwtProvider.getAuthHeader(token);
                // requestBody에서 스키마 추출하여 페이로드 생성
                const schema = ep.requestBody?.content?.['application/json']?.schema;
                const payload = payload_generator_1.PayloadGenerator.generateFromSchema(schema);
                const result = await this.runner.run(ep.path, ep.method, role, headers, payload);
                results.push(result);
                const statusStr = result.status ? `Status: ${result.status}` : `Error: ${result.error}`;
                logger_1.Logger.info(`테스트 결과: [${ep.method}] ${ep.path} (${role}) | ${statusStr} (${result.latency}ms)`);
            }
        }
        logger_1.Logger.info(`전체 테스트 완료: 총 ${results.length}건 실행`);
        return results;
    }
}
exports.TestSuite = TestSuite;
//# sourceMappingURL=test-suite.js.map