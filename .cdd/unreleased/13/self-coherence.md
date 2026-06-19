<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills]
-->

# Self-Coherence — Cycle 13

## §Gap

**Issue:** gh #3 — bug: no root route — app shows blank page at /
**Mode:** design-and-build (small-change)
**Version:** cycle/13 on branch `cycle/13` (created from `origin/main` at `b3cb456`)
**Actor:** α (Alpha)

**Gap:** `app.routes.ts` defines three routes (`projects`, `projects/:projectId/issues`,
`issues/:issueId`) with no empty-path redirect. Angular router renders a blank page when
the user navigates to `/`. The fix is one additive line — `{ path: '', redirectTo:
'projects', pathMatch: 'full' }` — inserted as the first entry in the `routes` array.

## §Skills

**Tier 1 (mandatory):**
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md` — lifecycle kernel
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md` — α role surface

**Tier 2 (always-applicable):** none triggered — change is a single-line Angular routes
addition with no new module, schema, or cross-cutting surface.

**Tier 3 (issue-specific):** none — gap is a missing router entry, not a new language
feature, CLI command, or domain contract. Angular routing API is standard; no separate
skill required.

## §ACs

Per-AC oracles run against branch HEAD at implementation SHA `95f69e7`.

### AC1: Root URL redirects to /projects

**Invariant:** navigating to `/` produces a redirect to `/projects` and the projects list
renders.

**Evidence — diff:**
```diff
--- a/apps/web/src/app/app.routes.ts
+++ b/apps/web/src/app/app.routes.ts
@@ export const routes: Routes = [
+  { path: '', redirectTo: 'projects', pathMatch: 'full' },
   { path: 'projects', component: ProjectsListComponent },
```
The redirect entry is now the first element in the `routes` array. Angular router
evaluates routes top-to-bottom; `pathMatch: 'full'` ensures this entry fires only for the
exact empty path, leaving all other routes unaffected.

**Evidence — tests:** `npm run test:web` output:
```
Test Suites: 5 passed, 5 total
Tests:       42 passed, 42 total
```
All 42 pre-existing tests pass; zero regressions.

**Oracle status:** Manual smoke (`http://localhost:4200/` → `/projects`) is the AC1 oracle
per the proof plan Known Gap. No automated navigation test is required per the γ scaffold.
AC1 is mechanically provable by inspection of the routes array (redirect entry is present
and first) and empirically verifiable via the browser smoke.

**Pass condition met:** redirect entry present and first in `routes` array. ✅
