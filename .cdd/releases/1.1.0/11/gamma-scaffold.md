---
cycle: 11
issue: "gh #1 — UX navigation: routerLink between views"
role: γ
artifact: gamma-scaffold
---

# γ Scaffold — Cycle 11

## Issue

**gh #1 — Cycle 11 — UX navigation: routerLink between views**
Mode: design-and-build
Priority: P2 (only open issue; no explicit label)
Work-shape: typical (7 ACs, single-surface Angular-only change)

## Selection

Selected under `cnos.cds/skills/cds/CDS.md §"Selection function"` → assessment-commitment default:

Cycle 10 γ-closeout committed one immediate output: α/SKILL.md process patch (peer-enumeration
derived-fact carriers + runbook AC oracle operability). That patch landed via ε=δ pass in
STACK.md §CDD dispatch (2026-06-17). `.cdd/iterations/INDEX.md` cycle-10 row confirms:
"MCAs committed: 1 (bundled — patched in STACK.md §CDD dispatch, 2026-06-17)". Committed
output delivered.

With the committed patch landed, selection passes to open backlog. gh #1 is the only open
issue and satisfies all scope and dependency preconditions.

Rejected alternatives: none — single open issue in queue.

## Peer Enumeration (γ/SKILL.md §2.2a)

**Directory listings:**
- `apps/web/src/app/projects/` — 4 files: `projects-list.component.ts`,
  `projects-list.component.spec.ts`, `project-issues.component.ts`,
  `project-issues.component.spec.ts`
- `apps/web/src/app/issues/` — 2 files: `issue-detail.component.ts`,
  `issue-detail.component.spec.ts`

**`grep -r "routerLink" apps/web/src/app/` result:** 1 match only —
`issue-detail.component.ts:54` (back-link to `/projects/:project_id/issues`). Issue gap claim
("single routerLink at issue-detail:54; app navigable only by manual URL entry") is
**empirically correct**.

**AC5 empirical check — raw enum strings in template display:**
- `project-issues.component.ts:42` → `{{ issue.status }}` — raw enum in display
- `project-issues.component.ts:47` → `{{ issue.priority }}` — raw enum in display
- `project-issues.component.ts:143` → `readonly priorities = ['low', 'medium', 'high',
  'critical']` — in TS class body (form select values; distinct from display concern)

Raw enum strings confirmed in template display bindings. AC5 target is real.

**AC6 empirical check — page-level error replacement:**
- `projects-list.component.ts:35-36` → `@else if (error)` replaces entire view on load error
- `project-issues.component.ts:36-37` → same pattern; additionally `submitCreate()` at line 189
  sets `this.error` which feeds the same top-level `@else if (error)` block — a submit failure
  replaces the issues table with a bare error message

Both components confirmed anti-pattern for AC6.

**AC2 oracle gap identified:** The issue states confirmation via
`grep -r "routerLink" apps/web/src/app/issues/`. `ProjectIssuesComponent` lives at
`apps/web/src/app/projects/project-issues.component.ts` — in the `projects/` directory, not
`issues/`. Running the oracle on `issues/` will match the pre-existing back-link in
`issue-detail.component.ts:54`, not the new AC2 routerLink. **Correct oracle:**
`grep -r "routerLink" apps/web/src/app/projects/project-issues.component.ts`.

**AC5 oracle gap identified:** The issue oracle `grep -r "in_progress\|critical"
apps/web/src/app/` returning zero results would also match the `priorities` array in TS class
bodies even after a correct label-map implementation. Correct scope: zero raw enum strings in
**template display expressions** only (`{{ ... }}`). A label-map approach in the component
class resolves this; the priorities select can retain raw strings as internal values.

## Surfaces α Will Touch

| File | Expected changes |
|------|-----------------|
| `apps/web/src/app/projects/projects-list.component.ts` | Add `RouterLink` import + `imports[]` entry; add `[routerLink]` to project row; add empty-state `@if (projects.length === 0)`; fix load-error to be inline (not replace entire view) |
| `apps/web/src/app/projects/project-issues.component.ts` | Add `RouterLink` import + `imports[]` entry; add `[routerLink]` to issue row; add empty-state `@if (issues.length === 0)`; add status/priority label maps; replace `{{ issue.status }}` / `{{ issue.priority }}` with label lookups; add separate `createError` field; fix submit error to render inline under form |
| `apps/web/src/app/projects/projects-list.component.spec.ts` | Add tests: routerLink attribute, empty-state text |
| `apps/web/src/app/projects/project-issues.component.spec.ts` | Add tests: routerLink attribute, empty-state text, label rendering, inline create error |

No changes to: `apps/api/`, `apps/web/src/app/issues/`, `app.routes.ts`, `api.service.ts`.

## AC Oracle Table (corrected)

| AC | Correct oracle | Notes |
|----|---------------|-------|
| AC1 | `grep -r "routerLink" apps/web/src/app/projects/projects-list.component.ts` — matches `[routerLink]="['/projects', project.id, 'issues']"` | Issue oracle correct |
| AC2 | `grep -r "routerLink" apps/web/src/app/projects/project-issues.component.ts` — matches `[routerLink]="['/issues', issue.id]"` | **Issue oracle path wrong** — see gap above |
| AC3 | Template inspection: `projects.length === 0` branch shows "No projects yet." | Issue oracle correct |
| AC4 | Template inspection: `issues.length === 0` branch shows "No issues yet." | Issue oracle correct |
| AC5 | Template inspection: display expressions use label map lookups; no raw `in_progress`/`critical` in `{{ ... }}` bindings | **Issue oracle would match TS class body** — see gap above |
| AC6 | Template inspection: form submit error inside form section; load error not replacing whole view | Issue oracle correct |
| AC7 | Manual runbook — operator executes; β notes it cannot execute | N/A for code review |

## Expected Diff Scope

- ~30–50 lines changed/added in `projects-list.component.ts`
- ~40–60 lines changed/added in `project-issues.component.ts`
- ~15–25 new test lines per spec file
- Total estimated: ~100–160 lines across 4 files
- No new packages; no API changes; no route changes
