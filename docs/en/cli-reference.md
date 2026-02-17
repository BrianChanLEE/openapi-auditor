# CLI Reference

Usage: `npx openapi-auditor [command] [options]`

## Commands

### `init`
Creates a sample `api-quality-config.json` in the current directory.

```bash
npx openapi-auditor init
```

### `run`
Starts the diagnostic process. It will look for a config file if no options are provided.

**Primary Options:**
- `-o, --openapi <path>`: Path to OpenAPI spec.
- `-b, --baseUrl <url>`: Target server URL.
- `-d, --outputDir <dir>`: Report output directory (default: `./reports`).

**CI/CD & Advanced Options:**
- `--ci`: CI mode. Disables decorative logs and minimizes output.
- `--summaryJson`: Prints a single-line JSON summary after execution.
- `--failOn <level>`: Threshold for build failure. (Options: `P0`, `P1`, `P2`, `P3`. Default: `P1`).

```bash
npx openapi-auditor run --ci --failOn P0
```

### `validate`
Checks if the provided OpenAPI spec is valid and can be parsed by the auditor.

```bash
npx openapi-auditor validate ./openapi.json
```

## Exit Codes

- `0`: Success (No issues found, or all issues are below the `--failOn` threshold).
- `1`: Failure (Issues at or above `--failOn` threshold (P1+) found, or environment error).
- `2`: Critical Failure (P0 issues found).

---

- [Getting Started](./getting-started.md)
- [Report Format](./report-format.md)
