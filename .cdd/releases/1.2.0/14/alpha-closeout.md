---
cycle: 14
issue: "gh #4 — enhancement: design-system foundation — Material 3 theme + CSS design tokens"
role: α
artifact: alpha-closeout
---

# Alpha Close-out — Cycle 14

## Summary

**Issue:** gh #4 — enhancement: design-system foundation — Material 3 theme + CSS design tokens
**AC1:** PASS — custom theme applied via `mat.define-light-theme` + `mat.define-palette` (M2 API); `indigo-pink` absent; build green.
**AC2:** PASS — all 17 tokens declared under `:root` (6 spacing, 3 radius, 2 elevation, 2 surface, 4 status, 4 priority).
**AC3:** PASS — 8 semantic tokens map exactly to `IssueStatus`/`IssuePriority` enum values, kebab-cased; no extra tokens.
**AC4:** PASS — `box-sizing: border-box` globally; `body { margin: 0; background: var(--it-surface); font-family: Roboto, ... }`.
**Round count:** 1 (β approved at R1; 0 RC findings; 1 non-blocking observation)
**Test suite:** 76 api + 42 web = 118 passed (CI green on main post-merge)

## Cycle Observations

**Design decision (M2 vs M3 API):** `@angular/material 17.3.10` does not ship `mat.define-theme` (M3 theming API) — confirmed by exhaustive grep of installed package. M3 `define-theme` lands in Angular Material 18.0. In design-and-build mode, α chose the available M2 API (`mat.define-light-theme` + `mat.define-palette`). The observable oracle — custom non-indigo palette applied, `all-component-themes` called, build green, `indigo-pink` absent — is satisfied. β confirmed this disposition at R1. The upgrade to AM18 remains deferred as a future cycle.

**Implementation scope:** Two files changed: `apps/web/src/styles.scss` (new, 99 lines; replaces deleted `styles.css`) and `apps/web/angular.json` (`styles[]` path updated, +1/-1 line). Zero component or API changes. Diff scope matched γ scaffold prediction exactly.

**γ scaffold accuracy:** γ scaffold's peer enumeration, oracle approach, and expected diff scope were all accurate. The M3 API availability gap was not predicted in the scaffold; α discovered it during implementation via empirical package inspection. §Debt documented transparently; β evaluated and accepted the M2 fallback.

**β observation O1 (CI structural gap):** CI triggers only on main push/PR — feature branches do not get CI runs. Pre-existing across all cycles; acknowledged, non-blocking. β noted this for δ consideration in a future protocol patch.

**Test environment note:** API e2e tests (41 tests) fail locally when `DATABASE_URL` is not in the shell environment. This is a pre-existing condition unrelated to cycle 14. All 76 API tests pass in CI (GitHub Actions sets `DATABASE_URL`). Web tests: 42 passed locally and in CI.

## Friction Log

One friction point: the dispatch and issue asserted `mat.define-theme` ships with @angular/material 17.3. It does not. α spent time verifying this empirically before making the design decision. The §Debt documentation and the self-coherence Known Gap section handled this cleanly; β's R1 review accepted the disposition. Potential process improvement: γ scaffold should include API-availability checks for newly referenced APIs in design-and-build cycles. (Not filing a process issue; volume is low and the self-coherence §Debt mechanism handled it adequately.)

## No Protocol Gaps

No CDD skill-loading failures, no honest-claim violations, no role-boundary violations observed. The pre-review gate (15 rows) passed cleanly at R1. The structural CI note (row 10) correctly anticipated β's CI-gate observation.
