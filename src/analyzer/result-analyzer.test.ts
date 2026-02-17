import { ResultAnalyzer, FailureCategory } from './result-analyzer';
import { TestResult } from '../runner/api-runner';

describe('ResultAnalyzer', () => {
    it('should classify 200 series as SUCCESS', () => {
        const result: TestResult = {
            path: '/test',
            method: 'GET',
            role: 'ADMIN',
            status: 200,
            latency: 100,
            timestamp: new Date().toISOString()
        };
        const analysis = ResultAnalyzer.analyze(result);
        expect(analysis.isSuccess).toBe(true);
        expect(analysis.category).toBe(FailureCategory.SUCCESS);
    });

    it('should classify 401/403 as AUTH failure', () => {
        const result: TestResult = {
            path: '/admin',
            method: 'GET',
            role: 'READONLY',
            status: 403,
            latency: 50,
            timestamp: new Date().toISOString()
        };
        const analysis = ResultAnalyzer.analyze(result);
        expect(analysis.isSuccess).toBe(false);
        expect(analysis.category).toBe(FailureCategory.AUTH);
    });

    it('should classify 500 as SERVER_ERR', () => {
        const result: TestResult = {
            path: '/users',
            method: 'POST',
            role: 'ADMIN',
            status: 500,
            latency: 200,
            timestamp: new Date().toISOString()
        };
        const analysis = ResultAnalyzer.analyze(result);
        expect(analysis.isSuccess).toBe(false);
        expect(analysis.category).toBe(FailureCategory.SERVER_ERR);
    });

    it('should classify connection errors as NETWORK failure', () => {
        const result: TestResult = {
            path: '/users',
            method: 'GET',
            role: 'ADMIN',
            error: 'getaddrinfo ENOTFOUND',
            latency: 0,
            timestamp: new Date().toISOString()
        };
        const analysis = ResultAnalyzer.analyze(result);
        expect(analysis.isSuccess).toBe(false);
        expect(analysis.category).toBe(FailureCategory.NETWORK);
    });
});
