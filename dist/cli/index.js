#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const loader_1 = require("../openapi/loader");
const logger_1 = require("../utils/logger");
const api_runner_1 = require("../runner/api-runner");
const test_suite_1 = require("../runner/test-suite");
const result_analyzer_1 = require("../analyzer/result-analyzer");
const priority_engine_1 = require("../analyzer/priority-engine");
const markdown_reporter_1 = require("../reporter/markdown-reporter");
const program = new commander_1.Command();
program
    .name('openapi-auditor')
    .description('OpenAPI 기반 API 품질 진단 플랫폼 CLI')
    .version('1.0.0');
// 1. init 명령어
program
    .command('init')
    .description('프로젝트 초기화 및 설정 파일 생성')
    .action(() => {
    const configPath = path_1.default.join(process.cwd(), 'api-quality-config.json');
    const defaultConfig = {
        openapi: './openapi.json',
        baseUrl: 'http://localhost:3000',
        timeout: 5000,
        outputDir: './reports'
    };
    if (fs_1.default.existsSync(configPath)) {
        logger_1.Logger.warn('이미 설정 파일이 존재합니다.');
        return;
    }
    fs_1.default.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    logger_1.Logger.info(`설정 파일 생성 완료: ${configPath}`);
    logger_1.Logger.info('이제 openapi.json 파일을 준비하고 npx openapi-auditor run 명령어를 실행하십시오.');
});
// 2. run 명령어
program
    .command('run')
    .description('API 품질 진단 실행')
    .option('-o, --openapi <path>', 'OpenAPI 문서 경로')
    .option('-b, --baseUrl <url>', '대상 서버 Base URL')
    .option('-d, --outputDir <dir>', '리포트 저장 디렉토리', './reports')
    .action(async (options) => {
    try {
        let openapiPath = options.openapi;
        let baseUrl = options.baseUrl;
        const outputDir = path_1.default.resolve(process.cwd(), options.outputDir);
        // 설정 파일 로드 시도
        const configPath = path_1.default.join(process.cwd(), 'api-quality-config.json');
        if (fs_1.default.existsSync(configPath) && (!openapiPath || !baseUrl)) {
            const config = JSON.parse(fs_1.default.readFileSync(configPath, 'utf8'));
            openapiPath = openapiPath || config.openapi;
            baseUrl = baseUrl || config.baseUrl;
        }
        if (!openapiPath || !baseUrl) {
            logger_1.Logger.error('OpenAPI 경로와 Base URL은 필수입니다. (-o, -b 옵션 또는 설정 파일 사용)');
            return;
        }
        logger_1.Logger.info('--- 진단 프로세스 시작 ---');
        // 1. OpenAPI 로드
        const doc = await loader_1.OpenApiLoader.load(openapiPath);
        const endpoints = loader_1.OpenApiLoader.parseEndpoints(doc);
        // 2. 테스트 실행
        const runner = new api_runner_1.ApiRunner(baseUrl);
        const suite = new test_suite_1.TestSuite(runner);
        const rawResults = await suite.runAll(endpoints);
        // 3. 분석 및 우선순위 산정
        const analyzedResults = rawResults.map(res => {
            const analysis = result_analyzer_1.ResultAnalyzer.analyze(res);
            const priority = priority_engine_1.PriorityEngine.calculate(analysis);
            return { ...analysis, priority };
        });
        // 4. 리포트 생성
        const reportPath = markdown_reporter_1.MarkdownReporter.generate(analyzedResults, outputDir);
        logger_1.Logger.info('--- 진단 프로세스 완료 ---');
        logger_1.Logger.info(`리포트 위치: ${reportPath}`);
    }
    catch (error) {
        logger_1.Logger.error(`실행 중 치명적 오류 발생: ${error.message}`);
    }
});
// 3. validate 명령어
program
    .command('validate')
    .description('OpenAPI 문서 유효성 검사')
    .argument('<path>', 'OpenAPI 문서 경로')
    .action(async (path) => {
    try {
        await loader_1.OpenApiLoader.load(path);
        logger_1.Logger.info('OpenAPI 문서가 유효합니다.');
    }
    catch (error) {
        logger_1.Logger.error(`OpenAPI 문서가 유효하지 않습니다: ${error.message}`);
    }
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map