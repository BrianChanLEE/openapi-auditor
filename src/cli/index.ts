#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { OpenApiLoader } from '../openapi/loader';
import { Logger } from '../utils/logger';
import { ApiRunner } from '../runner/api-runner';
import { TestSuite } from '../runner/test-suite';
import { ResultAnalyzer } from '../analyzer/result-analyzer';
import { PriorityEngine } from '../analyzer/priority-engine';
import { MarkdownReporter } from '../reporter/markdown-reporter';

const program = new Command();

program
    .name('openapi-auditor')
    .description('OpenAPI 기반 API 품질 진단 플랫폼 CLI')
    .version('1.0.0');

// 1. init 명령어
program
    .command('init')
    .description('프로젝트 초기화 및 설정 파일 생성')
    .action(() => {
        const configPath = path.join(process.cwd(), 'api-quality-config.json');
        const defaultConfig = {
            openapi: './openapi.json',
            baseUrl: 'http://localhost:3000',
            timeout: 5000,
            outputDir: './reports'
        };

        if (fs.existsSync(configPath)) {
            Logger.warn('이미 설정 파일이 존재합니다.');
            return;
        }

        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        Logger.info(`설정 파일 생성 완료: ${configPath}`);
        Logger.info('이제 openapi.json 파일을 준비하고 npx openapi-auditor run 명령어를 실행하십시오.');
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
            const outputDir = path.resolve(process.cwd(), options.outputDir);

            // 설정 파일 로드 시도
            const configPath = path.join(process.cwd(), 'api-quality-config.json');
            if (fs.existsSync(configPath) && (!openapiPath || !baseUrl)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                openapiPath = openapiPath || config.openapi;
                baseUrl = baseUrl || config.baseUrl;
            }

            if (!openapiPath || !baseUrl) {
                Logger.error('OpenAPI 경로와 Base URL은 필수입니다. (-o, -b 옵션 또는 설정 파일 사용)');
                return;
            }

            Logger.info('--- 진단 프로세스 시작 ---');

            // 1. OpenAPI 로드
            const doc = await OpenApiLoader.load(openapiPath);
            const endpoints = OpenApiLoader.parseEndpoints(doc);

            // 2. 테스트 실행
            const runner = new ApiRunner(baseUrl);
            const suite = new TestSuite(runner);
            const rawResults = await suite.runAll(endpoints);

            // 3. 분석 및 우선순위 산정
            const analyzedResults = rawResults.map(res => {
                const analysis = ResultAnalyzer.analyze(res);
                const priority = PriorityEngine.calculate(analysis);
                return { ...analysis, priority };
            });

            // 4. 리포트 생성
            const reportPath = MarkdownReporter.generate(analyzedResults, outputDir);

            Logger.info('--- 진단 프로세스 완료 ---');
            Logger.info(`리포트 위치: ${reportPath}`);

        } catch (error: any) {
            Logger.error(`실행 중 치명적 오류 발생: ${error.message}`);
        }
    });

// 3. validate 명령어
program
    .command('validate')
    .description('OpenAPI 문서 유효성 검사')
    .argument('<path>', 'OpenAPI 문서 경로')
    .action(async (path) => {
        try {
            await OpenApiLoader.load(path);
            Logger.info('OpenAPI 문서가 유효합니다.');
        } catch (error: any) {
            Logger.error(`OpenAPI 문서가 유효하지 않습니다: ${error.message}`);
        }
    });

program.parse(process.argv);
