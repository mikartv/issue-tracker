# release 1.4.0 — issue-tracker

## Outcome

Coherence delta: C_Σ A- (`α B+`, `β A`, `γ A-`) · **Level:** `L5`

One design-and-build cycle (16) ships the third wave of the R2–R8 UI redesign:
`AppComponent` is rebuilt from a bare wrapper stub to a full persistent app shell —
a `<mat-toolbar>` with a brand navigation anchor and a responsive `<div class="app-content">`
container that all routed views now share.

## Why it matters

v1.3.0 shipped the Projects screen card-grid redesign (R2) but left the app shell as a
bare `<main><h1>Issue Tracker</h1><router-outlet /></main>` stub — no persistent chrome,
no brand navigation, each routed component managing its own max-width container
independently. v1.4.0 closes that gap: the toolbar renders on every route, the brand
link navigates to `/projects` via Angular router (no full-page reload), and the
`<div class="app-content">` container (`max-width: 1000px; margin: 0 auto; padding: 0
var(--it-space-4)`) provides a single, token-based layout frame for all views.

## Changed

- **App shell** (#6, cycle 16): `AppComponent` redesigned — persistent `<mat-toolbar>`
  (token-based: `var(--it-surface)` background, `var(--it-shadow-1)` box-shadow) at top
  of every route. Brand "Issue Tracker" rendered as `<a routerLink="/projects">` — Angular
  router navigation, no full reload. `<router-outlet>` wrapped in `<div class="app-content">`
  (`max-width: 1000px; margin: 0 auto; padding: 0 var(--it-space-4)`).
  `MatToolbarModule` and `RouterLink` added to `AppComponent` imports. Spec updated:
  `should render mat-toolbar` assertion added (+1 web test, 44 total web).
  No new npm dependencies.

## Validation

- 120 tests (76 api + 44 web) — green locally on merge SHA `9a3aed73`
- CI pending `origin/main` push (δ action); all prior `origin/main` CI runs green
- Toolbar renders persistently on `/projects`, `/projects/:id/issues`, `/issues/:id`
- Brand link navigates to `/projects` via Angular router (no white flash)
- Content centered and fluid at narrow viewport (375 px)

## Known Issues

- **R4–R8 redesign wave in progress**: per-view `max-width` containers
  (`ProjectsListComponent`, `ProjectIssuesComponent`, `IssueDetailComponent`) still
  duplicate layout responsibility now owned by the shell `.app-content` frame; R4 is
  the next planned cycle (migrate at least one view to remove per-view container).
- **CI on feature branches absent** (O1, structural): CI triggers on `main` push only;
  feature-branch runs are manual. Filed as deferred infrastructure gap (δ owner).
- **Angular Material 18 upgrade deferred**: `mat.define-theme` (M3 API) not yet adopted;
  current theme uses the M2 `mat.define-light-theme` API from cycle 14.
- **E2E automation remains manual** (`docs/SMOKE.md`).
