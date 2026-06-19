<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills, ACs, Self-check, Debt, CDD Trace]
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

## §Review-readiness | round 1

```
review-ready: true
```

**Implementation SHA:** `95f69e7` (last implementation commit before readiness signal)
**Branch:** `origin/cycle/13`

**Pre-review gate (α/SKILL.md §2.6):**

| Row | Check | Result |
|-----|-------|--------|
| 1 | `origin/cycle/13` rebased onto current `origin/main` | ✅ Branch is 8 commits ahead of main; `origin/main` observed at merge base `b3cb456` — unchanged since γ created the branch. |
| 2 | Self-coherence carries CDD Trace through step 7 | ✅ Trace table above covers steps 1–7. |
| 3 | Tests present, or explicit reason none apply | ✅ 42 existing tests run and pass; no new test required per γ scaffold Known Gap. |
| 4 | Every AC has evidence | ✅ AC1 mapped to diff hunk + test output in §ACs. |
| 5 | Known debt is explicit | ✅ §Debt names the manual-only oracle as test coverage debt. |
| 6 | Schema/shape audit completed when contracts changed | ✅ Not applicable — no schema-bearing type or contract changed. |
| 7 | Peer enumeration completed | ✅ `rg "redirectTo|path: ''"` confirmed single touch point; enumeration in §Self-check. |
| 8 | Harness audit completed when schema-bearing contract changed | ✅ Not applicable — no schema-bearing contract changed. |
| 9 | Post-patch re-audit completed after mid-cycle patch | ✅ Not applicable — no mid-cycle patch; single implementation commit. |
| 10 | Branch CI green on head commit | CI runs on push/PR to `main` only per `.github/workflows/ci.yml`; no CI run on `cycle/13` directly. Local `npm run test:web` → 42/42 pass. β should verify CI green after merge to main. |
| 11 | Artifact enumeration matches diff | ✅ All 5 files in `git diff --stat origin/main..HEAD` enumerated in §CDD Trace step 6. |
| 12 | Caller-path trace for new modules | ✅ Not applicable — no new module or function added. |
| 13 | Test assertion count from runner output | ✅ Pasted verbatim: `Tests: 42 passed, 42 total` (from §ACs). |
| 14 | α commit author email matches canonical pattern | ✅ `git log -1 --format='%ae' HEAD` = `alpha@issue-tracker.cdd.cnos`. All α commits verified. |
| 15 | γ-artifact presence | ✅ `git cat-file -e origin/cycle/13:.cdd/unreleased/13/gamma-scaffold.md` → present. γ-artifact at canonical §5.1 path. |

**Ready for β.**
