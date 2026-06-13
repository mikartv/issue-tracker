---
cycle: 5
issue: "#5 — Comments API"
status: final
role: α
merge: "2956768"
---

# α Close-out — Cycle 5

## Summary

Cycle 5 implemented the Comments HTTP API — the final planned business module in the v1 backend (`SCOPE.md` §In scope). The entity and migration existed from cycle 2; this cycle completed the HTTP surface: module, controller, service, DTO, unit spec, e2e spec, Swagger annotations, and `app.module.ts` wiring. Branch `cycle/5` merged to `main` at `2956768` on 2026-06-13. Review: 1 round, R1 APPROVED, 0 findings. Test suite: 76 tests, 9 suites (14 new — 7 unit + 7 e2e). D-CY5-1 (provisional close-out) resolved by this final close-out.

## Friction log

- No remote configured in this environment; cloud CI was unavailable throughout the cycle. Tests confirmed green at 76/76 locally before the review-readiness signal; β independently verified locally at head SHA `c05f4df` before merge.
- `--runInBand` was already set from cycle 4; no test isolation issues encountered.
- `alpha-closeout.md` was initially written as provisional (D-CY5-1) due to bounded dispatch exit before β verdict. Re-dispatch for final close-out resolves D-CY5-1.

## Observations

- The partial-scaffold pattern (entity + migration provisioned in cycle 2, HTTP surface deferred) worked without friction: no migration change required, entity was already registered in `AppModule`, and all new implementation was confined to `apps/api/src/comments/`.
- AC4 (anonymous author) required no additional implementation beyond reading `req.userEmail` — the `UserEmailMiddleware` contract from cycle 1 applied directly with no controller-side header re-read.
- Column-based query pattern (D-CY2-4) was followed for both `create` and `findByIssue` without complication; ORM relation decorators were not needed for the feature's query surface.
- Test count: 62 → 76 (+14); suite count: 7 → 9 (+2). The 2-DB-hit-per-operation shape (issue guard + comment op) matches the existing `issues.service.ts` pattern.
- 1-round approval, 0 findings — no advisory, behavioral, or structural findings in R1.
