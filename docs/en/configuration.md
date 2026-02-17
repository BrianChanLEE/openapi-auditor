# Configuration Reference

The `openapi-auditor` can be configured via `api-quality-config.json` or CLI flags.

## Config File: `api-quality-config.json`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `openapi` | `string` | `"./openapi.json"` | Path to your OpenAPI spec (local file or URL). |
| `baseUrl` | `string` | `"http://localhost:3000"` | The target server URL to test against. |
| `timeout` | `number` | `5000` | Timeout in milliseconds for each request. |
| `outputDir` | `string` | `"./reports"` | Directory where `REPORT.md` will be saved. |
| `roles` | `string[]` | `["ADMIN", "OPERATOR", "READONLY"]` | Roles to use for testing. |

### Advanced Options (Planned)
- `concurrency`: Number of simultaneous requests.
- `slaMs`: Threshold for performance warnings.
- `maskHeaders`: List of sensitive headers to mask in logs.

## Security & Authentication

By default, the auditor generates a test-only JWT for each role. You can customize the token generation or provide static tokens (coming soon).

> [!IMPORTANT]
> Ensure your test server is configured to accept the test-secret predefined in the auditor, or provide your own secret in the configuration.

```json
{
  "openapi": "https://api.example.com/swagger.json",
  "baseUrl": "https://api.staging.example.com",
  "roles": ["ADMIN", "USER", "GUEST"]
}
```

---

- [Getting Started](./getting-started.md)
- [CLI Reference](./cli-reference.md)
