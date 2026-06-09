# Issue 4 — Issues API + status rules

**Mode:** design-and-build  
**Status:** open  
**Branch:** cycle/4

## Problem

**What exists:** Projects API only (cycle 3).  
**What is expected:** Issue CRUD with forward-only status workflow and archived-project guard.  
**Where they diverge:** No issue management.

## Source of truth

- `.cdd/SCOPE.md` — status chain, priority default, assignee nullable

## Acceptance Criteria

- [ ] AC1: `POST /api/v1/projects/:projectId/issues` — creates issue with `status=open`, `priority=medium`; 409 if project archived
- [ ] AC2: `GET /api/v1/projects/:projectId/issues` — list issues for project
- [ ] AC3: `GET /api/v1/issues/:id` — single issue with project_id
- [ ] AC4: `PATCH /api/v1/issues/:id` — update title, description, priority, assignee (not status)
- [ ] AC5: `POST /api/v1/issues/:id/status` — body `{ status }`; forward-only transitions per SCOPE; invalid transition → 400
- [ ] AC6: Swagger documents issue routes
- [ ] AC7: Tests cover full status chain, illegal skip/revert, create on archived project

## Non-goals

- Comments
- Bulk update
- Search/filter

## Closure

All AC met; tests green on `cycle/4`.
