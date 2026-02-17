import { AnalysisResult, FailureCategory } from './result-analyzer';
import { UserRole } from '../auth/jwt-provider';

export enum Priority {
    P0 = 'P0', // Critical: Security breach, Server crash
    P1 = 'P1', // High: Core functionality broken, Auth failure
    P2 = 'P2', // Medium: Validation error, Performance
    P3 = 'P3'  // Low: Doc mismatch, Minor UI
}

export class PriorityEngine {
    static calculate(analysis: AnalysisResult): Priority {
        if (analysis.isSuccess) {
            // 권한 과허용 체크 (Security Leak)
            // READONLY 계정이 POST/PUT/DELETE에 성공한 경우 P0
            if (analysis.role === UserRole.READONLY && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(analysis.method)) {
                return Priority.P0;
            }
            return Priority.P3; // 성공한 케이스는 기본적으로 낮은 우선순위 (또는 분석 대상 제외)
        }

        // 실패 케이스 분석
        switch (analysis.category) {
            case FailureCategory.SERVER_ERR:
                return Priority.P0; // 서버 에러는 무조건 P0

            case FailureCategory.AUTH:
                // ADMIN이 인증 실패하는 것은 P1, 그 외는 P2
                return analysis.role === UserRole.ADMIN ? Priority.P1 : Priority.P2;

            case FailureCategory.NETWORK:
                return Priority.P1; // 시스템 불능 상태로 간주

            case FailureCategory.VALIDATION:
                return Priority.P2;

            case FailureCategory.NOT_FOUND:
                return Priority.P2;

            default:
                return Priority.P3;
        }
    }
}
