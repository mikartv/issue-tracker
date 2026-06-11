# Self-coherence — Cycle 3

## §Gap

**Issue:** Issue 3 — Projects API  
**Mode:** design-and-build, typical (7 ACs)  
**Branch:** cycle/3  

**Gap statement:** Cycle 2 delivered the DB persistence layer (Project entity + migration). Clients cannot manage projects. This cycle closes the gap by adding the full Projects HTTP module on top of the existing entity: four routes (create, list, rename, archive), validation, Swagger documentation, and tests (unit + e2e).

**Additive:** yes — no existing project routes; no existing `apps/api/src/projects/` directory. This cycle is purely additive to the cycle 2 persistence layer.

**Out of scope (this cycle):** issues/comments endpoints, pagination, delete project, ORM relation decorators (D-CY2-4 stays deferred).

---

## §Design

**Plan:** not required — implementation sequencing is straightforward; all four routes are additive with no cross-module dependencies.

### Decision 1 — Archive response shape

`POST /api/v1/projects/:id/archive` returns 200 + the updated project body (same shape as POST/PATCH responses). Rationale: consistent with rename response; avoids a second GET for the caller to observe the new state. Implemented via `@HttpCode(200)` on the `@Post(':id/archive')` handler.

### Decision 2 — Swagger coverage strategy

`@ApiTags('projects')` on the controller class. Explicit `@ApiResponse` decorators per handler for every status code (201/200/400/404/409). Auto-inferred responses are insufficient for AC6 because they do not document error status codes. `@ApiBody` on POST and PATCH handlers to document the request body shape.

### Decision 3 — UpdateProjectDto is not PartialType

The `name` field is required in `UpdateProjectDto` (same validators as `CreateProjectDto`). `PartialType` is not used — only renaming is in scope (ISSUE.md AC3). A partial update where `name` is omitted has no defined meaning in this cycle.

### Decision 4 — Archive endpoint uses no request body

`POST /api/v1/projects/:id/archive` accepts no body. The action is fully identified by the route. No DTO is needed.

### Decision 5 — Service method names

| Route | Service method | Rationale |
|-------|----------------|-----------|
| POST /projects | `create(dto)` | standard NestJS convention |
| GET /projects | `findAll()` | standard NestJS convention |
| PATCH /projects/:id | `rename(id, dto)` | expresses the domain intent precisely |
| POST /projects/:id/archive | `archive(id)` | expresses the domain intent precisely |

### Decision 6 — E2e test isolation

The e2e test creates a standalone NestJS app with only `ProjectsModule` and a direct TypeORM connection. The test uses `beforeAll` to run migrations (idempotent via the migrations table) and `afterEach` to delete all rows in the `project` table. This ensures test isolation without undoing the migration schema between cases.
