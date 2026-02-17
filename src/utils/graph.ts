export class GraphUtils {
    /**
     * 위상 정렬(Topological Sort)을 수행합니다.
     * @param items 정렬할 아이템 리스트
     * @param getDeps 각 아이템의 의존성 아이디 리스트를 반환하는 함수
     * @param getId 각 아이템의 고유 아이디를 반환하는 함수
     */
    static topologicalSort<T>(
        items: T[],
        getDeps: (item: T) => string[],
        getId: (item: T) => string
    ): T[] {
        const result: T[] = [];
        const visited = new Set<string>();
        const visiting = new Set<string>();
        const itemMap = new Map<string, T>();

        for (const item of items) {
            itemMap.set(getId(item), item);
        }

        const visit = (id: string) => {
            if (visiting.has(id)) {
                throw new Error(`순환 의존성이 감지되었습니다: ${id}`);
            }
            if (visited.has(id)) return;

            visiting.add(id);
            const item = itemMap.get(id);
            if (item) {
                const deps = getDeps(item);
                for (const depId of deps) {
                    visit(depId);
                }
            }
            visiting.delete(id);
            visited.add(id);
            if (item) result.push(item);
        };

        for (const item of items) {
            visit(getId(item));
        }

        return result;
    }
}
