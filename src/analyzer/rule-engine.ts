import { AnalysisResult, FailureCategory } from './result-analyzer';
import { Priority } from './priority-engine';

export interface AuditRule {
    id: string;
    condition: string; // JavaScript expression string
    priority: Priority;
    reason?: string;
    suggestedAction?: string;
}

export class RuleEngine {
    private rules: AuditRule[] = [];
    private traceEnabled: boolean = false;

    constructor(customRules: AuditRule[] = [], options: { trace?: boolean } = {}) {
        this.rules = [...this.getDefaultRules(), ...customRules];
        this.traceEnabled = options.trace || false;
    }

    private getDefaultRules(): AuditRule[] {
        return [
            {
                id: 'security-leak-readonly',
                condition: "result.isSuccess && result.role === 'READONLY' && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(result.method)",
                priority: Priority.P0,
                reason: 'READONLY 권한 계정이 쓰기 작업을 성공했습니다 (보안 취약점)',
                suggestedAction: '서버측 권한 제어(RBAC) 로직을 점검하십시오'
            },
            {
                id: 'server-error-p0',
                condition: "result.category === 'SERVER_ERR'",
                priority: Priority.P0,
                reason: '서버 내부 오류가 발생했습니다',
                suggestedAction: '서버 로그 및 스택트레이스를 확인하십시오'
            },
            {
                id: 'auth-failure-admin',
                condition: "result.category === 'AUTH' && result.role === 'ADMIN'",
                priority: Priority.P1,
                reason: 'ADMIN 계정의 인증/인가에 실패했습니다',
                suggestedAction: 'ADMIN 토큰 및 권한 매핑을 확인하십시오'
            },
            {
                id: 'network-failure',
                condition: "result.category === 'NETWORK'",
                priority: Priority.P1,
                reason: '네트워크 연결 또는 타임아웃이 발생했습니다',
                suggestedAction: '서버 상태 및 네트워크 인프라를 확인하십시오'
            }
        ];
    }

    /**
     * 결과에 대해 규칙을 평가하고 적절한 우선순위와 정보를 반환합니다.
     */
    evaluate(result: AnalysisResult): { priority: Priority, reason?: string, suggestedAction?: string, ruleId?: string } {
        for (const rule of this.rules) {
            try {
                // 안전한 범위 내에서 조건 평가
                const evaluator = new Function('result', `return ${rule.condition}`);
                if (evaluator(result)) {
                    if (this.traceEnabled) {
                        console.log(`[TRACE] 규칙 매칭: ${rule.id} (Priority: ${rule.priority})`);
                    }
                    return {
                        priority: rule.priority,
                        reason: rule.reason || result.reason,
                        suggestedAction: rule.suggestedAction || result.suggestedAction,
                        ruleId: rule.id
                    };
                }
            } catch (e) {                // 규칙 평가 실패 시 무시 및 다음 규칙 시도
                continue;
            }
        }

        // 일치하는 규칙이 없는 경우 기본값 반환
        return {
            priority: result.isSuccess ? Priority.P3 : Priority.P2
        };
    }
}
