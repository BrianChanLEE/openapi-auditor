import { TestResult } from '../runner/api-runner';

export enum FailureCategory {
    SUCCESS = 'SUCCESS',
    AUTH = 'AUTH',          // 401, 403
    VALIDATION = 'VALIDATION',  // 400, 422
    SERVER_ERR = 'SERVER_ERR',  // 500+
    NOT_FOUND = 'NOT_FOUND',    // 404
    NETWORK = 'NETWORK',    // Timeout, DNS, Connection
    UNKNOWN = 'UNKNOWN'
}

export interface AnalysisResult extends TestResult {
    category: FailureCategory;
    isSuccess: boolean;
    reason?: string;
    suggestedAction?: string;
}

export class ResultAnalyzer {
    static analyze(result: TestResult): AnalysisResult {
        const isSuccess = result.status !== undefined && result.status >= 200 && result.status < 300;
        let category = FailureCategory.SUCCESS;
        let reason = '';
        let suggestedAction = '';

        if (!isSuccess) {
            const errorMessage = result.error || (result.status === undefined ? 'Connection Failed or Timeout' : '');

            if (errorMessage) {
                category = FailureCategory.NETWORK;
                reason = `네트워크 오류: ${errorMessage}`;
                suggestedAction = '서버 생존 여부 확인 및 네트워크 상태 점검 필요';
            } else if (result.status) {
                if (result.status === 401 || result.status === 403) {
                    category = FailureCategory.AUTH;
                    reason = `인증/권한 오류 (Status: ${result.status})`;
                    suggestedAction = '발급된 토큰의 유효성 및 해당 Role의 권한 매핑 확인 필요';
                } else if (result.status === 400 || result.status === 422) {
                    category = FailureCategory.VALIDATION;
                    reason = `요청 데이터 검증 실패 (Status: ${result.status})`;
                    suggestedAction = 'OpenAPI 스펙과 실제 서버의 검증 로직 일치 여부 및 요청 페이로드 확인';
                } else if (result.status === 404) {
                    category = FailureCategory.NOT_FOUND;
                    reason = `엔드포인트 미존재 (Status: 404)`;
                    suggestedAction = '서버에 해당 API가 구현되어 있는지 또는 URL 경로 확인 필요';
                } else if (result.status >= 500) {
                    category = FailureCategory.SERVER_ERR;
                    reason = `서버 내부 오류 (Status: ${result.status})`;
                    suggestedAction = '서버 애플리케이션 로그 확인 및 스택트레이스 분석 필요';
                } else {
                    category = FailureCategory.UNKNOWN;
                    reason = `알 수 없는 실패 (Status: ${result.status})`;
                    suggestedAction = '수동 확인 필요';
                }
            } else {
                // status도 없고 error도 없는 극단적 상황
                category = FailureCategory.NETWORK;
                reason = '서버 연결 실패 (Connection Refused)';
                suggestedAction = '대상 서버가 실행 중인지 확인하십시오.';
            }
        }

        return {
            ...result,
            isSuccess,
            category,
            reason,
            suggestedAction
        };
    }
}
