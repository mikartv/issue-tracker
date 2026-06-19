<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills, ACs, Self-check, Debt]
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

## §Self-check

**Did α push ambiguity onto β?** No. The change is a one-line additive entry in a routes
array. The issue, the γ scaffold, and the Angular routing API together make the
implementation unambiguous. β has nothing to discover that α should have resolved.

**Is every claim backed by evidence in the diff?**
- AC1 (redirect entry present and first): backed by the diff hunk above and the test run
  output showing 42/42 pass.
- No automated browser test was produced; this is explicitly permitted per the γ scaffold's
  proof plan Known Gap. The oracle is manual smoke.

**Peer enumeration:** γ scaffold already enumerated all peers via `rg "redirectTo|path: ''"
apps/web/src/` → no matches. The only surface touched is `app.routes.ts`. No sibling
routes files exist. Peer enumeration complete.

**Harness audit:** no schema-bearing type, parser, or manifest was changed. The routes
array is a TypeScript literal consumed by the Angular router framework. No shell harness,
CI emitter, or test fixture writes routes. Harness audit: not applicable.

**Implementation contract compliance:**
- Language: TypeScript ✅
- Package scoping: `apps/web/` ✅
- Additive-only: existing three routes unchanged ✅
- No API/wire contract change: no backend touched ✅

## §Debt

**Known debt:** The AC1 oracle is manual smoke only — no automated Angular router navigation
test (`provideRouter` + `Router.navigate([''])`) was added. This is declared as a Known Gap
in the proof plan and is not a protocol gap; it is product-level test coverage debt at the
app-routing level. A future cycle could add a `app.routes.spec.ts` to cover redirect
behavior automatically.

**No other debt.** The change is a single additive line; no legacy forms, no workarounds,
no partial implementations.

## §CDD Trace

Lifecycle steps α is responsible for (Steps 4–7 of the 0–13 CDS table); Step 6 enumerates
all files in `git diff --stat origin/main..HEAD`.

| Step | Action | Artifact / evidence |
|------|--------|---------------------|
| 1 — Receive | Loaded dispatch: branch `cycle/13`, issue gh #3. Configured git identity: `alpha@issue-tracker.cdd.cnos`. Verified `origin/cycle/13` exists. | Git identity: `alpha@issue-tracker.cdd.cnos` (verified at `git log -1 --format='%ae' HEAD`). |
| 2 — Design | Not required. Single-line additive routing entry; no new module, no design doc needed. Justification: γ scaffold §Surfaces explicitly limits change to 1 file, 1 line, 0 new surfaces. | Explicit "not required." |
| 3 — Plan | Not required. Implementation sequencing trivial: one entry added to one array. | Explicit "not required." |
| 4 — Tests | Existing 42 web tests ran; 0 regressions. No new automated test added (permitted per γ scaffold Known Gap). | `npm run test:web` → `Tests: 42 passed, 42 total`. |
| 5 — Code | Added `{ path: '', redirectTo: 'projects', pathMatch: 'full' }` as first entry in `routes` array. Commit `95f69e7`. | `apps/web/src/app/app.routes.ts` +1 line. |
| 6 — Docs | Not required. No authority surface, API shape, or runbook changed. Full diff vs `origin/main`: `apps/web/src/app/app.routes.ts` (+1 line, implementation); `.cdd/unreleased/13/gamma-scaffold.md` (γ artifact, not α-authored); `.cdd/unreleased/13/alpha-prompt.md` (γ artifact, not α-authored); `.cdd/unreleased/13/beta-prompt.md` (γ artifact, not α-authored); `.cdd/unreleased/13/self-coherence.md` (this file, α artifact). No component, README, or other doc surface changed. | Explicit "not required." All 5 files in diff enumerated above. |
| 7 — Self-coherence | This file — `.cdd/unreleased/13/self-coherence.md`. Sections: Gap ✅ Skills ✅ ACs ✅ Self-check ✅ Debt ✅ CDD Trace ✅ Review-readiness (pending). | Written and committed section-by-section per `alpha/SKILL.md` §2.5 incremental discipline. |
