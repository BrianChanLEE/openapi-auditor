# Visualizing API Quality

These diagrams illustrate the core philosophy behind `openapi-auditor`.

## 1. Defining API Quality
API Quality is not just about "not crashing"; it's the intersection of a solid contract, smooth runtime, and tight security.

```mermaid
graph TD
    subgraph "The Pillars of Quality"
    A["Contract (Spec)"]
    B["Runtime (Performance)"]
    C["Security (Access)"]
    end
    A --- D["API Quality"]
    B --- D
    C --- D
    style D fill:#f96,stroke:#333,stroke-width:4px
```

## 2. Positioning: Audit vs. Testing
While Testing looks for expected pass/fail, and Monitoring looks for general health, an **Auditor** cross-references the spec against runtime behavior for deeper structural insights.

```mermaid
flowchart TD
    subgraph "Positioning"
    Test[Testing]
    Mon[Monitoring]
    Aud[Auditing]
    end
    Test <--> Aud
    Mon <--> Aud
    style Aud fill:#58a,color:#fff
```

## 3. Failure Classification Map
The relationship between different error types and how they impact the overall system health.

```mermaid
graph LR
    Fail[FAILURES] --> Ext[External]
    Fail --> Int[Internal]
    
    Ext --> Net[Network/Timeout]
    Ext --> Spec[Spec Mismatch]
    
    Int --> Sec[Auth/Security]
    Int --> Crh[Server Crash]
    Int --> Val[Validation]
    
    style Sec fill:#f66
    style Crh fill:#f66
```

---

- [Diagnosis Model](./diagnosis-model.md)
- [Getting Started](./getting-started.md)
