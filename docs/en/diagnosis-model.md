# Diagnosis Model

`openapi-auditor` doesn't just report failures; it analyzes the context to provide intelligent prioritization and fix guidance.

## Failure Categories

The auditor classifies every unsuccessful request into one of these buckets:

| Category | Definition | Key Status Codes |
| :--- | :--- | :--- |
| **AUTH** | Identity or permission issues. | 401, 403 |
| **VALIDATION** | Request data doesn't match schema or logic. | 400, 422 |
| **SERVER_ERR** | Internal application failures. | 500, 502, 503 |
| **NOT_FOUND** | Missing endpoints or resources. | 404 |
| **NETWORK** | External connection or infrastructure issues. | N/A (Timeout) |

## Priority Calculation (P0 ~ P3)

We use a "Security and Stability First" logic:

- **P0 (Critical)**:
  - **Security Breach**: A restricted role (e.g., READONLY) successfully performs a write operation (e.g., POST).
  - **Server Instability**: Any 5xx internal server error.
- **P1 (High)**:
  - **Core Failure**: An authorized ADMIN role cannot access a valid endpoint (401/403).
  - **Infrastructure**: Network timeouts prevented the audit from completing.
- **P2 (Medium)**:
  - Valid requests failing due to data validation (400) or missing endpoints (404).
- **P3 (Low)**:
  - Minor schema mismatches or performance slightly below SLA.

## Prescription (Fix Guidance)

The auditor maps the **Classification + Priority** to a specific textual guide.

**Example Logic:**
- *Category: AUTH + Priority: P0 (READONLY allowed to POST)*
  - **Guidance**: "CRITICAL: Authorization bypass detected. Check your middleware for proper role-based access control (RBAC) on this endpoint."

---

- [Detailed Diagrams](./diagrams.md)
- [Troubleshooting](./troubleshooting.md)
