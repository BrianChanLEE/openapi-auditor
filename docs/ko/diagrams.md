# 시각화 데이터 (Diagrams)

`openapi-auditor`가 추구하는 핵심 가치를 다이어그램으로 설명합니다.

## 1. API 품질의 정의
API 품질은 단순히 "죽지 않는 것"이 아닙니다. 탄탄한 계약(Contract), 원활한 실행(Runtime), 그리고 빈틈없는 보안(Security)의 교집합입니다.

```mermaid
graph TD
    subgraph "품질의 3대 요소"
    A["계약 (스펙 준수)"]
    B["실행 (성능/안정성)"]
    C["보안 (접근 제어)"]
    end
    A --- D["API 품질 (Quality)"]
    B --- D
    C --- D
    style D fill:#f96,stroke:#333,stroke-width:4px
```

## 2. 포지셔닝: 테스트 vs 모니터링 vs 감사(Audit)
테스트가 기대치(Pass/Fail)를 확인하고 모니터링이 일반적인 생존 상태를 본다면, **진단 도구(Auditor)**는 스펙과 실제 동작을 교차 대조하여 구조적인 통찰을 제공합니다.

```mermaid
flowchart TD
    subgraph "포지셔닝"
    Test[테스트 - Pass/Fail]
    Mon[모니터링 - Health]
    Aud[진단/감사 - Audit]
    end
    Test <--> Aud
    Mon <--> Aud
    style Aud fill:#58a,color:#fff
```

## 3. 실패 분류 맵
다양한 에러 유형 간의 관계와 이들이 시스템 건강에 미치는 영향을 보여줍니다.

```mermaid
graph LR
    Fail[실패 유형] --> Ext[외부 요인]
    Fail --> Int[내부 요인]
    
    Ext --> Net[네트워크/타임아웃]
    Ext --> Spec[스펙 불일치]
    
    Int --> Sec[인증/보안 결함]
    Int --> Crh[서버 크래시]
    Int --> Val[검증 로직 오류]
    
    style Sec fill:#f66
    style Crh fill:#f66
```

---

- [진단 모델](./diagnosis-model.md)
- [시작하기](./getting-started.md)
