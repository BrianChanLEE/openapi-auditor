# 시작하기 (Getting Started)

이 가이드는 `openapi-auditor`를 설정하고 첫 번째 API 진단을 실행하는 과정을 안내합니다.

## 사전 요구 사항

- **Node.js**: v14 이상 (v18+ 권장)
- **NPM**: v6 이상
- **OpenAPI 스펙**: 유효한 파일(JSON/YAML) 또는 공개된 URL

## 설치

`openapi-auditor`를 프로젝트의 개발 의존성(Development Dependency)으로 설치하는 것을 권장합니다.

```bash
npm install -D openapi-auditor
```

또는 설치 없이 `npx`를 통해 직접 실행할 수도 있습니다.

## 1. 설정 초기화

먼저, 기본 설정 파일을 생성합니다.

```bash
npx openapi-auditor init
```

이 명령은 현재 디렉토리에 다음과 같은 기본값을 가진 `api-quality-config.json` 파일을 생성합니다.

```json
{
  "openapi": "./openapi.json",
  "baseUrl": "http://localhost:3000",
  "timeout": 5000,
  "outputDir": "./reports"
}
```

## 2. 진단 실행

설정 파일을 사용하거나 CLI 인자를 전달하여 진단을 실행합니다.

```bash
# 설정 파일 사용
npx openapi-auditor run

# 인자로 명시적 지정 (설정 파일보다 우선함)
npx openapi-auditor run --openapi ./spec/auth-api.yaml --baseUrl https://api.staging.example.com
```

### 실행 중 어떤 일이 일어나나요?
1. **스펙 로드**: OpenAPI 문서를 읽고 유효성을 검증합니다.
2. **엔드포인트 추출**: 모든 경로(Path)와 HTTP 메서드를 식별합니다.
3. **페이로드 생성**: 요청 본문(Request Body)을 위한 더미 데이터를 생성합니다.
4. **실행**: 각 역할(ADMIN, OPERATOR, READONLY)별로 요청을 전송합니다.
5. **분석**: 응답을 분석하여 성공 또는 실패 카테고리로 분류합니다.

## 3. 결과 검토

진단이 완료되면 생성된 리포트를 확인합니다.

```bash
# 리포트 열기
open ./reports/REPORT.md
```

### 리포트 구조 이해하기
리포트는 다음 섹션으로 구성됩니다.
- **종합 요약(Summary)**: 성공/실패 통계 정보.
- **주요 이슈(Priority Issues)**: 즉각적인 조치가 필요한 P0 및 P1 이슈 목록.
- **진단 카드(Audit Cards)**: 각 엔드포인트별 상세 분석 결과.

---

## 다음 단계
- [설정 옵션 상세](./configuration.md)
- [CLI 레퍼런스](./cli-reference.md)
- [진단 모델 및 가이드 원리](./diagnosis-model.md)
