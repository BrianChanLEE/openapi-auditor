import { AnalysisResult } from './result-analyzer';
import { ApiEndpoint } from '../openapi/loader';

export interface CoverageMetrics {
    contractCoverage: {
        totalEndpoints: number;
        testedEndpoints: number;
        percentage: string;
    };
    roleCoverage: {
        totalRoleEndpointCombinations: number;
        testedCombinations: number;
        percentage: string;
    };
    skippedEndpoints: string[];
}

export class CoverageCalculator {
    static calculate(
        allEndpoints: ApiEndpoint[],
        results: AnalysisResult[],
        expectedRoles: string[] = ['ADMIN', 'OPERATOR', 'READONLY']
    ): CoverageMetrics {
        const totalEndpoints = allEndpoints.length;
        const testedPaths = new Set(results.map(r => `${r.method} ${r.path}`));
        const testedEndpoints = testedPaths.size;

        const totalRoleEndpointCombinations = totalEndpoints * expectedRoles.length;
        const testedCombinations = results.length;

        const skippedEndpoints = allEndpoints
            .filter(e => !testedPaths.has(`${e.method} ${e.path}`))
            .map(e => `${e.method} ${e.path}`);

        return {
            contractCoverage: {
                totalEndpoints,
                testedEndpoints,
                percentage: totalEndpoints > 0 ? (testedEndpoints / totalEndpoints * 100).toFixed(1) : '0.0'
            },
            roleCoverage: {
                totalRoleEndpointCombinations,
                testedCombinations,
                percentage: totalRoleEndpointCombinations > 0 ? (testedCombinations / totalRoleEndpointCombinations * 100).toFixed(1) : '0.0'
            },
            skippedEndpoints
        };
    }
}
