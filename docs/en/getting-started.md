# Getting Started with openapi-auditor

This guide will walk you through the process of setting up and running your first API audit.

## Prerequisites

- **Node.js**: v14 or higher (v18+ recommended)
- **NPM**: v6 or higher
- **OpenAPI Spec**: A valid file (JSON/YAML) or a public URL

## Installation

We recommend installing `openapi-auditor` as a development dependency in your project:

```bash
npm install -D openapi-auditor
```

Alternatively, you can run it directly using `npx` without installation.

## 1. Initialize Configuration

First, generate a default configuration file:

```bash
npx openapi-auditor init
```

This will create `api-quality-config.json` in your current directory with the following defaults:

```json
{
  "openapi": "./openapi.json",
  "baseUrl": "http://localhost:3000",
  "timeout": 5000,
  "outputDir": "./reports"
}
```

## 2. Run the Auditor

Execute the audit using the configuration file or by passing CLI arguments:

```bash
# Using config file
npx openapi-auditor run

# Overriding with arguments
npx openapi-auditor run --openapi ./spec/auth-api.yaml --baseUrl https://api.staging.example.com
```

### What happens during execution?
1. **Spec Loading**: It reads and validates your OpenAPI document.
2. **Endpoint Extraction**: It identifies all paths and HTTP methods.
3. **Payload Generation**: It creates dummy data for request bodies.
4. **Execution**: It sends requests for each Role (ADMIN, OPERATOR, READONLY).
5. **Analysis**: It classifies the responses into Success or Failure categories.

## 3. Review the Results

Once the run completes, check the generated report:

```bash
open ./reports/REPORT.md
```

### Understanding the Report
The report is divided into:
- **Summary**: High-level pass/fail statistics.
- **Priority Issues**: Critical (P0) and High (P1) issues that need immediate attention.
- **Audit Cards**: Detailed breakdown for each endpoint.

---

## Next Steps
- Learn more about [Configuration](./configuration.md)
- Check the [CLI Reference](./cli-reference.md)
- Understand the [Diagnosis Model](./diagnosis-model.md)
