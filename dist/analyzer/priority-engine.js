"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityEngine = exports.Priority = void 0;
const result_analyzer_1 = require("./result-analyzer");
const jwt_provider_1 = require("../auth/jwt-provider");
var Priority;
(function (Priority) {
    Priority["P0"] = "P0";
    Priority["P1"] = "P1";
    Priority["P2"] = "P2";
    Priority["P3"] = "P3"; // Low: Doc mismatch, Minor UI
})(Priority || (exports.Priority = Priority = {}));
class PriorityEngine {
    static calculate(analysis) {
        if (analysis.isSuccess) {
            // 권한 과허용 체크 (Security Leak)
            // READONLY 계정이 POST/PUT/DELETE에 성공한 경우 P0
            if (analysis.role === jwt_provider_1.UserRole.READONLY && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(analysis.method)) {
                return Priority.P0;
            }
            return Priority.P3; // 성공한 케이스는 기본적으로 낮은 우선순위 (또는 분석 대상 제외)
        }
        // 실패 케이스 분석
        switch (analysis.category) {
            case result_analyzer_1.FailureCategory.SERVER_ERR:
                return Priority.P0; // 서버 에러는 무조건 P0
            case result_analyzer_1.FailureCategory.AUTH:
                // ADMIN이 인증 실패하는 것은 P1, 그 외는 P2
                return analysis.role === jwt_provider_1.UserRole.ADMIN ? Priority.P1 : Priority.P2;
            case result_analyzer_1.FailureCategory.NETWORK:
                return Priority.P1; // 시스템 불능 상태로 간주
            case result_analyzer_1.FailureCategory.VALIDATION:
                return Priority.P2;
            case result_analyzer_1.FailureCategory.NOT_FOUND:
                return Priority.P2;
            default:
                return Priority.P3;
        }
    }
}
exports.PriorityEngine = PriorityEngine;
//# sourceMappingURL=priority-engine.js.map