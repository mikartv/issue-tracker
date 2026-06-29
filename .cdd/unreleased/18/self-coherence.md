# Self-Coherence — Cycle 18

## §Friction Log

- Database was not running at test time; `docker compose up -d db` required before e2e tests pass. This is existing project infrastructure behavior, not introduced by this cycle.
- The `npm test -w apps/api` command requires `DATABASE_URL` env var set (matches CI behavior per `.github/workflows/ci.yml`).
- No friction in the implementation itself; all 9 files matched the dispatch contract exactly.

## §Status

REVIEW_READY. `npm test -w apps/api` (with DATABASE_URL): 9 suites, 76 tests — all pass.

## §Known Gaps

Explicit non-goals per issue #9:
- No frontend board changes (R5b).
- No transition audit trail or status workflow metadata.
- No auth/permission checks on transitions.
- `POST /issues/:id/status` route shape unchanged.

Residual gaps: none identified.

## §ACs

- **AC1: Any valid status transition is accepted** — PASS. `TRANSITIONS` constant removed. `updateStatus` persists any `IssueStatus` target regardless of current status. E2e tests confirm skip (open→done) and backward (done→in_progress) both return 200.
- **AC2: Invalid status value still rejected** — PASS. `UpdateIssueStatusDto` with `@IsEnum(IssueStatus)` unchanged. E2e test `'400 — invalid status value'` passes for `status: 'invalid_status'`.
- **AC3: GET /projects/:id returns one project** — PASS. `ProjectsService.findOne(id)` added with 404 guard. `GET /projects/:id` route added to `ProjectsController`. E2e tests confirm 200 for known id and 404 for unknown UUID.
- **AC4: Specs updated, suite green** — PASS. All 76 tests pass (`npm test -w apps/api` with DATABASE_URL). No spec asserts "Cannot transition" between valid statuses.

## §Mode

Mode: design-and-build. 4 ACs. Backend-only change in `apps/api/` only. No new DB migrations, no frontend changes. Established NestJS/TypeORM/Jest patterns throughout.

## §Gap

**What existed:** `apps/api/src/issues/issues.service.ts` contained a `TRANSITIONS` constant enforcing a strict forward-only workflow (`open → in_progress → done → closed`). The `updateStatus` method threw `BadRequestException` for any transition that skipped a step, reversed, or stayed in the same status. There was no `GET /projects/:id` endpoint; only POST `/`, GET `/`, PATCH `/:id`, and POST `/:id/archive` existed in `ProjectsController`.

**What changes:** The `TRANSITIONS` constant and the transition guard are removed. `updateStatus` now accepts any transition to a valid `IssueStatus` value, relying solely on DTO `@IsEnum` validation for 400 on invalid status values. `ProjectsService.findOne(id)` is added (404 for missing), and `GET /projects/:id` is wired into `ProjectsController` with Swagger 200/404 annotations. Specs updated throughout: 4 BadRequestException tests removed, 2 free-transition tests added in unit and e2e layers. `SCOPE.md` updated to reflect the new constraint.
