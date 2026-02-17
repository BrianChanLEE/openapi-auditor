import fs from 'fs';
import { Priority } from './priority-engine';

export interface DiffResult {
    regressions: Array<{
        path: string;
        method: string;
        role: string;
        previousStatus: string;
        currentStatus: string;
        previousPriority: string;
        currentPriority: string;
    }>;
    improvements: Array<{
        path: string;
        method: string;
        role: string;
    }>;
    newFailures: number;
    fixedIssues: number;
}

export class DiffEngine {
    static compare(previousJsonPath: string, currentResults: any[]): DiffResult {
        if (!fs.existsSync(previousJsonPath)) {
            throw new Error(`이전 리포트 파일을 찾을 수 없습니다: ${previousJsonPath}`);
        }

        const previousReport = JSON.parse(fs.readFileSync(previousJsonPath, 'utf8'));
        const previousResults = previousReport.results || [];

        const previousMap = new Map<string, any>();
        previousResults.forEach((r: any) => {
            previousMap.set(`${r.method} ${r.path} ${r.role}`, r);
        });

        const regressions: any[] = [];
        const improvements: any[] = [];
        let newFailures = 0;
        let fixedIssues = 0;

        currentResults.forEach(curr => {
            const key = `${curr.method} ${curr.path} ${curr.role}`;
            const prev = previousMap.get(key);

            if (prev) {
                // 기존에 존재하던 항목 비교
                if (prev.isSuccess && !curr.isSuccess) {
                    regressions.push({
                        path: curr.path,
                        method: curr.method,
                        role: curr.role,
                        previousStatus: 'SUCCESS',
                        currentStatus: 'FAIL',
                        previousPriority: 'NONE',
                        currentPriority: curr.priority
                    });
                    newFailures++;
                } else if (!prev.isSuccess && curr.isSuccess) {
                    improvements.push({
                        path: curr.path,
                        method: curr.method,
                        role: curr.role
                    });
                    fixedIssues++;
                } else if (!prev.isSuccess && !curr.isSuccess) {
                    // 둘 다 실패인 경우 우선순위 악화 확인
                    const priorityScores: Record<string, number> = { 'P3': 0, 'P2': 1, 'P1': 2, 'P0': 3 };
                    if (priorityScores[curr.priority] > priorityScores[prev.priority]) {
                        regressions.push({
                            path: curr.path,
                            method: curr.method,
                            role: curr.role,
                            previousStatus: 'FAIL',
                            currentStatus: 'FAIL',
                            previousPriority: prev.priority,
                            currentPriority: curr.priority
                        });
                    }
                }
            } else {
                // 신규 엔드포인트 실패 시
                if (!curr.isSuccess) {
                    newFailures++;
                }
            }
        });

        return {
            regressions,
            improvements,
            newFailures,
            fixedIssues
        };
    }
}
