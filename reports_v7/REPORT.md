# API 품질 진단 보고서

> 생성 일시: 2026. 2. 17. 오후 10:25:49

## 1. 종합 요약

| 항목 | 지표 |
| :--- | :--- |
| **전체 테스트 수** | 6건 |
| **성공** | 0건 |
| **실패** | 6건 |
| **성공률** | 0.0% |
| **평균 응답시간** | 3ms |
| **P95 응답시간** | 13ms |
| **P99 응답시간** | 13ms |

### [우선순위별 이슈 현황]

- P0 (Critical): 0건
- P1 (High): 6건
- P2 (Medium): 0건
- P3 (Low): 0건

## 3. 주요 진단 결과 (P0 - P1)

### [1] [P1] - GET /users (ADMIN)
- **결과**: 실패
- **분류**: NETWORK
- **로그/원인**: 네트워크 연결 또는 타임아웃이 발생했습니다
- **수정 가이드**: 서버 상태 및 네트워크 인프라를 확인하십시오
- **상세 데이터**: [상세 보기(Artifact)](artifacts/get__users_admin.json)

### [2] [P1] - GET /users (OPERATOR)
- **결과**: 실패
- **분류**: NETWORK
- **로그/원인**: 네트워크 연결 또는 타임아웃이 발생했습니다
- **수정 가이드**: 서버 상태 및 네트워크 인프라를 확인하십시오
- **상세 데이터**: [상세 보기(Artifact)](artifacts/get__users_operator.json)

### [3] [P1] - GET /users (READONLY)
- **결과**: 실패
- **분류**: NETWORK
- **로그/원인**: 네트워크 연결 또는 타임아웃이 발생했습니다
- **수정 가이드**: 서버 상태 및 네트워크 인프라를 확인하십시오
- **상세 데이터**: [상세 보기(Artifact)](artifacts/get__users_readonly.json)

### [4] [P1] - POST /users (ADMIN)
- **결과**: 실패
- **분류**: NETWORK
- **로그/원인**: 네트워크 연결 또는 타임아웃이 발생했습니다
- **수정 가이드**: 서버 상태 및 네트워크 인프라를 확인하십시오
- **상세 데이터**: [상세 보기(Artifact)](artifacts/post__users_admin.json)

### [5] [P1] - POST /users (OPERATOR)
- **결과**: 실패
- **분류**: NETWORK
- **로그/원인**: 네트워크 연결 또는 타임아웃이 발생했습니다
- **수정 가이드**: 서버 상태 및 네트워크 인프라를 확인하십시오
- **상세 데이터**: [상세 보기(Artifact)](artifacts/post__users_operator.json)

### [6] [P1] - POST /users (READONLY)
- **결과**: 실패
- **분류**: NETWORK
- **로그/원인**: 네트워크 연결 또는 타임아웃이 발생했습니다
- **수정 가이드**: 서버 상태 및 네트워크 인프라를 확인하십시오
- **상세 데이터**: [상세 보기(Artifact)](artifacts/post__users_readonly.json)

## 3. 전체 리스크 분석

| 우선순위 | Method | Path | Role | 원인 | Artifact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| P1 | GET | /users | ADMIN | 네트워크 연결 또는 타임아웃이 발생했습니다 | [Link](artifacts/get__users_admin.json) |
| P1 | GET | /users | OPERATOR | 네트워크 연결 또는 타임아웃이 발생했습니다 | [Link](artifacts/get__users_operator.json) |
| P1 | GET | /users | READONLY | 네트워크 연결 또는 타임아웃이 발생했습니다 | [Link](artifacts/get__users_readonly.json) |
| P1 | POST | /users | ADMIN | 네트워크 연결 또는 타임아웃이 발생했습니다 | [Link](artifacts/post__users_admin.json) |
| P1 | POST | /users | OPERATOR | 네트워크 연결 또는 타임아웃이 발생했습니다 | [Link](artifacts/post__users_operator.json) |
| P1 | POST | /users | READONLY | 네트워크 연결 또는 타임아웃이 발생했습니다 | [Link](artifacts/post__users_readonly.json) |

---
*본 보고서는 API 품질 진단 플랫폼에 의해 자동 생성되었습니다.*