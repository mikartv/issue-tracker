<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills]
-->

# Self-Coherence — Cycle 16

## §Gap

- **Issue:** gh #6 — enhancement: modern app shell — toolbar, brand, responsive content layout
- **Branch:** `cycle/16`
- **Mode:** design-and-build (3 ACs, small-change)
- **Version:** targeting 1.4.0
- **Gap:** `AppComponent` renders a bare `<main><h1>Issue Tracker</h1><router-outlet /></main>` with no persistent chrome, no brand navigation, and no responsive content frame. Every routed view re-implements its own container. This cycle adds a `<mat-toolbar>` app shell with a brand anchor, and a shared responsive content container wrapping `<router-outlet>`.

## §Skills

**Tier 1:**
- `CDD.md` — canonical lifecycle
- `alpha/SKILL.md` — α role surface
- `issue/SKILL.md` — issue shape and AC interpretation
- `post-release/SKILL.md` — assessment reference
- `operator/SKILL.md` — dispatch config §5.2

**Tier 2:** TypeScript strict, Angular 17 standalone component patterns

**Tier 3:** `@angular/material/toolbar` (MatToolbarModule), `@angular/router` (RouterLink) — both already installed per implementation contract

## §ACs

Per-AC oracles run against implementation commit `988a9d4`.

### AC1 — Toolbar present and unconditional on all routes: **PASS**

**Invariant:** `<mat-toolbar>` is a direct child of `AppComponent`, above the outlet, rendered on every route.

**Evidence:**
- `MatToolbarModule` imported at `app.component.ts:3` and listed in `imports` array at line 8.
- Template: `<mat-toolbar>` is the first element in the component template, above `<div class="app-content">` and `<router-outlet>`. No `@if`, no route guard, no conditional visibility.
- R1 tokens applied inline: `background: var(--it-surface); box-shadow: var(--it-shadow-1)`.
- Spec: `app.component.spec.ts` line 28 asserts `compiled.querySelector('mat-toolbar')` is truthy after `fixture.detectChanges()`.
- Test runner: 44 web tests pass (`Tests: 44 passed`); the new `should render mat-toolbar (AC1)` test included.

### AC2 — Brand links home via router: **PASS**

**Invariant:** Toolbar shows "Issue Tracker" as a `routerLink="/projects"` anchor (no full reload).

**Evidence:**
- `RouterLink` imported at `app.component.ts:2` and listed in `imports` array at line 8.
- Template: `<a routerLink="/projects" ...>Issue Tracker</a>` inside `<mat-toolbar>`. No `href` attribute present.
- Bare `<h1>Issue Tracker</h1>` removed (was in the old `<main>` block; `<main>` also removed).
- Styled inline: `text-decoration: none; color: inherit; font-weight: 600` — navigation-link appearance without `href`.

### AC3 — Responsive content frame: **PASS**

**Invariant:** Routed content renders inside a centered container with a token max-width; no horizontal body scroll at narrow widths.

**Evidence:**
- Template: `<router-outlet />` wrapped in `<div class="app-content">`.
- Component `styles`: `.app-content { max-width: 1000px; margin: 0 auto; padding: 0 var(--it-space-4); }`.
- `max-width: 1000px` aligns with the widest per-view container (issue detail uses 800px, project issues uses 1000px per `.container` rules); the shell frame matches the widest existing view.
- `padding: 0 var(--it-space-4)` = `0 16px` — prevents content from touching viewport edges at 375px.
- At 375px viewport: content area = 375px − 32px padding = 343px, well below 1000px cap. No overflow source. Global `box-sizing: border-box` reset in `styles.scss` ensures padding is contained. No horizontal scrollbar.
- Known gap: no component test at 375px — manual resize only (see §Debt).
