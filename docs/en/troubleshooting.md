# Troubleshooting

Common issues and how to resolve them.

## 1. OpenAPI Spec Loading Fails
- **Symptom**: `ERROR: OpenAPI Load Failed`.
- **Cause**: The file path is incorrect, or the document has syntax errors.
- **Solution**: 
  - Run `npx openapi-auditor validate <path>` to check the spec.
  - Ensure the URL is publicly accessible if using a link.

## 2. All Requests Return 401/403
- **Symptom**: 100% failure rate with `AUTH` category.
- **Cause**: The target server does not recognize the auditor's JWT secret or token format.
- **Solution**: 
  - Configure your server to use `test-secret-key` (default) during audit sessions.
  - Check if the `Authorization` header is being stripped by a proxy/gatekeeper.

## 3. Server Returns 500 Errors
- **Symptom**: Multiple `SERVER_ERR` (P0) issues.
- **Cause**: The generated payload might be causing unexpected crashes, or the database is uninitialized.
- **Solution**: 
  - Review the "Data" section in the report to see the exact payload sent.
  - Check your server's application logs for stack traces.

## 4. Timeouts and Network Errors
- **Symptom**: `NETWORK` category failures.
- **Cause**: The `baseUrl` is incorrect, or the server is too slow/offline.
- **Solution**: 
  - Verify if you can reach the `baseUrl` from your terminal (e.g., `curl <url>`).
  - Increase the timeout in `api-quality-config.json`.

## 5. Report folder not created
- **Symptom**: No `./reports/REPORT.md` found.
- **Cause**: Permission issues or the process terminated early.
- **Solution**: Ensure the auditor has write permissions to the current directory.

---

- [Getting Started](./getting-started.md)
- [CLI Reference](./cli-reference.md)
