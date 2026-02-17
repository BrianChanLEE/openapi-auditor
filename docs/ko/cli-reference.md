# CLI 레퍼런스

사용법: `npx openapi-auditor [명령어] [옵션]`

## 명령어 (Commands)

### `init`
현재 디렉토리에 샘플 `api-quality-config.json` 파일을 생성합니다.

```bash
npx openapi-auditor init
```

### `run`
진단 프로세스를 시작합니다. 옵션이 제공되지 않으면 설정 파일을 자동으로 찾습니다.

**옵션(Options):**
- `-o, --openapi <path>`: OpenAPI 스펙 경로.
- `-b, --baseUrl <url>`: 대상 서버 URL.
- `-d, --outputDir <dir>`: 리포트 출력 경로 (기본값: `./reports`).
- `-t, --timeout <ms>`: 개별 요청 타임아웃 설정.

```bash
npx openapi-auditor run -o spec.json -b http://localhost:8080
```

### `validate`
제공된 OpenAPI 스펙이 유효한지, 진단 도구가 정상적으로 파싱할 수 있는지 검사합니다.

```bash
npx openapi-auditor validate ./openapi.json
```

## 종료 코드 (Exit Codes)

- `0`: 성공 (진단 프로세스가 비정상 종료 없이 완료됨. 테스트 실패 건수와 무관).
- `1`: 인프라 실패 (설정 누락, 네트워크 단절, 유효하지 않은 스펙 등).

---

- [시작하기](./getting-started.md)
- [리포트 형식](./report-format.md)
