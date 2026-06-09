# Issue 10 — Integration smoke + README polish

**Mode:** design-and-build  
**Status:** open  
**Branch:** cycle/10

## Problem

**What exists:** Feature-complete slices (cycles 0–9) possibly without end-to-end verification.  
**What is expected:** Documented full local run path and automated or scripted smoke covering SCOPE DoD.  
**Where they diverge:** README or smoke may be incomplete.

## Source of truth

- `.cdd/SCOPE.md` — project-level Definition of Done
- `.cdd/STACK.md` — script names

## Acceptance Criteria

- [ ] AC1: README documents: prerequisites (Node 20, Docker), `dev:db`, `dev:api`, `dev:web`, `test:all`
- [ ] AC2: `npm run test:all` passes from clean clone (document any one-time setup)
- [ ] AC3: Smoke script or e2e test: create project → create issue → comment → status through `closed` (api-level supertest or documented manual checklist in `docs/SMOKE.md`)
- [ ] AC4: Swagger `/api/docs` lists all v1 endpoints
- [ ] AC5: No open contradictions between SCOPE, STACK, and implemented behavior
- [ ] AC6: `.cdd/PROJECT.md` claims verified against code, CI, and README

## Non-goals

- Production deploy
- Performance tuning
- New features

## Closure

SCOPE project DoD satisfied; branch `cycle/10`; operator can run smoke without chat context.
