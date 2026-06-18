<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills]
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

## §ACs

Per-AC oracles run against implementation SHA `3b1b943`.

| AC | Status | Evidence |
|----|--------|----------|
| AC1 | PASS | `grep -r "routerLink" apps/web/src/app/projects/projects-list.component.ts` → `<a [routerLink]="['/projects', project.id, 'issues']"` at line 45. Test `AC1: project name links have routerLink to /projects/:id/issues` passes — verifies href `/projects/1/issues` and `/projects/2/issues` on rendered links. |
| AC2 | PASS | `grep -r "routerLink" apps/web/src/app/projects/project-issues.component.ts` (corrected oracle) → `<a [routerLink]="['/issues', issue.id]"` at line 57. Test `AC2: issue title links have routerLink to /issues/:id` passes — verifies href `/issues/i1` and `/issues/i2`. |
| AC3 | PASS | Template shows `<p>No projects yet.</p>` inside `@else if (projects.length === 0)` at line 41. Test `AC3: shows "No projects yet." when project list is empty` passes — flushes empty array, checks textContent and confirms table is null. |
| AC4 | PASS | Template shows `<p>No issues yet.</p>` inside `@else if (issues.length === 0)` at line 41 of `project-issues.component.ts`. Test `AC4: shows "No issues yet." when issue list is empty` passes. |
| AC5 | PASS | Template display expressions use `statusLabels[issue.status] ?? issue.status` and `priorityLabels[issue.priority] ?? issue.priority` (lines 46, 51). No raw enum strings in `{{ ... }}` bindings. `grep "in_progress\|critical" apps/web/src/app/projects/project-issues.component.ts` returns only class-body lines (statusLabels map key `in_progress: 'In Progress'`, priorityLabels map key `critical: 'Critical'`, and `priorities` array for select form field). Test `AC5: status and priority display as human-readable labels` passes — confirms `In Progress`, `High`, `Medium` in DOM text and `in_progress` absent. Note: corrected oracle from dispatch prompt applied — AC5 scope is template display expressions only, not TS class body. |
| AC6 | PASS | Two patterns fixed: (1) load error: both components changed from `@else if (error) { <error replaces view> }` to `@if (error) { <error> }` inside the `@else` block so the form remains visible. (2) submit error in `ProjectIssuesComponent`: `submitCreate()` now sets `this.createError` instead of `this.error`; `createError` shown inline under Create Issue button as `<p class="create-error">`. Test `AC6 inline create error: non-409 submit failure shows createError inline without replacing table` passes — verifies `component.createError` truthy, `component.error` null, table still present, `.create-error` element present in DOM. |
| AC7 | DEFERRED | Manual runbook gate — not executable by α; deferred to operator. Router plumbing is correct (RouterLink imported, routes unchanged from cycle 6, `routerLink` bindings use correct paths). |
