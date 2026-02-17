"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loader_1 = require("./openapi/loader");
const logger_1 = require("./utils/logger");
const api_runner_1 = require("./runner/api-runner");
const test_suite_1 = require("./runner/test-suite");
const result_analyzer_1 = require("./analyzer/result-analyzer");
const priority_engine_1 = require("./analyzer/priority-engine");
const markdown_reporter_1 = require("./reporter/markdown-reporter");
const path_1 = __importDefault(require("path"));
async function main() {
    const samplePath = path_1.default.join(__dirname, '../examples/sample-openapi.json');
    const baseUrl = 'http://localhost:3000';
    try {
        const doc = await loader_1.OpenApiLoader.load(samplePath);
        const endpoints = loader_1.OpenApiLoader.parseEndpoints(doc);
        console.log('\n--- [세션 5] 리포트 생성 테스트 시작 ---\n');
        // 1. 실제 실행
        const runner = new api_runner_1.ApiRunner(baseUrl);
        const suite = new test_suite_1.TestSuite(runner);
        const rawResults = await suite.runAll(endpoints);
        // 2. 분석 및 우선순위 산정
        const analyzedResults = rawResults.map(res => {
            const analysis = result_analyzer_1.ResultAnalyzer.analyze(res);
            const priority = priority_engine_1.PriorityEngine.calculate(analysis);
            return { ...analysis, priority };
        });
        // 3. 리포트 생성
        const reportDir = path_1.default.join(process.cwd(), 'reports');
        const reportPath = markdown_reporter_1.MarkdownReporter.generate(analyzedResults, reportDir);
        logger_1.Logger.info(`최종 결과물 확인: ${reportPath}`);
        console.log('\n--- 세션 5 검증 완료 ---');
    }
    catch (error) {
        logger_1.Logger.error(`검증 실행 중 오류 발생: ${error.message}`);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map