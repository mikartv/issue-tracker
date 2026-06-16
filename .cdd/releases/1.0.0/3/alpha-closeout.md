# α Close-out — Cycle 3

**Issue:** #3 — Projects API  
**Merge commit:** `4316935`  
**Branch:** `cycle/3` → `main`  
**Merge date:** 2026-06-11  
**Review rounds:** 2 (R1: REQUEST CHANGES; R2: APPROVED)

---

## Summary

Cycle 3 added the Projects HTTP module (create, list, rename, archive) on top of the cycle-2 persistence layer. Seven ACs met with code and test evidence. 25 tests pass locally (7 pre-existing + 8 service spec + 10 e2e spec). One fix round (F1: honest-claim mis-count in `self-coherence.md`, fixed in `2a20b49`). Merge clean at `4316935`.

---

## Friction log

**F1 — Honest-claim mis-count (A-severity; fixed in `2a20b49`)**  
`self-coherence.md` stated "7 cases" for `projects.service.spec.ts` at two sites (§ACs AC7 and §Self-check claim-evidence table). Actual count: 8 (1 create + 1 findAll + 3 rename + 3 archive = 8). The runner total of 25 was correct throughout; only the per-file narrative was wrong. Fix scoped to those two sites; intra-doc grep confirmed zero residual occurrences of the stale count.

**D-CY3-1 — E2e test filename deviation from γ scaffold**  
γ scaffold named `projects.e2e-spec.ts`; Jest testRegex `.*\.spec\.ts$` requires a `.spec.ts` suffix; file renamed to `projects.e2e.spec.ts` in commit `5c85c80`. Self-coherence §ACs references updated to match. No functional impact.

**D-CY3-2 — Supertest default import form**  
`import supertest from 'supertest'` required instead of `import * as supertest` due to `esModuleInterop: true` combined with `@types/supertest@6.x` exporting the function as default. No runtime issue; type-system artifact from supertest v6 typings.

**D-CY2-2 carried — No GitHub remote; no cloud CI**  
`npm run test:api` exits 0 locally; no GitHub Actions execution possible. Pre-review gate row 10 met locally only. This constraint carried from cycle 2 and limited β's independent test verification in both rounds.

---

## Observations

**Round count and finding class:** 2 rounds; 1 finding total. F1 was a documentation arithmetic error, not a behavioral gap. Runner total was correct from the start; drift was between the per-file narrative ("7 cases") and the arithmetic sum (1+1+3+3=8).

**Additive cycle shape:** the change was purely additive — no existing module modified beyond `app.module.ts`. Peer enumeration and harness audit both passed vacuously (no existing route family; no schema-bearing contract changed).

**E2e isolation pattern:** standalone NestJS app with `ProjectsModule` only and a direct TypeORM connection; `beforeAll` runs migrations (idempotent via migrations table); `afterEach` deletes all rows in the `project` table. Isolation holds without undoing the migration schema between cases.

**γ-scaffold filename drift:** γ scaffold used `.e2e-spec.ts`; Jest testRegex requires `.spec.ts`. Deviation surfaced at runtime when Jest did not discover the e2e file. Fix was a rename in commit `5c85c80` plus a self-coherence reference update (D-CY3-1).
