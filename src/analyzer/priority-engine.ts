import { AnalysisResult } from './result-analyzer';
import { RuleEngine, AuditRule } from './rule-engine';

export enum Priority {
    P0 = 'P0', // Critical
    P1 = 'P1', // High
    P2 = 'P2', // Medium
    P3 = 'P3'  // Low
}

export class PriorityEngine {
    private ruleEngine: RuleEngine;

    constructor(customRules: AuditRule[] = [], options: { trace?: boolean } = {}) {
        this.ruleEngine = new RuleEngine(customRules, options);
    }

    /**
     * 규칙 엔진을 사용하여 우선순위 및 관련 가이드를 산출합니다.
     */
    calculate(analysis: AnalysisResult): { priority: Priority, reason?: string, suggestedAction?: string } {
        return this.ruleEngine.evaluate(analysis);
    }
}
