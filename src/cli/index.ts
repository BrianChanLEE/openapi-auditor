#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { OpenApiLoader } from '../openapi/loader';
import { Logger } from '../utils/logger';
import { ApiRunner } from '../runner/api-runner';
import { TestSuite } from '../runner/test-suite';
import { ResultAnalyzer } from '../analyzer/result-analyzer';
import { PriorityEngine, Priority } from '../analyzer/priority-engine';
import { MarkdownReporter } from '../reporter/markdown-reporter';
import { DetailedReporter } from '../reporter/detailed-reporter';

const program = new Command();

program
    .name('openapi-auditor')
    .description('OpenAPI 기반 API 품질 진단 플랫폼 CLI')
    .version('1.0.0');

/**
 * 환경변수 치환 로직 (${ENV_VAR} 패턴)
 */
function substituteEnvVars(obj: any): any {
    if (typeof obj === 'string') {
        return obj.replace(/\${([^}]+)}/g, (_, varName) => {
            const val = process.env[varName];
            if (val === undefined) {
                throw new Error(`환경변수 ${varName}가 정의되지 않았습니다.`);
            }
            return val;
        });
    } else if (Array.isArray(obj)) {
        return obj.map(item => substituteEnvVars(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const key of Object.keys(obj)) {
            result[key] = substituteEnvVars(obj[key]);
        }
        return result;
    }
    return obj;
}

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
    .option('--ci', 'CI 모드 실행 (로그 최소화)', false)
    .option('--summaryJson', '마지막에 JSON 요약 출력', false)
    .option('--failOn <level>', '빌드 실패 기준 우선순위 (P0, P1, P2, P3)', 'P1')
    .action(async (options) => {
        try {
            let openapiPath = options.openapi;
            let baseUrl = options.baseUrl;
            const outputDir = path.resolve(process.cwd(), options.outputDir || './reports');

            // 설정 파일 로드 시도
            const configPath = path.join(process.cwd(), 'api-quality-config.json');
            let config: any = {};
            if (fs.existsSync(configPath)) {
                try {
                    const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    config = substituteEnvVars(rawConfig);
                    openapiPath = openapiPath || config.openapi;
                    baseUrl = baseUrl || config.baseUrl;
                } catch (e: any) {
                    Logger.error(`설정 파일 로드 실패: ${e.message}`);
                    process.exit(1);
                }
            }

            if (!openapiPath || !baseUrl) {
                Logger.error('OpenAPI 경로와 Base URL은 필수입니다. (-o, -b 옵션 또는 설정 파일 사용)');
                process.exit(1);
            }

            if (!options.ci) {
                Logger.info('--- 진단 프로세스 시작 ---');
            }

            // 1. OpenAPI 로드
            const doc = await OpenApiLoader.load(openapiPath);
            const endpoints = OpenApiLoader.parseEndpoints(doc);

            // 2. 테스트 실행
            const runner = new ApiRunner(baseUrl, config.timeout || 5000);
            const suite = new TestSuite(runner);
            const rawResults = await suite.runAll(endpoints);

            // 3. 분석 및 우선순위 산정
            let maxPriorityScore = -1; // P3: 0, P2: 1, P1: 2, P0: 3
            const priorityMap: Record<string, number> = { 'P3': 0, 'P2': 1, 'P1': 2, 'P0': 3 };

            const baseAnalyzedResults = rawResults.map(res => {
                const analysis = ResultAnalyzer.analyze(res);
                const priority = PriorityEngine.calculate(analysis);

                const score = priorityMap[priority] ?? -1;
                if (score > maxPriorityScore) maxPriorityScore = score;

                return { ...analysis, priority };
            });

            // 4. 리포트 생성 (JSON & Artifacts 먼저 생성하여 Markdown에 링크 제공)
            const { jsonPath, enrichedResults } = DetailedReporter.generate(baseAnalyzedResults, outputDir);
            const reportPath = MarkdownReporter.generate(enrichedResults, outputDir);

            if (!options.ci) {
                Logger.info('--- 진단 프로세스 완료 ---');
                Logger.info(`리포트 위치: ${reportPath}`);
            }

            // 요약 JSON 출력
            if (options.summaryJson) {
                const summary = {
                    total: enrichedResults.length,
                    success: enrichedResults.filter(r => r.isSuccess).length,
                    fail: enrichedResults.filter(r => !r.isSuccess).length,
                    maxPriority: Object.keys(priorityMap).find(key => priorityMap[key] === maxPriorityScore) || 'NONE'
                };
                console.log(JSON.stringify(summary));
            }

            // 종료 코드 결정
            const failOnScore = priorityMap[options.failOn] ?? 2; // 기본 P1
            if (maxPriorityScore >= failOnScore) {
                const exitCode = maxPriorityScore >= priorityMap['P0'] ? 2 : 1;
                if (!options.ci) {
                    Logger.error(`진단 결과 빌드 실패 기준(${options.failOn})을 초과하는 이슈가 발견되었습니다.`);
                }
                process.exit(exitCode);
            }

        } catch (error: any) {
            Logger.error(`실행 중 치명적 오류 발생: ${error.message}`);
            process.exit(1);
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
            process.exit(1);
        }
    });

program.parse(process.argv);
