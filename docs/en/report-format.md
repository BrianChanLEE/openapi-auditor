# Report Format (`REPORT.md`)

The automatically generated `REPORT.md` is designed to be shared with stakeholders and developers as a clear action plan.

## Structure

### 1. Overall Summary
A high-level view of the API health.
- **Success Rate**: Percentage of requests that met both contract and performance criteria.
- **Average Latency**: Overall speed of the API.
- **Issue Counts**: Breakdown of P0, P1, P2, and P3 issues.

### 2. Priority Issues (P0 ~ P1)
This section lists critical bugs that require immediate fixing.
- **P0 examples**: Server crashes (500), Security leaks (READONLY access to POST).
- **P1 examples**: Authentication failures on valid Admin accounts.

### 3. Diagnosis Cards
For each failure, a detailed card is generated:
- **Endpoint**: Method and Path.
- **Role**: Which user role was being tested.
- **Reason**: The root cause (e.g., "Network Timeout", "401 Unauthorized").
- **Fix Guidance**: Actionable steps to resolve the issue.

### 4. Risk Analysis Table
A sortable table containing all test cases, categorized by priority and role.

## How to use the report
1. **CI/CD Integration**: Review the report after every automated deployment.
2. **Issue Tracking**: Use the "Fix Guidance" text to populate tasks in Jira or GitHub Issues.
3. **Collaboration**: Share the MD file with the backend team for quick debugging using the provided logs.

---

- [Diagnosis Model](./diagnosis-model.md)
- [Troubleshooting](./troubleshooting.md)
