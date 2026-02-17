0. 한 줄 목표

OpenAPI(Swagger) 문서를 입력으로 받아 전체 API 전수 테스트를 수행하고, 실패 원인 분류 + 우선순위(P0~) 산정 + 코드 위치(후보) + 수정 방향까지 포함한 **전문가 수준 REPORT.md**를 자동 생성하는 Node.js 기반 npm 패키지를 배포한다.

⸻

1. 사용자 시나리오
	1.	사용자는 프로젝트에 패키지를 설치한다.

	•	npm install -D <패키지명>

	2.	설정 파일을 추가한다.

	•	diagnose.config.js 또는 diagnose.config.ts

	3.	실행한다.

	•	npx <cli명> run
	•	또는 npm run diagnose

	4.	결과물 생성

	•	./reports/REPORT.md
	•	(선택) ./reports/REPORT.json
	•	(선택) ./reports/REPORT.html

⸻

2. 핵심 기능 범위

2.1 OpenAPI 기반 전수 테스트
	•	입력 소스
	•	openapi.json 로컬 파일
	•	또는 URL (예: /swagger.json)
	•	대상 추출
	•	모든 path + method
	•	요청 생성
	•	스펙에 request example/schema가 충분하다는 전제하에:
	•	example 우선 사용
	•	없으면 default/enum 기반 생성
	•	그래도 없으면 최소 유효값 생성(타입 기반)

2.2 인증(권한 role 기반) 테스트 전용 토큰 방식
	•	목표: 로그인 API 의존 없이 테스트 안정성 확보
	•	역할(role)
	•	ADMIN, OPERATOR, READONLY (기본 제공)
	•	방식
	•	테스트 전용 JWT 발급(또는 생성) 기능 내장
	•	테스트 환경에서만 서버가 신뢰하는 issuer/audience/kid 기반
	•	옵션
	•	프로젝트가 원하면 API Key(권한별 키 분리)도 지원(보조 기능)

2.3 관측(증거 수집)과 실패 원인 분류
	•	테스트 러너가 수집해야 할 최소 증거
	•	요청: method, url, headers(민감값 마스킹), query, body 요약
	•	응답: status, latency(ms), body 요약
	•	에러: error.code, message, stack(테스트 환경에서만), requestId
	•	실패 원인 분류 카테고리(최소)
	1.	인증/권한(401/403)
	2.	입력 검증(400/422, validation details)
	3.	스펙 불일치(문서-구현 mismatch)
	4.	DB 오류(연결/타임아웃/무결성/데드락 등)
	5.	외부통신 오류(upstream timeout/5xx)
	6.	서버 예외(500, unhandled error)
	7.	성능(SLA 초과)

2.4 우선순위(P0~P3) 자동 산정 규칙
	•	P0 (즉시 조치)
	•	권한 과허용(READONLY로 200인데 ADMIN 전용이어야 함)
	•	5xx 빈발 / 데이터 손상 가능 / 인증 우회 가능성
	•	DB deadlock/timeout로 핵심 기능 장애
	•	P1 (빠른 조치)
	•	ADMIN인데 403(정책 과차단)으로 주요 기능 장애
	•	문서-구현 불일치로 클라이언트 차단
	•	주요 입력 검증 오작동
	•	P2
	•	비핵심 API 실패, 특정 엣지 케이스 실패
	•	P3
	•	기능은 되나 SLA 초과, 경고성(문서 예제 불일치 등)

