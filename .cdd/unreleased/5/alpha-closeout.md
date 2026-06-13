---
cycle: 5
issue: "#5 — Comments API"
status: provisional — pending β outcome
role: α
---

# α Close-out — Cycle 5 [provisional]

**Note (D-CY5-1):** This close-out is written at review-readiness time before β verdict, per α SKILL §2.8 provisional close-out fallback. It will be supplemented after β approves and γ requests re-dispatch.

## Summary

Cycle 5 added the Comments HTTP API — the final planned business module in the v1 backend (`SCOPE.md` §In scope). The entity and migration existed from cycle 2; this cycle completed the HTTP surface: module, controller, service, DTO, unit spec, e2e spec, Swagger annotations, and `app.module.ts` wiring.

## Implementation facts

- 6 new files in `apps/api/src/comments/`; 2 modified (`app.module.ts`, `PROJECT.md`)
- 2 routes: `POST /api/v1/issues/:issueId/comments` (201/400/404), `GET /api/v1/issues/:issueId/comments` (200/404)
- Author sourced exclusively from `req.userEmail` (set by global `UserEmailMiddleware`) — no header re-read in controller
- Column-based queries consistent with D-CY2-4 pattern from cycles 2–4
- 14 new tests (7 unit + 7 e2e); total 76 API tests

## Friction log

- No remote configured in this environment; branch CI state unverifiable locally. Tests confirmed green at `76/76` before review-readiness signal. β must verify CI before merge.
- `--runInBand` was already set from cycle 4; no test isolation issues encountered.

## Observations

- The partial-scaffold pattern (entity + migration shipped ahead of HTTP surface) worked smoothly: no migration change needed, entity was already registered in `AppModule`, dispatch notes were complete.
- AC4 (anonymous author) required zero additional implementation beyond reading `req.userEmail` — the middleware contract from cycle 1 paid off cleanly here.
- Test count growth: 62 → 76 (14 new); suite count: 7 → 9.
