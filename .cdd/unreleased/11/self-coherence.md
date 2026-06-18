<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: []
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
