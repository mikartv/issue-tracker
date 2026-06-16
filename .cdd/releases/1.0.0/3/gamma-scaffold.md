# γ Scaffold — Cycle 3

Issue: Issue 3 — Projects API
Mode: design-and-build, typical (7 ACs)
Branch: cycle/3

## Surfaces α will touch

| Surface | Path | Operation |
|---------|------|-----------|
| Projects module | `apps/api/src/projects/projects.module.ts` | create |
| Projects controller | `apps/api/src/projects/projects.controller.ts` | create |
| Projects service | `apps/api/src/projects/projects.service.ts` | create |
| DTO: create | `apps/api/src/projects/dto/create-project.dto.ts` | create |
| DTO: update (rename) | `apps/api/src/projects/dto/update-project.dto.ts` | create |
| Unit test: service | `apps/api/src/projects/projects.service.spec.ts` | create |
| E2e test | `apps/api/src/projects/projects.e2e-spec.ts` | create (supertest + test DB) |
| AppModule | `apps/api/src/app.module.ts` | modify (add ProjectsModule import) |
| Project MCP | `.cdd/PROJECT.md` | modify (Last verified, API entry point, test counts) |
| Self-coherence | `.cdd/unreleased/3/self-coherence.md` | create (α incremental) |

`main.ts` — no change needed; Swagger (`/api/docs`), `ValidationPipe` (global, `whitelist: true`, `forbidNonWhitelisted: true`), and `/api/v1` prefix are all configured from cycle 1.

`apps/api/src/entities/project.entity.ts` — no change needed; D-CY2-4 (ORM relation decorators) stays deferred; the Projects API does not need to load related issues.

## AC oracle approach

| AC | Oracle | Pass condition |
|----|--------|----------------|
| AC1 | supertest `POST /api/v1/projects` with `{"name":"Test"}` | 201; body has `id` (UUID string), `name: "Test"`, `archived: false`, `created_at` (ISO-8601), `updated_at` (ISO-8601) |
| AC2 | supertest `GET /api/v1/projects` after creating 1 active and 1 archived project | 200; array includes both; archived project has `archived: true` |
| AC3 | supertest `PATCH /api/v1/projects/:id` — (a) active project with `{"name":"Renamed"}`, (b) unknown id, (c) archived project | 200 + renamed body; 404 for unknown id; 409 for archived project |
| AC4 | supertest `POST /api/v1/projects/:id/archive` — (a) active project, (b) same project again, (c) unknown id | 200 + `archived: true` body on first call; 409 on repeat; 404 for unknown id |
| AC5 | supertest `POST /api/v1/projects` with `{}` and with `{"name":""}` | 400; body matches `{ "statusCode": 400, "message": ..., "error": "Bad Request" }` |
| AC6 | read controller for `@ApiTags('projects')` + `@ApiResponse` decorators; or `GET /api/docs-json` paths | All 4 routes (`POST /`, `GET /`, `PATCH /:id`, `POST /:id/archive`) appear in Swagger output |
| AC7 | `npm run test:api` with `DATABASE_URL` set | Exit 0; ≥1 service unit test file + ≥1 e2e test file; all test cases pass including archived-rename rejection and archive-again rejection |

## Empirical anchor (§2.2a)

No `projects` module, controller, service, or DTO exists on `origin/cycle/3` at scaffold time:

- `rg "ProjectsModule|ProjectsController|ProjectsService" apps/api/src/` → no matches confirmed; `apps/api/src/` contains only `entities/`, `health/`, `middleware/`, `migrations/`, `app.module.ts`, `data-source.ts`, `main.ts`, `migration.integration.spec.ts`
- `ls apps/api/src/projects/ 2>/dev/null` → directory absent confirmed
- `app.module.ts` imports: `HealthModule` only; no `ProjectsModule` reference confirmed (reading `apps/api/src/app.module.ts` line 4 shows only `HealthModule` in imports array)

Gap is additive: this cycle creates the full Projects HTTP module from scratch on top of the cycle 2 persistence layer.

## Design decisions α must document before first implementation commit

1. **Archive response shape**: `POST /api/v1/projects/:id/archive` on success — respond with 200 + updated project body (consistent with rename; avoids a second GET). α must state this decision in `§Design` of `self-coherence.md`.

2. **Swagger coverage strategy**: `@ApiTags('projects')` on the controller class + explicit `@ApiResponse` per-handler for 201/200/400/404/409. Auto-inferred responses are insufficient for AC6 — explicit decorators are required to document error status codes.

## Expected diff scope

Typical — 9–12 files:
- `apps/api/src/projects/` — 5 new files (module, controller, service, 2 DTOs)
- `apps/api/src/projects/projects.service.spec.ts` — unit test
- `apps/api/src/projects/projects.e2e-spec.ts` (or similar path) — e2e test
- `apps/api/src/app.module.ts` — modified
- `.cdd/PROJECT.md` — modified
- `.cdd/unreleased/3/self-coherence.md` — α incremental
