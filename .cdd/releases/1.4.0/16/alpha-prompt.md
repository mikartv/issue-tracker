# α Dispatch Prompt — Cycle 16

You are α (implementer) for CDD cycle 16.

## Skills (Tier 1a — load in order before any other step)

Load these files verbatim before taking any action:

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/issue/SKILL.md`
4. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md`
5. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md`

## Project context (read before implementing)

```
gh issue view 6                                         # full contract: gap, ACs, non-goals
.cdd/PROJECT.md                                         # verified repo map
.cdd/STACK.md                                           # pinned conventions + dispatch bindings
.cdd/SCOPE.md                                           # product boundary
.cdd/unreleased/16/gamma-scaffold.md                    # γ selection, peer enumeration, oracle approach
.cdd/iterations/INDEX.md                                # prior protocol findings
.cdd/releases/1.3.0/15/gamma-closeout.md                # last closed cycle
```

## Cycle

- **Issue:** gh #6 — enhancement: modern app shell — toolbar, brand, responsive content layout
- **Branch:** `cycle/16`
- **Mode:** design-and-build (3 ACs, small-change)
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

## Git identity

Before any commit on `cycle/16`:

```bash
git config user.name "Alpha"
git config user.email "alpha@issue-tracker.cdd.cnos"
```

Switch to the branch before committing:

```bash
git switch cycle/16
```

Verify identity before first commit:

```bash
git log -1 --format='%ae' HEAD
```

Must equal `alpha@issue-tracker.cdd.cnos`. If not, fix with `git config user.email "alpha@issue-tracker.cdd.cnos"` and rebase per `alpha/SKILL.md §2.6` row 14.

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) — inline component CSS only (no new SCSS files; no changes to `apps/web/src/styles.scss`) |
| CLI integration target | N/A (standalone Angular SPA) |
| Package scoping | `apps/web/src/app/app.component.ts` and `apps/web/src/app/app.component.spec.ts` only |
| Existing-binary disposition | N/A |
| Runtime dependencies | `@angular/material ~17.3.0` (already installed; `MatToolbarModule` available — no new npm deps); `@angular/router` (already installed; `RouterLink` available) |
| JSON/wire contract preservation | API contract unchanged; no backend changes |
| Backward-compat invariant | All existing routes/behaviors preserved; 119 tests (76 api + 43 web) must pass with 0 regressions |

## Work

Implement all 3 ACs in gh #6 on branch `cycle/16`.

**AC1 — Toolbar present and unconditional on all routes:**
- Import `MatToolbarModule` from `@angular/material/toolbar` into `AppComponent.imports`
- Add `<mat-toolbar>` as a direct child of the component root, above `<router-outlet>`
- The toolbar must render on every route — no `@if`, no route guard, no conditional visibility
- Style the toolbar with R1 tokens (e.g. `background: var(--it-surface)`, `box-shadow: var(--it-shadow-1)`)

**AC2 — Brand links home via router:**
- Import `RouterLink` from `@angular/router` into `AppComponent.imports`
- Inside `<mat-toolbar>`, render a brand anchor: `<a routerLink="/projects">Issue Tracker</a>`
- The anchor MUST use `routerLink` (Angular Router directive) — NOT `href` (which causes a full page reload)
- Remove the existing bare `<h1>Issue Tracker</h1>` from the template

**AC3 — Responsive content frame:**
- Wrap `<router-outlet>` in `<div class="app-content">` (or equivalent container element)
- Apply inline component CSS: `max-width` (pick a sensible value such as 1200px or align with the widest per-view container at 1000px), `margin: 0 auto`, and horizontal padding using R1 spacing tokens (e.g. `padding: 0 var(--it-space-4)`)
- The layout must be fluid below the `max-width` breakpoint: at a 375px viewport, no horizontal scrollbar must appear on `<body>`

**Note on app.component.spec.ts:**
- The existing 2 tests (`should create the app`, `should have title "issue-tracker"`) must still pass
- Add `MatToolbarModule` to the TestBed `imports` in the spec; add at least 1 assertion verifying `<mat-toolbar>` is present in the rendered DOM (AC1 test surface)
- Known gap per issue proof plan: no component test for responsive layout at 375px — verified by manual resize only; record this in `self-coherence.md §Known Gaps`

## Pre-review gate — row 16 reminder

**Note:** The cn-sigma vendor copy of `alpha/SKILL.md §2.6` may not yet carry row 16 (cn-sigma re-vendor is a deferred output from cycle 15). Apply row 16 regardless:

> **Row 16 — §Diff scope counts verified via runner output.** Before signaling review-readiness, run `git show <impl-commit> --numstat` (where `<impl-commit>` is the SHA of the last implementation commit, not the readiness-signal commit) and verify that the insertions and deletions in every row of `self-coherence.md §Diff scope` match the `--numstat` output exactly. Do not use estimated or preliminary counts. If any value mismatches, update `self-coherence.md §Diff scope` before signaling. *Source: cnos `a4b25e6` (2026-06-24); issue-tracker cycle 15 F-1 (B, honest-claim) — §Diff scope stated `+110/−57`; actual was `+93/−46`; 5 of 6 values wrong; β caught via honest-claim check.*

## Self-coherence

Write `.cdd/unreleased/16/self-coherence.md` on `cycle/16` before signaling review-readiness. Include:

- Gap covered
- Mode: design-and-build (3 ACs)
- AC outcomes (PASS/FAIL per AC with evidence)
- Diff scope (files changed, insertions, deletions — from `git show <impl-commit> --numstat`)
- Tests at signal (api + web counts from `npm run test:web` runner output)
- Known Gaps (responsive layout test absent — manual resize only)
- CDD Trace (steps 1–7)
- Review-readiness section (round 1, base SHA, branch CI status)

## Signal

After all ACs pass, pre-review gate passes, and self-coherence is committed to `cycle/16`:

```
REVIEW READY
Branch: cycle/16
ACs: AC1 ✓ AC2 ✓ AC3 ✓
Tests: 76 api + N web = N+76 total
```

Do not merge. Do not push to main. β will review.
