---
cycle: 15
issue: "gh #5 — enhancement: redesign Projects screen — card grid, empty + loading states"
role: β
artifact: beta-closeout
---

# Beta Close-out — Cycle 15

## Merge

- **Merge SHA:** `adf8071ca81609081f172e737d3b41da184a88b7`
- **Merge commit:** `feat: redesign Projects screen — card grid, empty + loading states (gh #5, cycle/15)`
- **Merged by:** `beta@issue-tracker.cdd.cnos` (Beta)
- **Target branch:** `main`
- **Source branch:** `cycle/15`

## CI Status on `cycle/15` HEAD

No CI runs on `cycle/15` — pre-existing structural gap (O1 from cycle 14 closeout: CI triggers on `main` push/PR only, not on feature branches). Tests verified locally: `npm run test:web` → **43 tests pass**. This gap does not block per dispatch exception and established cycle 14 precedent.

## Review Rounds and Findings

| Round | Verdict | Findings |
|-------|---------|----------|
| R1 | REQUEST CHANGES | F-1 (B, honest-claim): `self-coherence.md §Diff scope` stated incorrect insertion/deletion counts for both changed files |
| R2 | **APPROVE** | 0 findings — F-1 correctly resolved; all ACs met; honest-claim check passes |

**Total findings:** 1 (1 binding RC in R1, resolved in R2)
**Finding class:** honest-claim (documentation inaccuracy, no code change required)

## AC Outcome Table

| AC | Status | Evidence |
|----|--------|----------|
| AC1 — Responsive card grid | ✅ PASS | `<table mat-table>` absent; `<mat-card>` elements present in `@for` loop; `MatTableModule` removed; `MatCardModule` imported and used; CSS grid with `repeat(auto-fill, minmax(280px, 1fr))`; `@media (max-width: 767px)` single-column; `displayedColumns` removed |
| AC2 — Designed empty state | ✅ PASS | `<div class="empty-state">` with `<mat-icon>folder_open</mat-icon>`, `<p>No projects yet</p>`, and `<button mat-raised-button>Create project</button>`; bare `<p>No projects yet.</p>` absent; AC2 test verifies `.empty-state`, mat-icon, and button |
| AC3 — Loading state | ✅ PASS | `@if (loading)` block with `<mat-spinner diameter="40" />` retained |
| AC4 — Card actions preserved + token cleanup | ✅ PASS | `[routerLink]="['/projects', project.id, 'issues']"` present; `archiveProject(project)` preserved; `archiveErrors[project.id]` inline-error intact; create form present; no `#c00`/`#ccc` literals; 10 `var(--it-*)` token applications |

## Non-Goal Verification

- No changes to `apps/api/` ✅
- No changes to `apps/web/src/styles.scss` ✅
- No `package.json` changes ✅
- No rename UI, search, filter, or pagination controls ✅

## Notable Observations

- **Wiring consistent:** `MatCardModule` imported, declared in `imports` array, and used in template (`mat-card`, `mat-card-header`, `mat-card-title`, `mat-card-actions`). No orphaned imports.
- **Token coverage exceeded:** 10 `var(--it-*)` applications (requirement: ≥2). R1 tokens fully applied to component — grid gap, empty-state layout, badge border-radius, error/badge colors.
- **Scaffold predicted correctly:** γ's `gamma-scaffold.md` enumerated all 3 hardcoded literals and accurately predicted the surfaces α would touch. Peer enumeration was accurate.
- **F-1 pattern:** Diff-count mismatch in self-coherence is a recurring class (cycle 15 R1 = honest-claim on scaffold prediction vs actual counts). Consider automating diff-count verification in α's pre-review gate.
