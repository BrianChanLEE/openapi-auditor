# CLI 레퍼런스

사용법: `npx openapi-auditor [command] [options]`

## 명령어 (Commands)

### `init`
현재 디렉토리에 `api-quality-config.json` 설정 파일 템플릿을 생성합니다.

```bash
npx openapi-auditor init
```

### `run`
API 품질 진단을 실행합니다. 옵션이 지정되지 않으면 설정 파일을 참조합니다.

**기본 옵션:**
- `-o, --openapi <path>`: OpenAPI 스펙 파일 경로.
- `-b, --baseUrl <url>`: 진단 대상 서버 URL.
- `-d, --outputDir <dir>`: 리포트 저장 디렉토리 (기본값: `./reports`).

**CI/CD 전용 옵션:**
- `--ci`: CI 모드 활성화. 장식성 로그를 제거하고 출력을 최소화합니다.
- `--summaryJson`: 실행 완료 후 마지막에 JSON 형태의 요약 정보를 출력합니다.
- `--failOn <level>`: 빌드 실패(종료 코드 1)를 유발할 최소 우선순위 수준 (설정 가능: `P0`, `P1`, `P2`, `P3`. 기본값: `P1`).

```bash
npx openapi-auditor run --ci --failOn P0
```

### `validate`
OpenAPI 스펙 파일이 유효한지 검사합니다.

```bash
npx openapi-auditor validate ./openapi.json
```

## 종료 코드 (Exit Codes)

- `0`: 성공 (결함이 없거나 설정된 `--failOn` 기준보다 낮은 이슈만 발견됨).
- `1`: 실패 (`failOn` 기준 이상의 결함(P1+)이 발견되었거나 환경 설정 오류).
- `2`: 치명적 실패 (P0 등급의 보안 또는 서버 오류 결함 발견).

---

- [시작하기](./getting-started.md)
- [리포트 형식](./report-format.md)
