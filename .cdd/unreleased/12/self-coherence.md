---
cycle: 12
issue: "gh #2 — bug: raw enum values displayed in issue-detail (status, priority, Move to button)"
role: α
artifact: self-coherence
---

<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills, ACs, Self-check, Debt]
-->

## §Gap

**Issue:** gh #2 — bug: raw enum values displayed in issue-detail (status, priority, Move to button)
**Mode:** design-and-build
**Version:** cycle/12

The gap is the absence of `statusLabels` and `priorityLabels` maps in `IssueDetailComponent`. The component renders `{{ issue.status }}`, `{{ issue.priority }}`, and `Move to {{ nextStatus }}` — all raw enum keys from the database (`in_progress`, `critical`). `ProjectIssuesComponent` already ships the correct label maps (since cycle 7); `IssueDetailComponent` regressed when it was added in cycle 8. This cycle closes the regression.

## §Skills

**Tier 1a:**
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md` — kernel + lifecycle
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md` — α role surface

**Tier 2:** Angular 17 + TypeScript strict conventions (from `.cdd/STACK.md`)

**Tier 3:** None — single-component template fix; no schema-bearing parser or new module.

## §ACs

Per-AC oracles run against branch `cycle/12`, implementation SHA `4518cd9`.

| AC | Oracle | Result | Evidence |
|----|--------|--------|----------|
| AC1 | Unit test `label-AC1`: render with `status = 'in_progress'`; assert `<p>` containing "Status:" shows "In Progress", not "in_progress" | **PASS** | `label-AC1` test passes; DOM text `Status: In Progress` confirmed in runner output |
| AC2 | Unit test `label-AC2`: render with `priority = 'critical'`; assert `<p>` containing "Priority:" shows "Critical", not "critical" | **PASS** | `label-AC2` test passes; DOM text `Priority: Critical` confirmed |
| AC3 | Unit test `label-AC3`: render with `status = 'open'`; assert button text = "Move to In Progress", not "in_progress" | **PASS** | `label-AC3` test passes; button text `Move to In Progress` confirmed |

**Test runner output (42 tests, 5 suites):**
```
Tests:       42 passed, 42 total
Test Suites: 5 passed, 5 total
```

**Negative checks (per AC oracles):**
- `in_progress` absent from Status display position: confirmed — Status paragraph shows "Open" for `open`, "In Progress" for `in_progress`
- `critical` absent from Priority display position: confirmed — Priority paragraph shows "Critical" for `critical`
- `in_progress` absent from button text: confirmed — button shows "Move to In Progress"

**Invariant check:** `statusLabels` covers all 4 entity-canonical status values (`open`, `in_progress`, `done`, `closed`). `priorityLabels` covers all 4 priority values (`low`, `medium`, `high`, `critical`). Both match entity enum in `apps/api/src/entities/issue.entity.ts`.

## §Self-check

**Did α's work push ambiguity onto β?** No.

- Three ACs have direct test evidence. Negative assertions are present for each (raw key absent from display position).
- The one pre-existing test that checked the buggy behavior (`AC2a: shows "Move to in_progress" button...`) was updated to assert the new correct label — this is the correct disposition for a test that validated a bug.
- The existing test `AC1: displays title, status, and project link` checked `toContain(mockIssue.status)` where `mockIssue.status = 'open'`. After fix, "open" renders as "Open" — test updated to `toContain('Open')`. No ambiguity left for β.
- Peer enumeration: only `IssueDetailComponent` is in-scope. `ProjectIssuesComponent` has label maps already and is explicitly out-of-scope per γ-scaffold and issue. No other components render issue status/priority.
- Harness audit: N/A — no schema-bearing contract changed; API wire format unchanged.
- Implementation contract: language (TypeScript strict), package scoping (`issue-detail.component.ts` only), no new runtime dependencies — all axes honored.

## §Debt

**D1 — Pre-existing `resolved` key in `project-issues.component.ts`:**
`project-issues.component.ts` L171 maps `resolved: 'Resolved'` but the entity enum has `done`, not `resolved`. This is a pre-existing discrepancy noted in the γ-scaffold. Explicitly out of scope for cycle 12 per the dispatch. No debt introduced by this cycle; the pre-existing bug survives.

