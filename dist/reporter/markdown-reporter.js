"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownReporter = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const priority_engine_1 = require("../analyzer/priority-engine");
const logger_1 = require("../utils/logger");
class MarkdownReporter {
    static generate(results, outputDir) {
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        const reportPath = path_1.default.join(outputDir, 'REPORT.md');
        const total = results.length;
        const success = results.filter(r => r.isSuccess).length;
        const failure = total - success;
        const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : '0.0';
        const avgLatency = total > 0 ? (results.reduce((acc, r) => acc + r.latency, 0) / total).toFixed(0) : '0';
        const p0Count = results.filter(r => r.priority === priority_engine_1.Priority.P0).length;
        const p1Count = results.filter(r => r.priority === priority_engine_1.Priority.P1).length;
        const p2Count = results.filter(r => r.priority === priority_engine_1.Priority.P2).length;
        const p3Count = results.filter(r => r.priority === priority_engine_1.Priority.P3).length;
        let content = `# API 품질 진단 보고서\n\n`;
        content += `> 생성 일시: ${new Date().toLocaleString('ko-KR')}\n\n`;
        content += `## 1. 종합 요약\n\n`;
        content += `| 항목 | 지표 |\n`;
        content += `| :--- | :--- |\n`;
        content += `| **전체 테스트 수** | ${total}건 |\n`;
        content += `| **성공** | ${success}건 |\n`;
        content += `| **실패** | ${failure}건 |\n`;
        content += `| **성공률** | ${successRate}% |\n`;
        content += `| **평균 응답시간** | ${avgLatency}ms |\n\n`;
        content += `### 🚨 우선순위별 이슈 현황\n\n`;
        content += `- **P0 (Critical)**: ${p0Count}건\n`;
        content += `- **P1 (High)**: ${p1Count}건\n`;
        content += `- **P2 (Medium)**: ${p2Count}건\n`;
        content += `- **P3 (Low)**: ${p3Count}건\n\n`;
        content += `## 2. 주요 진단 결과 (P0 ~ P1)\n\n`;
        const criticalIssues = results.filter(r => r.priority === priority_engine_1.Priority.P0 || r.priority === priority_engine_1.Priority.P1);
        if (criticalIssues.length === 0) {
            content += `✅ 심각한 결함이 발견되지 않았습니다.\n\n`;
        }
        else {
            criticalIssues.forEach((issue, index) => {
                const badge = issue.priority === priority_engine_1.Priority.P0 ? '🔴 P0' : '🟠 P1';
                content += `### [${index + 1}] ${badge} - ${issue.method} ${issue.path} (${issue.role})\n`;
                content += `- **결과**: ${issue.isSuccess ? '성공 (권한 과허용)' : '실패'}\n`;
                content += `- **분류**: ${issue.category}\n`;
                content += `- **로그/원인**: ${issue.reason || '없음'}\n`;
                content += `- **수정 가이드**: ${issue.suggestedAction || '없음'}\n\n`;
            });
        }
        content += `## 3. 전체 리스크 분석\n\n`;
        content += `| 우선순위 | Method | Path | Role | 원인 |\n`;
        content += `| :--- | :--- | :--- | :--- | :--- |\n`;
        results.sort((a, b) => a.priority.localeCompare(b.priority)).forEach(r => {
            content += `| ${r.priority} | ${r.method} | ${r.path} | ${r.role} | ${r.reason || 'N/A'} |\n`;
        });
        content += `\n---\n*본 보고서는 API 품질 진단 플랫폼에 의해 자동 생성되었습니다.*`;
        fs_1.default.writeFileSync(reportPath, content);
        logger_1.Logger.info(`진단 보고서 생성 완료: ${reportPath}`);
        return reportPath;
    }
}
exports.MarkdownReporter = MarkdownReporter;
//# sourceMappingURL=markdown-reporter.js.map