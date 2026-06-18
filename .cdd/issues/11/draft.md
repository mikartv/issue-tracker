## Gap

Three Angular views exist (`/projects`, `/projects/:id/issues`, `/issues/:id`) but are not connected by `routerLink`. Application is navigable only by manual URL entry. Single routerLink confirmed: `issue-detail.component.ts:54` (back-link only).

## Mode

design-and-build

## Acceptance Criteria

- **AC1** `ProjectsListComponent`: every project row has `[routerLink]="['/projects', project.id, 'issues']"`. Confirmed by `grep -r "routerLink" apps/web/src/app/projects/`.
- **AC2** `ProjectIssuesComponent`: every issue row has `[routerLink]="['/issues', issue.id]"`. Confirmed by `grep -r "routerLink" apps/web/src/app/issues/`.
- **AC3** `ProjectsListComponent`: empty-state shown when `projects.length === 0` — text "No projects yet." visible in rendered HTML.
- **AC4** `ProjectIssuesComponent`: empty-state shown when `issues.length === 0` — text "No issues yet."
- **AC5** Status and priority displayed as human-readable labels (`In Progress`, `Critical`) — not raw enum strings. Confirmed by `grep -r "in_progress\|critical" apps/web/src/app/` returning zero results in template HTML.
- **AC6** Form submit errors shown inline (under the form), not as page-level `@else if (error)` that replaces the entire view.
- **AC7 (runbook gate)**: Open `/projects` → click first project row → browser navigates to `/projects/:id/issues` → click first issue row → browser navigates to `/issues/:id`. Each navigation step confirmed manually.

## Non-goals

- No new API endpoints.
- No authentication changes.
- No pagination or search.
- No Angular Material redesign — existing Material components stay as-is.
- No new tests beyond what AC1–AC7 require.

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript strict |
| Surfaces | `apps/web/src/app/` only |
| Runtime deps | Angular 17 RouterLink (already available), no new packages |
| Wire contract | unchanged — no API changes |
| Backward compat | N/A |
| Branch | `cycle/11` |
