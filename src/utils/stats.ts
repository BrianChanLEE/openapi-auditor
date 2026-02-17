export class StatsUtils {
    /**
     * 지정된 백분위수(Percentile)에 해당하는 값을 계산합니다.
     */
    static getPercentile(values: number[], percentile: number): number {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[Math.max(0, index)];
    }

    /**
     * 상세 지연시간 분포 데이터를 생성합니다.
     */
    static getLatencyDistribution(values: number[]): Record<string, number> {
        if (values.length === 0) return {};
        return {
            p50: this.getPercentile(values, 50),
            p90: this.getPercentile(values, 90),
            p95: this.getPercentile(values, 95),
            p99: this.getPercentile(values, 99),
            max: Math.max(...values),
            min: Math.min(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length
        };
    }
}
