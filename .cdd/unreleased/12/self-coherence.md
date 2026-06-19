---
cycle: 12
issue: "gh #2 — bug: raw enum values displayed in issue-detail (status, priority, Move to button)"
role: α
artifact: self-coherence
---

<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap]
-->

## §Gap

**Issue:** gh #2 — bug: raw enum values displayed in issue-detail (status, priority, Move to button)
**Mode:** design-and-build
**Version:** cycle/12

The gap is the absence of `statusLabels` and `priorityLabels` maps in `IssueDetailComponent`. The component renders `{{ issue.status }}`, `{{ issue.priority }}`, and `Move to {{ nextStatus }}` — all raw enum keys from the database (`in_progress`, `critical`). `ProjectIssuesComponent` already ships the correct label maps (since cycle 7); `IssueDetailComponent` regressed when it was added in cycle 8. This cycle closes the regression.

## §Skills

**Tier 1a:**
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md` — kernel + lifecycle
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md` — α role surface

**Tier 2:** Angular 17 + TypeScript strict conventions (from `.cdd/STACK.md`)

**Tier 3:** None — single-component template fix; no schema-bearing parser or new module.
