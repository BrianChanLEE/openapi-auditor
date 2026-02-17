# Migration Guide: openapi-auditor v1.x

This document is for users migrating from openapi-auditor v1.0.0 to the latest advanced version (v1.2.0+).

## 1. Summary of Major Changes (No-Emoji)
- **Schema Versioning**: A `schemaVersion` field has been added to `REPORT.json`.
- **Latency Percentiles**: P95 and P99 metrics are now calculated by default, in addition to averages.
- **Rule Engine Externalization**: The hardcoded priority logic has been moved to the `RuleEngine` module, allowing for external rule injection.
- **Emoji Removal**: All output and reports now use text badges instead of emojis.

## 2. REPORT.json Compatibility
Schemas from v1.1.0 and above maintain backward compatibility. The existing `summary` field structure is preserved, with the following additions:
- `summary.performance`: Detailed latency distribution data (P50~P99).
- `coverage`: Contract and role-based coverage metrics.

## 3. New CLI Options
- **--compare <path>**: Automatically detects regressions by comparing with a previous report.
- **--trace-rules**: Outputs tracing logs for applied diagnostic rules for each endpoint.

## 4. Backward Compatibility Policy
- All existing CLI arguments and default behaviors are preserved.
- Old JSON reports without a schema version are automatically interpreted in v1.0.0 compatibility mode.
