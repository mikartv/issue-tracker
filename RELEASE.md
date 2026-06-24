# release 1.3.0 — issue-tracker

## Outcome

Coherence delta: C_Σ A- (`α B+`, `β A`, `γ A-`) · **Level:** `L5`

One design-and-build cycle (15) ships the second wave of the R2–R8 UI redesign:
the Projects screen is rebuilt from a plain table to a responsive card grid with
designed empty and loading states, and full R1 design-token coverage.

## Why it matters

v1.2.0 established the design-system foundation (M2 theme + 17 CSS tokens) but left
the Projects screen on the old `<table mat-table>` layout with unstyled empty states
and hardcoded color literals. v1.3.0 closes that gap: the screen now renders as a
multi-column `mat-card` grid at desktop, single-column at mobile, with a designed
empty state (icon + message + CTA) and the existing loading spinner retained.
All three hardcoded color literals (`#c00`, `#ccc`) are replaced with R1 tokens —
10 `var(--it-*)` applications in total.

## Changed

- **Projects screen layout** (#5, cycle 15): `<table mat-table>` replaced with a
  responsive `<mat-card>` grid (`display: grid; grid-template-columns:
  repeat(auto-fill, minmax(280px, 1fr))`; single-column below 768 px).
  `MatTableModule` removed; `MatCardModule` added. `displayedColumns` property removed.
- **Empty state** (#5, cycle 15): bare `<p>No projects yet.</p>` replaced with a
  designed block — `<mat-icon>folder_open</mat-icon>`, "No projects yet", and a
  "Create project" button that scrolls to the create form.
- **Token cleanup** (#5, cycle 15): `.error { color: #c00 }`,
  `.inline-error { color: #c00 }`, `.archived-badge { background: #ccc }` — all three
  literals replaced with `var(--it-priority-critical)` / `var(--it-surface)` /
  `var(--it-status-closed)` tokens from the R1 layer.

## Validation

- 119 tests (76 api + 43 web) — CI green on merge SHA `adf8071` →
  CI green on `0e0c6c1` (actions/runs/28097347245, 2026-06-24T12:08:17Z)
- Card actions preserved: routerLink → `/projects/:id/issues`, Archive button,
  409 "Already archived" inline error, create form — all functional.

## Known Issues

- **R3–R8 redesign wave in progress**: `ProjectIssuesComponent` and remaining
  components still use the pre-redesign layout; R3 is the next planned cycle.
- **CI on feature branches absent** (O1, structural): CI triggers on `main` push
  only; feature-branch runs are manual. Filed as deferred infrastructure gap.
- **Angular Material 18 upgrade deferred**: `mat.define-theme` (M3 API) not yet
  adopted; current theme uses the M2 `mat.define-light-theme` API from cycle 14.
- **E2E automation remains manual** (`docs/SMOKE.md`).
- **Grid responsiveness oracle is manual**: multi-column vs single-column viewport
  behavior verified by code inspection only; no automated viewport test.
