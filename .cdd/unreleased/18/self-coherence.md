# Self-Coherence — Cycle 18

## §Gap

**What existed:** `apps/api/src/issues/issues.service.ts` contained a `TRANSITIONS` constant enforcing a strict forward-only workflow (`open → in_progress → done → closed`). The `updateStatus` method threw `BadRequestException` for any transition that skipped a step, reversed, or stayed in the same status. There was no `GET /projects/:id` endpoint; only POST `/`, GET `/`, PATCH `/:id`, and POST `/:id/archive` existed in `ProjectsController`.

**What changes:** The `TRANSITIONS` constant and the transition guard are removed. `updateStatus` now accepts any transition to a valid `IssueStatus` value, relying solely on DTO `@IsEnum` validation for 400 on invalid status values. `ProjectsService.findOne(id)` is added (404 for missing), and `GET /projects/:id` is wired into `ProjectsController` with Swagger 200/404 annotations. Specs updated throughout: 4 BadRequestException tests removed, 2 free-transition tests added in unit and e2e layers. `SCOPE.md` updated to reflect the new constraint.
