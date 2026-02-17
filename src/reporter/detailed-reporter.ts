import fs from 'fs';
import path from 'path';
import { AnalysisResult } from '../analyzer/result-analyzer';
import { Priority } from '../analyzer/priority-engine';
import { Masker } from '../utils/masker';
import { CoverageMetrics } from '../analyzer/coverage-calculator';
import { StatsUtils } from '../utils/stats';

export interface EnrichedAnalysisResult extends AnalysisResult {
    priority: Priority;
    artifactPath: string;
}

export class DetailedReporter {
    static generate(
        results: (AnalysisResult & { priority: Priority })[],
        outputDir: string,
        coverage?: CoverageMetrics
    ): { jsonPath: string, enrichedResults: EnrichedAnalysisResult[] } {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const artifactsDir = path.join(outputDir, 'artifacts');
        if (!fs.existsSync(artifactsDir)) {
            fs.mkdirSync(artifactsDir, { recursive: true });
        }

        const total = results.length;
        const success = results.filter(r => r.isSuccess).length;
        const failure = total - success;

        const enrichedResults: EnrichedAnalysisResult[] = results.map(r => {
            const artifactName = `${r.method}_${r.path.replace(/\//g, '_')}_${r.role}.json`.toLowerCase();
            const artifactRelativePath = path.join('artifacts', artifactName);

            // 마스킹된 아티팩트 저장
            const artifactContent = Masker.mask({
                metadata: {
                    path: r.path,
                    method: r.method,
                    role: r.role,
                    priority: r.priority,
                    category: r.category,
                    isSuccess: r.isSuccess,
                    timestamp: r.timestamp
                },
                request: {
                    headers: r.requestHeaders,
                    payload: r.requestPayload
                },
                response: {
                    status: r.status,
                    headers: r.responseHeaders,
                    data: r.data,
                    error: r.error
                },
                analysis: {
                    reason: r.reason,
                    suggestedAction: r.suggestedAction
                }
            });

            fs.writeFileSync(path.join(artifactsDir, artifactName), JSON.stringify(artifactContent, null, 2));

            return {
                ...r,
                artifactPath: artifactRelativePath
            };
        });

        const latencies = results.map(r => r.latency);
        const performance = StatsUtils.getLatencyDistribution(latencies);

        // 1. JSON Report 생성
        const jsonReport: any = {
            schemaVersion: '1.1.0',
            metadata: {
                target: outputDir,
                timestamp: new Date().toISOString(),
                platform: process.platform
            },
            summary: {
                total,
                success,
                failure,
                successRate: total > 0 ? (success / total * 100).toFixed(1) : '0.0',
                priorityCounts: {
                    p0: results.filter(r => r.priority === Priority.P0).length,
                    p1: results.filter(r => r.priority === Priority.P1).length,
                    p2: results.filter(r => r.priority === Priority.P2).length,
                    p3: results.filter(r => r.priority === Priority.P3).length,
                },
                performance: performance
            },
            coverage: coverage || null,
            results: enrichedResults.map(r => Masker.mask(r))
        };

        const jsonPath = path.join(outputDir, 'REPORT.json');
        fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));

        return { jsonPath, enrichedResults };
    }
}
