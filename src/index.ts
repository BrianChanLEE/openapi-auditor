import { OpenApiLoader } from './openapi/loader';
import { Logger } from './utils/logger';
import { ApiRunner } from './runner/api-runner';
import { TestSuite } from './runner/test-suite';
import { ResultAnalyzer } from './analyzer/result-analyzer';
import { PriorityEngine } from './analyzer/priority-engine';
import { MarkdownReporter } from './reporter/markdown-reporter';
import path from 'path';

async function main() {
    const samplePath = path.join(__dirname, '../examples/sample-openapi.json');
    const baseUrl = 'http://localhost:3000';

    try {
        const doc = await OpenApiLoader.load(samplePath);
        const endpoints = OpenApiLoader.parseEndpoints(doc);

        console.log('\n--- [세션 5] 리포트 생성 테스트 시작 ---\n');

        // 1. 실제 실행
        const runner = new ApiRunner(baseUrl);
        const suite = new TestSuite(runner);
        const rawResults = await suite.runAll(endpoints);

        // 2. 분석 및 우선순위 산정
        const analyzedResults = rawResults.map(res => {
            const analysis = ResultAnalyzer.analyze(res);
            const priority = PriorityEngine.calculate(analysis);
            return { ...analysis, priority };
        });

        // 3. 리포트 생성
        const reportDir = path.join(process.cwd(), 'reports');
        const reportPath = MarkdownReporter.generate(analyzedResults, reportDir);

        Logger.info(`최종 결과물 확인: ${reportPath}`);

        console.log('\n--- 세션 5 검증 완료 ---');
    } catch (error: any) {
        Logger.error(`검증 실행 중 오류 발생: ${error.message}`);
        process.exit(1);
    }
}

main();
