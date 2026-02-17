# openapi-auditor

[![npm version](https://img.shields.io/npm/v/openapi-auditor.svg)](https://www.npmjs.com/package/openapi-auditor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Diagnosis and Prescription for Your APIs.**  
> Automatically audit all OpenAPI (Swagger) endpoints, classify failures by priority (P0-P3), and generate expert-level reports with fix guidance.

---

## Quick Start

Get started in less than a minute.

### 1. Install
```bash
npm install -D openapi-auditor
```

### 2. Initialize
```bash
npx openapi-auditor init
```
This creates `api-quality-config.json` in your root.

### 3. Run Audit
```bash
npx openapi-auditor run --openapi ./openapi.json --baseUrl http://localhost:3000
```

### 4. Check Report
Open `./reports/REPORT.md` to see the diagnosis results.

---

## Key Features

- **Automated Audit**: Full coverage of all endpoints defined in your OpenAPI spec.
- **Intelligent Payload Generation**: Automatically generates valid test data based on schemas.
- **Role-Based Testing**: Validates security by testing with different access roles (ADMIN, OPERATOR, READONLY).
- **Diagnosis & Guidance**: Not just 'fail', but 'why' and 'how to fix' with P0-P3 prioritization.
- **Expert Reports**: Generates professional `REPORT.md` with statistics and risk analysis.

## Why openapi-auditor?

The "Auditor" sits at the intersection of **Contract Testing**, **Runtime Validation**, and **Security Auditing**.

```mermaid
graph TD
    subgraph "Contract (Spec)"
    A((Spec Compliance))
    end
    subgraph "Runtime (Execution)"
    B((Runtime Behavior))
    end
    subgraph "Security (Roles)"
    C((Access Control))
    end
    A --- D{Quality}
    B --- D
    C --- D
    style D fill:#f96,stroke:#333,stroke-width:4px
```

*The overlapping area represents the high-quality API environment that `openapi-auditor` ensures.*

---

## Documentation

- [English (EN)](./docs/en/getting-started.md)
- [한국어 (KO)](./README.ko.md) / [상세 문서](./docs/ko/getting-started.md)

## Intelligence Configuration

You can use `${ENV_VAR}` syntax to inject secrets from environment variables.

```json
{
  "openapi": "./openapi.json",
  "baseUrl": "${API_URL}",
  "timeout": 5000,
  "outputDir": "./reports"
}
```

## CI/CD Integration

`openapi-auditor` is designed for modern CI pipelines with a specialized CI mode and flexible exit policies.

### CLI Options for CI
- `--ci`: Minimize console output for cleaner logs.
- `--summaryJson`: Output a single-line JSON summary at the end.
- `--failOn <P0|P1|P2|P3>`: Set the threshold for build failure (default: `P1`).
- **Exit Codes**:
  - `0`: Success (or only low-priority warnings).
  - `1`: Found issues at or above `failOn` level.
  - `2`: Critical (P0) issues found.

### GitHub Actions Example
```yaml
- name: API Quality Audit
  run: |
    npx openapi-auditor run --ci --failOn P0
  env:
    API_URL: ${{ secrets.STAGING_API_URL }}
    ADMIN_TOKEN: ${{ secrets.ADMIN_TOKEN }}
```

## Artifacts and Intelligence Reports
- `reports/REPORT.md`: Human-readable summary with fix guidance.
- `reports/REPORT.json`: Machine-readable results for integration.
- `reports/artifacts/*.json`: Detailed, masked request/response logs for every failure.

## Supported Versions and Limitations

- **OpenAPI**: 3.0.x (Full support), 2.0 (Limited)
- **Authentication**: Role-based JWT is preferred.
- **Limitations**: Complex state-dependent flows (e.g., A must be created before B) require tailored data in the spec examples.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security

See [SECURITY.md](./SECURITY.md).

## 📄 License

[MIT](./LICENSE)
