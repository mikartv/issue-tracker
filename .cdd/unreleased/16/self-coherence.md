<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap]
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
