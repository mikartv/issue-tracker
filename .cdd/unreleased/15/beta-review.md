---
cycle: 15
issue: "gh #5 — enhancement: redesign Projects screen — card grid, empty + loading states"
role: β
artifact: beta-review
round: 1
verdict: REQUEST CHANGES
---

# Beta Review — Cycle 15, Round 1

## Mechanical Pre-checks

| Check | Result | Notes |
|-------|--------|-------|
| Step 1 — Git identity | ✅ PASS | All feat/fix commits authored by `alpha@issue-tracker.cdd.cnos`; `mihail_ar00@mail.ru` commits are bootstrap `cdd:` artifacts only |
| Step 2 — CI green gate | ⚠️ NOTE | No CI runs on `cycle/15` (pre-existing structural gap O1 from cycle 14 — CI triggers on `main` only). Tests verified locally: `npm run test:web` → 43 tests pass. Per dispatch: do not block on absent runs when gap is documented. |
| Step 3 — γ scaffold present | ✅ PASS | `.cdd/unreleased/15/gamma-scaffold.md` non-empty on `origin/cycle/15` |
| Step 4 — Non-goal check | ✅ PASS | No changes to `apps/api/`, `apps/web/src/styles.scss`, or `package.json`; no rename UI, search, filter, or pagination |

## AC Review

| AC | Status | Evidence |
|----|--------|----------|
| AC1 — Responsive card grid | ✅ PASS | `<table mat-table>` absent from template; `<mat-card>` elements present in `@for` loop; `MatTableModule` removed from imports array; `MatCardModule` imported and used; CSS grid rule `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` in component styles; `@media (max-width: 767px)` forces single column; `displayedColumns` property removed |
| AC2 — Designed empty state | ✅ PASS | `<div class="empty-state">` with `<mat-icon>folder_open</mat-icon>`, `<p>No projects yet</p>`, and `<button mat-raised-button color="primary" (click)="scrollToCreate()">Create project</button>` replaces bare `<p>No projects yet.</p>`; test AC2 verifies `.empty-state`, mat-icon, and button presence |
| AC3 — Loading state | ✅ PASS | `@if (loading)` block with `<mat-spinner diameter="40" />` retained unchanged |
| AC4 — Card actions preserved + token cleanup | ✅ PASS | `[routerLink]="['/projects', project.id, 'issues']"` present; `archiveProject(project)` preserved; `archiveErrors[project.id]` inline-error path intact; create form div present with `#createForm` ref; `grep -n "#c00\|#ccc"` returns no matches; `var(--it-*)` found in 9+ style rules |

## Wiring Check

`MatCardModule` is imported (`import { MatCardModule } from '@angular/material/card'`), listed in the `imports` array, and used in the template (`<mat-card>`, `<mat-card-header>`, `<mat-card-title>`, `<mat-card-actions>`). Import ↔ usage consistent. ✅

## Honest-Claim Check

| Claim | Expected | Actual | Result |
|-------|----------|--------|--------|
| Web test count | 43 | 43 (verified: `npm run test:web`) | ✅ PASS |
| `projects-list.component.ts` insertions | +93 | **+78** | ❌ MISMATCH |
| `projects-list.component.ts` deletions | −46 | **−44** | ❌ MISMATCH |
| `projects-list.component.spec.ts` insertions | +17 | **+15** | ❌ MISMATCH |
| `projects-list.component.spec.ts` deletions | −11 | **−2** | ❌ MISMATCH |
| Total insertions | +110 | **+93** | ❌ MISMATCH |
| Total deletions | −57 | **−46** | ❌ MISMATCH |

Verified with `git show 757a528 --numstat`:
```
15  2  apps/web/src/app/projects/projects-list.component.spec.ts
78  44  apps/web/src/app/projects/projects-list.component.ts
```

## Findings

### F-1 — Severity B — honest-claim — §Diff scope mismatch

**Category:** honest-claim

**Description:** `self-coherence.md §Diff scope` states incorrect insertion/deletion counts for both changed files. Actual numbers (from `git show 757a528 --numstat`):

| File | Claimed | Actual |
|------|---------|--------|
| `projects-list.component.ts` | +93 / −46 | +78 / −44 |
| `projects-list.component.spec.ts` | +17 / −11 | +15 / −2 |
| **Total** | **+110 / −57** | **+93 / −46** |

**Fix required:** Update `self-coherence.md §Diff scope` to match actual diff counts. No code changes required.

## Verdict

**REQUEST CHANGES** — 1 finding (F-1, severity B, honest-claim).

Implementation is correct. All 4 ACs are met. Tests pass. The sole finding is a factual inaccuracy in the self-coherence §Diff scope table. Fix is documentation-only.
