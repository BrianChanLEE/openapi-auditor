# Report Format

The automatically generated report suite is designed for both human review and machine-driven CI pipelines.

## 📄 `REPORT.md` (Human Readable)

Designed to be shared with stakeholders and developers as a clear action plan.

### Structure
1. **Overall Summary**: Statistics on success rate, latency, and issues by priority.
2. **Priority Issues (P0 ~ P1)**: Detailed cards for critical bugs that require immediate attention.
3. **Artifact Links**: Each failure card includes a direct link to a detailed JSON artifact for deep debugging.
4. **Risk Analysis Table**: A sortable list of all tested endpoints.

---

## 🤖 `REPORT.json` (Machine Readable)

A structured version of the audit results, perfect for custom CI scripts or dashboard integration.

```json
{
  "summary": {
    "total": 42,
    "success": 38,
    "failure": 4,
    "successRate": "90.5",
    "p0": 1,
    "p1": 2,
    "timestamp": "2024-02-17T..."
  },
  "results": [ ... ]
}
```

---

## 📦 `artifacts/*.json` (Detailed Logs)

For every failed test, a dedicated JSON file is created in the `artifacts/` folder.
These files contain:
- **Masked Headers**: Bearer tokens and cookies are automatically redacted.
- **Full Payload**: Request data used for the test.
- **Detailed Response**: Status code, body, and specific error messages.
- **Fix Guidance**: A copy of the "how to fix" advice from the main report.

---

- [Diagnosis Model](./diagnosis-model.md)
- [Troubleshooting](./troubleshooting.md)
