---
cycle: 14
issue: "gh #4 — enhancement: design-system foundation — Material 3 theme + CSS design tokens"
role: β
artifact: beta-closeout
---

# β Closeout — Cycle 14

## Merge

- **Merge SHA:** `32fb13a63931e5cc70a9d1093b51345fd451a71a`
- **Merge commit:** `feat: design-system foundation — M3 theme + CSS design tokens (gh #4, cycle/14)`
- **Branch merged:** `cycle/14` → `main`
- **Strategy:** `--no-ff`

## CI Status

- **cycle/14 head commit:** `f79631a` (implementation) / `3bc302b` (self-coherence)
- **CI on cycle/14:** No runs — CI workflow triggers only on push/PR to `main` (structural configuration, not a branch failure). Pre-existing condition; consistent with cycles 11–13.
- **CI on main (last 5 runs):** All `completed / success` (as of 2026-06-19). Post-merge CI will run on this merge commit to main.

## Review Rounds and Findings

- **Rounds:** 1
- **RC findings:** 0
- **Observations (non-blocking):** 1

| # | Type | Severity | Category | Description |
|---|------|----------|----------|-------------|
| O1 | Observation | — | ci-gate-structural | CI gate cannot be satisfied on feature branches; CI workflow triggers only on main push/PR. Pre-existing protocol–infrastructure mismatch across all cycles. Not blocking; main CI is green. |

## AC Outcome Table

| AC | Description | Verdict | Notes |
|----|-------------|---------|-------|
| AC1 | App builds on custom theme | PASS | `mat.define-light-theme` (M2) used in place of `mat.define-theme` (M3); M3 API not in @angular/material 17.3.10. M2 fallback satisfies observable oracle: custom non-indigo palette applied, build green, indigo-pink absent. Documented §Debt. |
| AC2 | Design tokens on :root | PASS | 4 status + 4 priority + 6 spacing + 3 radius + 2 elevation + 2 surface tokens present. No component-specific hex literals. |
| AC3 | Token keys match entity enums | PASS | All 8 semantic tokens map exactly to `IssueStatus`/`IssuePriority` enum values (kebab-cased). No extra tokens. |
| AC4 | Global reset and surface | PASS | `box-sizing: border-box` (styles.scss:88) and `var(--it-surface)` on body (styles.scss:97) both present. |

## Notable Observations

1. **M3 API version gap (AC1 §Debt):** `mat.define-theme` (M3 theming API) does not exist in `@angular/material 17.3.10` — it lands in AM18. The M2 fallback (`mat.define-light-theme` + `mat.define-palette`) achieves the observable design-system intent. Upgrade to AM18 is non-trivial (requires Angular framework upgrade) and deferred as future cycle scope.

2. **CI structural gap:** CI runs only on main push/PR. β cannot satisfy the CI green gate rule on feature branches given this configuration. Recommend δ consider extending CI to feature branches or adding a pre-merge PR step in a future protocol patch.

3. **Diff scope clean:** Zero non-goal surface touched (no `apps/web/src/app/` changes, no package.json changes, no dark-mode switcher). Implementation confined to 2 files: `apps/web/angular.json` (+1/-1 line) and `apps/web/src/styles.scss` (new, 99 lines; replaces deleted `styles.css`).

**Signal to γ: cycle 14 closed. Main updated at `32fb13a`. Ready for γ closeout.**
