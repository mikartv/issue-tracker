<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap]
-->

# Self-Coherence — Cycle 11 (gh #1)

## §Gap

**Issue:** gh #1 — Cycle 11 — UX navigation: routerLink between views
**Mode:** design-and-build
**Version:** 1.0.0

Three Angular views exist (`/projects`, `/projects/:id/issues`, `/issues/:id`) but were
not connected by `routerLink`. Application was navigable only by manual URL entry.
Single routerLink confirmed in codebase: `issue-detail.component.ts:54` (back-link only).

The gap closes when:
- Every project row links to its issues list
- Every issue row links to its detail view
- Empty states are shown when lists are empty
- Status/priority display as human-readable labels
- Form submit errors are inline (not full-view replacements)

## §Skills

**Tier 1a (loaded in order before any other step):**
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md` — kernel + domain package registry
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md` — α role contract

**Tier 2 (always-applicable):**
- `.cdd/PROJECT.md` — verified repo map
- `.cdd/STACK.md` — pinned conventions + dispatch bindings
- `.cdd/SCOPE.md` — product boundary

**Tier 3 (issue-specific):**
- `.cdd/unreleased/11/gamma-scaffold.md` — γ scaffold with AC oracle corrections and expected diff scope
- Angular 17 standalone component patterns (RouterLink, OnPush, HttpClientTestingModule)

Design artifact: not required — single-surface Angular-only UX change, no API or route
changes, no new abstractions. The implementation notes in the dispatch prompt provided
sufficient orientation.
