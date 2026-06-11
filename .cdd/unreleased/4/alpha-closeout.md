# α Close-out — Cycle 4

**Issue:** #4 — Issues API + status rules  
**Merge commit:** `abfcbb9`  
**Branch merged:** `cycle/4` → `main`  
**Close-out date:** 2026-06-11  
**Review rounds:** 1 (R1: APPROVED)

---

## Summary

Cycle 4 delivered the Issues HTTP module: 5 route handlers across two URL prefixes (`projects/:projectId/issues` for list/create; `issues/:id` for get/patch/status), 3 DTOs (`CreateIssueDto`, `UpdateIssueDto`, `UpdateIssueStatusDto`), a `TRANSITIONS` compile-time constant map covering the full forward chain and all invalid-transition cases, and an archived-project guard loading `ProjectRepository` inside `IssuesModule`. All 7 ACs met with code and test evidence. 62 tests green: 17 unit (`issues.service.spec.ts`) + 20 e2e (`issues.e2e.spec.ts`) + 25 carried from cycle 3. Zero fix rounds. Single advisory finding from β (B4-A1, documentation only). No new migration, no schema change, no Angular changes.

Outside `apps/api/src/issues/`, only `apps/api/src/app.module.ts` was modified (IssuesModule import). The module is fully additive.

---

## Friction Log

### B4-A1 — Advisory (not fixed)

`self-coherence.md` §Test counts attributed the `it(` grep false-positive to the body of the `createIssue` helper. Actual source is `app.init()` on line 42 of `issues.e2e.spec.ts` — `init(` contains the substring `it(`. The raw/actual count (21 raw / 20 actual) was correct throughout; only the explanation was wrong. β logged severity A (advisory, no required action). Count accuracy was not in dispute; no fix round triggered.

**Pattern:** grep-substring false-positive misattribution in test-count commentary. The count itself was derived correctly.

### D-CY4-1 — `--runInBand` flag added for e2e isolation

`--runInBand` added to the `jest` script in `apps/api/package.json` to prevent `afterEach` DB cleanup races when the projects and issues e2e suites share the same Postgres instance. This is the same isolation pattern used in cycle 3 for the projects suite; the flag was not present before the issues suite was added. Flag is now in `package.json` so CI picks it up automatically.

**Pattern:** shared-Postgres e2e isolation requirement surfaces each time a new e2e suite is added. Cycle 3 established the pattern; cycle 4 confirmed it.

### D-CY2-2 — No GitHub remote (carried)

No GitHub remote configured; `npm run test:api` verified locally only. Cloud CI not executed. β verified AC7 by code inspection and α's runner output. Unchanged from cycle 2.

### D-CY2-1 — `as unknown as X` cast in `user-email.middleware.spec.ts` (carried)

Untouched this cycle. Unchanged from cycle 2.

### D-CY2-4 — No ORM relation decorators (carried)

`@ManyToOne`/`@OneToMany` relations still deferred; issues loaded by `project_id` column directly. Intentional. Unchanged from cycle 2.

---

## Observations

**1-round APPROVED.** B4-A1 was the only finding; severity advisory, documentation only, no action required. No behavioral, contract, or structural incoherence found in R1.

**Additive module structure.** All new files landed in `apps/api/src/issues/`. The only modification outside that directory was `app.module.ts` (one import added) and `apps/api/package.json` (one flag added). No existing routes, DTOs, or service logic were modified.

**e2e isolation pattern.** The `--runInBand` flag to prevent shared-Postgres cleanup races is consistent with the pattern established in cycle 3. The pattern now applies to both the projects and issues suites.

**β process gap — beta-review.md committed in a separate pass.** `beta-review.md` was not committed in the same pass as the merge; it was recovered by δ prior to this close-out re-dispatch. This is a process-sequencing observation for the cycle record; it is not an α authoring failure.

**Implementation contract adherence.** All 7 contract axes confirmed in R1: TypeScript strict (no `any`), `apps/api/src/issues/` package scoping, `/api/v1` wire prefix, NestJS default error shape, UUID IDs, ISO-8601 timestamps, no separate binary.
