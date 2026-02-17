import { PriorityEngine, Priority } from './priority-engine';
import { AnalysisResult, FailureCategory } from './result-analyzer';
import { UserRole } from '../auth/jwt-provider';

describe('PriorityEngine', () => {
    it('should assign P0 to 500 server errors', () => {
        const analysis: AnalysisResult = {
            path: '/api',
            method: 'GET',
            role: UserRole.ADMIN,
            status: 500,
            isSuccess: false,
            category: FailureCategory.SERVER_ERR,
            latency: 100,
            timestamp: ''
        };
        expect(PriorityEngine.calculate(analysis)).toBe(Priority.P0);
    });

    it('should assign P0 to security leaks (READONLY successfully POSTing)', () => {
        const analysis: AnalysisResult = {
            path: '/api',
            method: 'POST',
            role: UserRole.READONLY,
            status: 201,
            isSuccess: true,
            category: FailureCategory.SUCCESS,
            latency: 100,
            timestamp: ''
        };
        expect(PriorityEngine.calculate(analysis)).toBe(Priority.P0);
    });

    it('should assign P1 to admin auth failures', () => {
        const analysis: AnalysisResult = {
            path: '/admin',
            method: 'GET',
            role: UserRole.ADMIN,
            status: 401,
            isSuccess: false,
            category: FailureCategory.AUTH,
            latency: 100,
            timestamp: ''
        };
        expect(PriorityEngine.calculate(analysis)).toBe(Priority.P1);
    });
});
