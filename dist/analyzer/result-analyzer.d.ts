import { TestResult } from '../runner/api-runner';
export declare enum FailureCategory {
    SUCCESS = "SUCCESS",
    AUTH = "AUTH",// 401, 403
    VALIDATION = "VALIDATION",// 400, 422
    SERVER_ERR = "SERVER_ERR",// 500+
    NOT_FOUND = "NOT_FOUND",// 404
    NETWORK = "NETWORK",// Timeout, DNS, Connection
    UNKNOWN = "UNKNOWN"
}
export interface AnalysisResult extends TestResult {
    category: FailureCategory;
    isSuccess: boolean;
    reason?: string;
    suggestedAction?: string;
}
export declare class ResultAnalyzer {
    static analyze(result: TestResult): AnalysisResult;
}
