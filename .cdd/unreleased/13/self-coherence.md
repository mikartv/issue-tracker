<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: []
-->

# Self-Coherence — Cycle 13

## §Gap

**Issue:** gh #3 — bug: no root route — app shows blank page at /
**Mode:** design-and-build (small-change)
**Version:** cycle/13 on branch `cycle/13` (created from `origin/main` at `b3cb456`)
**Actor:** α (Alpha)

**Gap:** `app.routes.ts` defines three routes (`projects`, `projects/:projectId/issues`,
`issues/:issueId`) with no empty-path redirect. Angular router renders a blank page when
the user navigates to `/`. The fix is one additive line — `{ path: '', redirectTo:
'projects', pathMatch: 'full' }` — inserted as the first entry in the `routes` array.