**D2 — No automated E2E DOM-content assertions:**
The issue body marks this as a non-goal (U4 tracking). Manual smoke only for DOM rendering; no new debt added by this cycle.

**D3 — γ-artifact configuration:**
This cycle runs under §5.2 (δ=γ, single-session). `gamma-scaffold.md` is present at `.cdd/unreleased/12/gamma-scaffold.md` on `origin/cycle/12`. Rule 3.11b §5.1 canonical dispatch satisfied.

## §CDD Trace

| Step | Lifecycle step | Artifact / evidence | Status |
|------|---------------|---------------------|--------|
| 0 | Dispatch received | α-prompt at `.cdd/unreleased/12/alpha-prompt.md` on `origin/cycle/12` | ✅ |
| 1 | Branch checkout | `git switch cycle/12 && git pull origin cycle/12` — already on branch, up to date | ✅ |
| 2 | Issue read | `gh issue view 2` — full contract read; all AC surfaces identified | ✅ |
| 3 | Related artifacts read | `gamma-scaffold.md`, `PROJECT.md`, `STACK.md`, `SCOPE.md`, entity file, reference component `project-issues.component.ts` | ✅ |
| 4 | Skills loaded | Tier 1a: CDD.md, alpha/SKILL.md. Tier 2: STACK.md conventions. Tier 3: none | ✅ |
| 5 | Design | Not required — single-file template fix; no incoherence requires a design artifact. γ-scaffold defines the scope; α executes it | ✅ (explicitly not required) |
| 6 | Implementation | `apps/web/src/app/issues/issue-detail.component.ts` — added `statusLabels`, `priorityLabels`; updated 3 template expressions. `issue-detail.component.spec.ts` — updated 2 existing tests that validated buggy behavior; added 3 new AC tests. Commit `4518cd9` on `cycle/12`. No new files; no API files touched. Caller-path trace N/A (label maps are properties accessed from template, not new modules). | ✅ |
| 7 | Self-coherence | This document. ACs: AC1/AC2/AC3 all PASS. 42 tests pass (39 → 42). Known debt explicit (D1–D3). | ✅ |

**Pre-review gate (§2.6):**

| Row | Check | Result |
|-----|-------|--------|
| 1 | Branch rebased onto `origin/main` | ✅ `origin/main` at same SHA as `cycle/12` base; branch is 7 commits ahead, 0 behind |
| 2 | `self-coherence.md` carries CDD Trace through step 7 | ✅ |
| 3 | Tests present | ✅ 42 tests (3 new AC tests) |
| 4 | Every AC has evidence | ✅ AC1/AC2/AC3 each have unit test + assertion |
| 5 | Known debt explicit | ✅ D1–D3 in §Debt |
| 6 | Schema/shape audit | N/A — no schema-bearing contract changed |
| 7 | Peer enumeration | ✅ `IssueDetailComponent` only; `ProjectIssuesComponent` explicitly out-of-scope; no other component renders issue status/priority |
| 8 | Harness audit | N/A — no schema-bearing contract |
| 9 | Post-patch re-audit | ✅ TypeScript (only language in diff): `npm run test:web` green; template binding type-safe |
| 10 | Branch CI green | ⚠️ CI triggers on `main` only (per `.github/workflows/ci.yml` `on: push: branches: [main]`); no CI run on cycle branches. Local `npm run test:web` = 42/42 pass. β to verify CI green on PR before merge. |
| 11 | Artifact enumeration matches diff | ✅ `git diff --stat origin/main..HEAD` shows 3 files: `issue-detail.component.ts`, `issue-detail.component.spec.ts`, `self-coherence.md` — all mentioned in this document |
| 12 | Caller-path trace for new modules | N/A — no new modules added; label maps are class properties accessed from template |
| 13 | Test assertion count from runner | ✅ Runner output: `Tests: 42 passed, 42 total` |
| 14 | α commit author email | ✅ `git log -1 --format='%ae' HEAD` → `alpha@issue-tracker.cdd.cnos` |
| 15 | γ-artifact presence (rule 3.11b) | ✅ `.cdd/unreleased/12/gamma-scaffold.md` present on `origin/cycle/12` (§5.1 canonical dispatch) |