2.5 수정 가이드(코드 위치 + 원인 + 방향) 자동 생성
	•	코드 위치 추정 방식 2단계
	•	1단계(MVP): 스택 트레이스에서 src/** 첫 프레임을 찾아 파일/라인 “후보” 추출
	•	2단계(고도화): 라우트 등록 메타데이터(컨트롤러/서비스 힌트)로 정확도 향상
	•	수정 방향 템플릿(카테고리별)
	•	권한 과허용: role guard 조건 강화, 라우트 보호 누락 점검
	•	권한 과차단: required role 재정의, 정책/가드 규칙 수정
	•	검증 실패: DTO/validator/schema 동기화
	•	DB: 인덱스/트랜잭션 범위/타임아웃/쿼리 최적화
	•	외부통신: 재시도/타임아웃/서킷브레이커/폴백

2.6 리포트 산출물(전문가 수준)
	•	REPORT.md 필수 섹션
	1.	실행 요약(성공/실패/경고, 통계)
	2.	P0~P3 요약표
	3.	핵심 리스크 Top N
	4.	실패 상세 카드(엔드포인트별)
	•	엔드포인트, role, 재현 커맨드
	•	요청/응답 요약
	•	분류 결과 + 근거
	•	코드 위치 후보
	•	수정 방향(구체적)
	5.	성능 요약(SLA 초과 목록)
	6.	문서-구현 불일치 목록

⸻

3. CLI 요구사항
	•	명령
	•	<cli명> run : 전수 테스트 실행
	•	<cli명> init : 설정 파일 템플릿 생성
	•	<cli명> validate : OpenAPI 문서 유효성 점검
	•	<cli명> report : JSON 결과를 MD로 재생성(옵션)
	•	주요 옵션
	•	--openapi <path|url>
	•	--baseUrl <url>
	•	--roles ADMIN,OPERATOR,READONLY
	•	--concurrency <n>
	•	--timeoutMs <n>
	•	--slaMs <n>
	•	--output <dir>
	•	--maskHeaders Authorization,Cookie
	•	--only <pattern> / --exclude <pattern>
	•	--failFast true|false

⸻

4. 설정 파일 스키마(예시 항목)
	•	OpenAPI
	•	source: file/url
	•	테스트 대상
	•	baseUrl
	•	include/exclude 패턴
	•	인증
	•	mode: test_jwt | api_key
	•	roles 정의
	•	jwt: issuer/audience/kid/privateKey(or secret)
	•	apiKey: role별 키
	•	실행
	•	concurrency, timeout, retry(외부통신만), slaMs
	•	리포트
	•	outputDir
	•	formats: md/json/html
	•	redact: headers/body 키 마스킹 규칙

⸻

5. 비기능 요구사항
	•	타입스크립트 기반(배포물은 JS + d.ts)
	•	Node 18+ 이상
	•	민감정보 마스킹 기본 적용
	•	로그는 단계별로 구조화(요약/상세)
	•	테스트 가능 구조(단위/통합 최소 세트)

⸻

6. 프로젝트 구조(권장)
	•	packages/ 단일 패키지 또는 모노레포(선호에 따라)
	•	src/cli/
	•	src/openapi/
	•	src/generator/ (요청 데이터 생성)
	•	src/runner/
	•	src/auth/
	•	src/analyzer/ (분류/우선순위)
	•	src/reporter/ (md/json/html)
	•	src/utils/ (마스킹, 패턴, 타이머)
	•	examples/ (샘플 openapi + 샘플 프로젝트)
	•	docs/ (사용 가이드)

⸻

개발 세션 계획(단계별 완료 조건 포함)

세션 1: 기반 뼈대 + CLI 실행
	•	범위
	•	TS 프로젝트 세팅, 빌드, CLI 엔트리
	•	init/run 명령 골격
	•	완료 조건(검증 기준)
	•	npm run build 성공
	•	npx <cli명> init가 설정 파일 생성
	•	npx <cli명> run --openapi <샘플> 실행 로그 출력

세션 2: OpenAPI 로더 + 대상 엔드포인트 추출
	•	완료 조건
	•	OpenAPI v3 json/yaml 로드 가능
	•	path/method 목록 생성 및 필터(include/exclude) 동작

세션 3: 요청 생성기(예제 기반) + 실행기(HTTP 호출)
	•	완료 조건
	•	example 기반으로 query/body/header 생성
	•	timeout 적용, 결과(성공/실패/latency) 수집

세션 4: role 기반 테스트 전용 JWT 모듈
	•	완료 조건
	•	role별 토큰 생성
	•	role별로 동일 엔드포인트 호출 가능
	•	토큰/헤더 마스킹 적용

세션 5: 분석 엔진(분류 + P0~) + 리포트(MD)
	•	완료 조건
	•	실패 원인 분류 카테고리 적용
	•	P0~P3 산정 규칙 적용
	•	REPORT.md 생성, 실패 카드에 “원인/방향” 포함

세션 6: 코드 위치 후보(스택 기반) + 재현 커맨드 생성
	•	완료 조건
	•	stack에서 파일/라인 후보 추출
	•	endpoint별 재현 커맨드 자동 출력

세션 7: 배포 준비(npm 패키징)
	•	완료 조건
	•	npm pack 결과 정상
	•	README/사용법/설정 예시 포함
	•	semver, 라이선스, changelog 기본 세팅