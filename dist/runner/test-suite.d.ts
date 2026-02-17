import { ApiEndpoint } from '../openapi/loader';
import { ApiRunner, TestResult } from './api-runner';
export declare class TestSuite {
    private runner;
    constructor(runner: ApiRunner);
    runAll(endpoints: ApiEndpoint[]): Promise<TestResult[]>;
}
