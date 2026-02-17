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
- `--ci`: 로그 출력을 최소화하는 CI 모드입니다.
- `--summaryJson`: 실행 종료 시 한 줄의 요약 JSON을 출력합니다.
- `--failOn <P0|P1|P2|P3>`: 빌드 실패(Exit Code > 0) 기준을 설정합니다 (기본값: P1).
- `--compare <path>`: 이전 REPORT.json과 비교하여 회귀(Regression)를 분석합니다.

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
