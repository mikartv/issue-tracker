<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap]
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

## §Skills

**Tier 1 (mandatory):**
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md` — lifecycle kernel
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md` — α role surface

**Tier 2 (always-applicable):** none triggered — change is a single-line Angular routes
addition with no new module, schema, or cross-cutting surface.

**Tier 3 (issue-specific):** none — gap is a missing router entry, not a new language
feature, CLI command, or domain contract. Angular routing API is standard; no separate
skill required.
