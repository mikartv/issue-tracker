# α — Cycle 4 dispatch

Issue: Read `.cdd/issues/4/ISSUE.md` from repo root (full contract: gap, AC, non-goals)  
Branch: `cycle/4`  
Scaffold: `.cdd/unreleased/4/gamma-scaffold.md`

## Role

You are α. Implement Issue #4 — Issues API + status rules — on branch `cycle/4`.

Do not implement before reading. Do not commit without a `self-coherence.md` entry.

## Load order

1. `.cdd/issues/4/ISSUE.md` — gap, ACs, non-goals
2. `.cdd/unreleased/4/gamma-scaffold.md` — surfaces, oracle approach, diff scope
3. `.cdd/SCOPE.md` — status chain, archived-project constraint, data model
4. `.cdd/STACK.md` — pinned stack, conventions, error shape
5. `.cdd/PROJECT.md` — repo map, current test count, entry points
6. `apps/api/src/migrations/20260610000000-InitialSchema.ts` — confirm `issue` table columns before writing DTOs

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (`strict: true`) |
| CLI integration target | N/A — standalone web API, not a `cn` subcommand |
| Package scoping | `apps/api/src/issues/` (all new files); `apps/api/src/app.module.ts` (register IssuesModule); root workspace test scripts (`npm run test:api`) |
| Existing-binary disposition | N/A — no existing `issues` HTTP module; `issue` table exists from cycle 2 migration; do not run `migration:generate` or alter DB schema |
| Runtime dependencies | Node 20 LTS, NestJS 10, TypeORM (Issue entity pre-exists), PostgreSQL 16; class-validator + class-transformer for DTOs; `@nestjs/swagger` for Swagger decorators |
| JSON/wire contract preservation | Global prefix `/api/v1`; error shape `{ statusCode, message, error }`; UUID string IDs; `POST /api/v1/issues/:id/status` request body `{ "status": "<value>" }`; status enum `open \| in_progress \| done \| closed`; priority enum `low \| medium \| high \| critical`; forward-only status transition enforced at service layer |
| Backward-compat invariant | Projects API (`/api/v1/projects/*`) routes and response shapes unchanged; `issue` table DB columns (`id`, `project_id`, `title`, `description`, `status`, `priority`, `assignee`, `created_at`, `updated_at`) unchanged |

## Sequence

1. Read the five load-order files listed above
2. Write `.cdd/unreleased/4/self-coherence.md` (gap summary, AC coverage plan, known constraints, debt, commit SHA TBD) and commit it — this is your first commit
3. Build `apps/api/src/issues/` module following the cycle 3 projects module structure:
   - `issues.module.ts` (TypeOrmModule.forFeature([Issue entity]))
   - `issues.controller.ts` (5 route handlers; @ApiTags('issues'); @ApiResponse decorators)
   - `issues.service.ts` (CRUD + status transition logic)
   - `dto/create-issue.dto.ts` (title required; description/priority/assignee optional)
   - `dto/update-issue.dto.ts` (title/description/priority/assignee — all optional; no status field)
   - `dto/update-issue-status.dto.ts` (status: IsEnum; IsNotEmpty)
4. Register `IssuesModule` in `apps/api/src/app.module.ts`
5. Write `apps/api/src/issues/issues.service.spec.ts` (unit; mock TypeORM repository)
6. Write `apps/api/src/issues/issues.e2e.spec.ts` (supertest against real Postgres; covers full status chain + illegal transitions + archived-project create)
7. Run `npm run test:api` — exit 0 required
8. Update `.cdd/PROJECT.md` with cycle 4 decisions block
9. Finalize `self-coherence.md`: fill commit SHA, exact test counts per file, AC evidence map, `## Review-readiness` section

## Routes to implement

```
POST   /api/v1/projects/:projectId/issues    → 201 | 400 | 409 (archived project)
GET    /api/v1/projects/:projectId/issues    → 200 array
GET    /api/v1/issues/:id                    → 200 | 404
PATCH  /api/v1/issues/:id                    → 200 | 400 | 404
POST   /api/v1/issues/:id/status             → 200 | 400 | 404
```

## Status transition logic

```
forward chain: open → in_progress → done → closed
skip (e.g. open → done): 400
revert (e.g. in_progress → open): 400
same-status call: 400
transition from closed: 400 (terminal)
```

Implement as a constant transition map checked in the service; do not compute order numerically from an enum index.

## Non-goals (do not implement)

- Comments (cycle 5)
- Bulk update, search, filter, pagination
- Any Angular / frontend changes
- New TypeORM migration (issue table exists)

## Honest-claim reminder

Every assertion in `self-coherence.md` must match the code exactly: test case counts per file, route handlers, DTO fields. Count test cases by running `grep -c "it(" <file>` before writing. Do not write from memory.
