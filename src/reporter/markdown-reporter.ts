import fs from 'fs';
import path from 'path';
import { AnalysisResult } from '../analyzer/result-analyzer';
import { Priority } from '../analyzer/priority-engine';
import { Logger } from '../utils/logger';
import { DiffResult } from '../analyzer/diff-engine';
import { StatsUtils } from '../utils/stats';

export class MarkdownReporter {
    static generate(
        results: (AnalysisResult & { priority: Priority, artifactPath?: string })[],
        outputDir: string,
        diff?: DiffResult | null
    ): string {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const reportPath = path.join(outputDir, 'REPORT.md');
        const total = results.length;
        const success = results.filter(r => r.isSuccess).length;
        const failure = total - success;
        const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : '0.0';
        const latencies = results.map(r => r.latency);
        const stats = StatsUtils.getLatencyDistribution(latencies);

        const p0Count = results.filter(r => r.priority === Priority.P0).length;
        const p1Count = results.filter(r => r.priority === Priority.P1).length;
        const p2Count = results.filter(r => r.priority === Priority.P2).length;
        const p3Count = results.filter(r => r.priority === Priority.P3).length;

        let content = `# API 품질 진단 보고서\n\n`;
        content += `> 생성 일시: ${new Date().toLocaleString('ko-KR')}\n\n`;

        content += `## 1. 종합 요약\n\n`;
        content += `| 항목 | 지표 |\n`;
        content += `| :--- | :--- |\n`;
        content += `| **전체 테스트 수** | ${total}건 |\n`;
        content += `| **성공** | ${success}건 |\n`;
        content += `| **실패** | ${failure}건 |\n`;
        content += `| **성공률** | ${successRate}% |\n`;
        content += `| **평균 응답시간** | ${stats.avg?.toFixed(0) || 0}ms |\n`;
        content += `| **P95 응답시간** | ${stats.p95 || 0}ms |\n`;
        content += `| **P99 응답시간** | ${stats.p99 || 0}ms |\n\n`;

        const slowEndpoints = [...results].sort((a, b) => b.latency - a.latency).slice(0, 5);
        if (slowEndpoints.length > 0) {
            content += `### [성능 하위 Top 5 (Slowest)]\n\n`;
            content += `| Method | Path | Role | Latency |\n`;
            content += `| :--- | :--- | :--- | :--- |\n`;
            slowEndpoints.forEach(e => {
                content += `| ${e.method} | ${e.path} | ${e.role} | ${e.latency}ms |\n`;
            });
            content += `\n`;
        }

        content += `### [우선순위별 이슈 현황]\n\n`;
        content += `- P0 (Critical): ${p0Count}건\n`;
        content += `- P1 (High): ${p1Count}건\n`;
        content += `- P2 (Medium): ${p2Count}건\n`;
        content += `- P3 (Low): ${p3Count}건\n\n`;

        if (diff) {
            content += `## 2. 회귀 분석 (Regression Analysis)\n\n`;
            if (diff.regressions.length === 0) {
                content += `이전 대비 새로 발생한 결함이 없습니다.\n\n`;
            } else {
                content += `이전 리포트와 비교했을 때 아래의 회귀가 감지되었습니다.\n\n`;
                content += `| 종류 | Method | Path | Role | 상태 변화 |\n`;
                content += `| :--- | :--- | :--- | :--- | :--- |\n`;
                diff.regressions.forEach(r => {
                    content += `| REGRESSION | ${r.method} | ${r.path} | ${r.role} | ${r.previousStatus} -> ${r.currentStatus} (${r.currentPriority}) |\n`;
                });
                content += `\n`;
            }

            if (diff.improvements.length > 0) {
                content += `### [개선 사항]\n\n`;
                diff.improvements.forEach(i => {
                    content += `- ${i.method} ${i.path} (${i.role}): 해결됨\n`;
                });
                content += `\n`;
            }
        }

        content += `## 3. 주요 진단 결과 (P0 - P1)\n\n`;
        const criticalIssues = results.filter(r => r.priority === Priority.P0 || r.priority === Priority.P1);

        if (criticalIssues.length === 0) {
            content += `심각한 결함이 발견되지 않았습니다.\n\n`;
        } else {
            criticalIssues.forEach((issue, index) => {
                const badge = issue.priority === Priority.P0 ? '[P0]' : '[P1]';
                content += `### [${index + 1}] ${badge} - ${issue.method} ${issue.path} (${issue.role})\n`;
                content += `- **결과**: ${issue.isSuccess ? '성공 (권한 과허용)' : '실패'}\n`;
                content += `- **분류**: ${issue.category}\n`;
                content += `- **로그/원인**: ${issue.reason || '없음'}\n`;
                content += `- **수정 가이드**: ${issue.suggestedAction || '없음'}\n`;
                if (issue.artifactPath) {
                    content += `- **상세 데이터**: [상세 보기(Artifact)](${issue.artifactPath})\n`;
                }
                content += `\n`;
            });
        }

        content += `## 3. 전체 리스크 분석\n\n`;
        content += `| 우선순위 | Method | Path | Role | 원인 | Artifact |\n`;
        content += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
        results.sort((a, b) => a.priority.localeCompare(b.priority)).forEach(r => {
            const artifactLink = r.artifactPath ? `[Link](${r.artifactPath})` : '-';
            content += `| ${r.priority} | ${r.method} | ${r.path} | ${r.role} | ${r.reason || 'N/A'} | ${artifactLink} |\n`;
        });

        content += `\n---\n*본 보고서는 API 품질 진단 플랫폼에 의해 자동 생성되었습니다.*`;

        fs.writeFileSync(reportPath, content);
        Logger.info(`진단 보고서 생성 완료: ${reportPath}`);
        return reportPath;
    }
}
