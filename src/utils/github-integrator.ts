import axios from 'axios';
import { Logger } from './logger';
import fs from 'fs';

export class GitHubIntegrator {
    /**
     * GitHub PR에 진단 요약 코멘트를 게시합니다.
     */
    static async postComment(options: {
        repo: string;
        prNumber: string;
        token: string;
        reportPath: string;
    }) {
        const { repo, prNumber, token, reportPath } = options;

        if (!repo || !prNumber || !token) {
            Logger.warn('GitHub PR 코멘트를 게시하기 위한 필수 정보(Repo, PR Number, Token)가 누락되었습니다.');
            return;
        }

        try {
            const reportContent = fs.readFileSync(reportPath, 'utf8');
            // 리포트 내용 중 종합 요약 부분만 발췌 (코멘트 길이 제한 고려)
            const summaryMatch = reportContent.match(/## 1\. 종합 요약[\s\S]*?(?=##|$)/);
            const commentBody = summaryMatch
                ? `### OpenAPI Audit Result\n\n${summaryMatch[0]}\n\n[Full Report](${process.env.GITHUB_SERVER_URL}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID})`
                : `### OpenAPI Audit Completed\n\n진단이 완료되었습니다. 자세한 내용은 CI Artifacts를 확인하십시오.`;

            const url = `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`;

            await axios.post(url, { body: commentBody }, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'openapi-auditor'
                }
            });

            Logger.info(`GitHub PR (#${prNumber})에 진단 요약 코멘트를 게시했습니다.`);
        } catch (error: any) {
            Logger.error(`GitHub PR 코멘트 게시 실패: ${error.response?.data?.message || error.message}`);
        }
    }
}
