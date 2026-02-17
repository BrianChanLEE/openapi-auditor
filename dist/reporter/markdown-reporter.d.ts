import { AnalysisResult } from '../analyzer/result-analyzer';
import { Priority } from '../analyzer/priority-engine';
export declare class MarkdownReporter {
    static generate(results: (AnalysisResult & {
        priority: Priority;
    })[], outputDir: string): string;
}
