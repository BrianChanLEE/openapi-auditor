# 설정 가이드 (Configuration)

`openapi-auditor`는 `api-quality-config.json` 파일 또는 CLI 플래그를 통해 설정할 수 있습니다.

## 설정 파일: `api-quality-config.json`

| 속성 | 타입 | 기본값 | 설명 |
| :--- | :--- | :--- | :--- |
| `openapi` | `string` | `"./openapi.json"` | OpenAPI 스펙 경로 (로컬 파일 또는 URL). |
| `baseUrl` | `string` | `"http://localhost:3000"` | 테스트 대상 서버의 기본 URL. |
| `timeout` | `number` | `5000` | 각 요청당 타임아웃(ms). |
| `outputDir` | `string` | `"./reports"` | `REPORT.md`가 저장될 디렉토리. |
| `roles` | `string[]` | `["ADMIN", "OPERATOR", "READONLY"]` | 테스트에 사용할 역할(Role) 목록. |

### 고급 옵션 (추가 예정)
- `concurrency`: 동시 요청 수 설정.
- `slaMs`: 성능 경고를 발생시킬 응답 시간 임계치.
- `maskHeaders`: 로그에서 마스킹할 민감한 헤더 목록.

## 보안 및 인증

기본적으로 진단 도구는 각 역할별로 테스트 전용 JWT를 생성합니다. 토큰 생성 로직을 커스터마이징하거나 정적 토큰을 제공하는 기능이 추가될 예정입니다.

> [!IMPORTANT]
> 진단 세션 동안 테스트 대상 서버가 진단 도구에 정의된 `test-secret-key`(기본값)를 수용하도록 설정하거나, 설정 파일에서 자신의 시크릿 키를 제공해야 합니다.

```json
{
  "openapi": "https://api.example.com/swagger.json",
  "baseUrl": "https://api.staging.example.com",
  "roles": ["ADMIN", "USER", "GUEST"]
}
```

---

- [시작하기](./getting-started.md)
- [CLI 레퍼런스](./cli-reference.md)
