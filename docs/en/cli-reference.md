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

**Options:**
- `-o, --openapi <path>`: Path to OpenAPI spec.
- `-b, --baseUrl <url>`: Target server URL.
- `-d, --outputDir <dir>`: Report output directory (default: `./reports`).
- `-t, --timeout <ms>`: Individual request timeout.

```bash
npx openapi-auditor run -o spec.json -b http://localhost:8080
```

### `validate`
Checks if the provided OpenAPI spec is valid and can be parsed by the auditor.

```bash
npx openapi-auditor validate ./openapi.json
```

## Exit Codes

- `0`: Success (All tests completed, regardless of pass/fail counts).
- `1`: Infrastructure Failure (Config missing, network down, invalid spec).

---

- [Getting Started](./getting-started.md)
- [Report Format](./report-format.md)
