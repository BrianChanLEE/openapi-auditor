import { AnalysisResult } from './result-analyzer';
export declare enum Priority {
    P0 = "P0",// Critical: Security breach, Server crash
    P1 = "P1",// High: Core functionality broken, Auth failure
    P2 = "P2",// Medium: Validation error, Performance
    P3 = "P3"
}
export declare class PriorityEngine {
    static calculate(analysis: AnalysisResult): Priority;
}
