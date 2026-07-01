---
cycle: 20
issue: "gh #14 — fix: cdkDropListGroup bracket syntax breaks ng build (NG8002)"
role: α
artifact: alpha-closeout
merge-sha: 4579792
---

# α Close-Out — Cycle 20

## AC Results

| AC | Statement | Result | Evidence |
|----|-----------|--------|----------|
| AC1 | `ng build --configuration=production` exits 0, no NG8002 | PASS | `Application bundle generation complete. [2.518 seconds]` — exit 0, no NG8002 diagnostic; pre-existing budget warning only |
| AC2 | 61 existing web tests pass | PASS | `Tests: 61 passed, 61 total` — 6 suites, 1.995 s |

## Friction Log

None. The fix was a 2-character removal (`[` and `]`) on one line. NG8002 error message was explicit and pointed directly at the offending syntax. No ambiguity, no tooling issues.

## Debt Log

Per §Debt of self-coherence.md:

1. **Bundle size warning** — `ng build` emits `[WARNING] bundle initial exceeded maximum budget. Budget 500.00 kB was not met by 269.88 kB`. Pre-existing condition from cycle 19 (CDK drag-and-drop). Deferred as a separate issue.
2. **ng build CI step** — CI workflow does not run `ng build`; the NG8002 defect went undetected at merge time because Jest tests do not trigger AOT compilation. Adding an `ng build` step to `.github/workflows/ci.yml` is deferred as a separate issue.
