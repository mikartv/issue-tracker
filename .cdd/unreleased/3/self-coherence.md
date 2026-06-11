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

---

## §Skills

**Tier 1 (CDD lifecycle):**
- `cnos.cdd/skills/cdd/alpha/SKILL.md` — α role: artifact order, self-coherence, pre-review gate, peer enumeration rules
- CDD.md (canonical lifecycle) — loaded by reference in the α skill load order

**Tier 2 (always-applicable engineering):**
- `cnos.core/skills/write/SKILL.md` — applied to self-coherence.md: one fact per section, front-loaded points, no filler

**Tier 3 (issue-specific):**
- `cnos.eng/skills/eng/typescript/SKILL.md` — TypeScript strict mode, NestJS decorators, class-validator patterns, no `any`, explicit error policy
- `cnos.eng/skills/eng/test/SKILL.md` — invariant-first test design, negative space mandatory, e2e for lifecycle truth

**Applied constraints from loaded skills:**

| Skill | Applied constraint | Where it shows in the diff |
|-------|--------------------|---------------------------|
| typescript | strict mode; no `any`; explicit error policy via NestJS built-in exceptions | all `.ts` files under `projects/` |
| typescript | external boundary validation via class-validator (not raw `as` cast) | DTOs with `@IsString`, `@IsNotEmpty`, `@MaxLength` |
| test | negative space mandatory | service spec: 404 + 409 cases; e2e: archived-rename → 409, archive-again → 409, unknown id → 404 |
| test | invariant-first: "archived project must not be renamed or re-archived" | `rename` + `archive` service methods; e2e cases |
| test | e2e for lifecycle truth (real DB, no mock for integration path) | `projects.e2e.spec.ts` with supertest + Postgres |

---

## §ACs

Per-AC oracles run against branch HEAD (implementation SHA `4761dcf`).

Test runner output reference: `npm run test:api` — 5 suites, 25 tests, 0 failures.

### AC1 — `POST /api/v1/projects` → 201 + project object

**Evidence:** `projects.e2e.spec.ts` `201 — creates and returns a project`  
**Verified:** status 201; body has `id` (UUID string), `name: "My Project"`, `archived: false`, `created_at`, `updated_at`.  
**Implementation:** `ProjectsController.create()` → `ProjectsService.create()` → `projectRepository.save()`.  
**Status:** ✅ met

### AC2 — `GET /api/v1/projects` → 200 + array including archived flag

**Evidence:** `projects.e2e.spec.ts` `200 — lists all projects including archived`  
**Verified:** status 200; response is array; creates 1 active + 1 archived project, both appear; archived entry has `archived: true`.  
**Implementation:** `ProjectsController.findAll()` → `ProjectsService.findAll()` → `projectRepository.find()` (no filter — includes all).  
**Status:** ✅ met

### AC3 — `PATCH /api/v1/projects/:id` — rename; 404 if missing; 409 if archived

**Evidence:**
- `projects.e2e.spec.ts` `200 — renames an active project`
- `projects.e2e.spec.ts` `404 — unknown id`
- `projects.e2e.spec.ts` `409 — archived project cannot be renamed`

**Verified:** 200 + renamed body; 404 for unknown UUID; 409 for archived project.  
**Implementation:** `ProjectsController.rename()` → `ProjectsService.rename()` — throws `NotFoundException` (→ 404) or `ConflictException` (→ 409).  
**Unit test coverage:** `projects.service.spec.ts` `rename` suite — 3 cases (success, 404, 409).  
**Status:** ✅ met

### AC4 — `POST /api/v1/projects/:id/archive` — sets archived=true; 404 if missing; 409 if already archived

**Evidence:**
- `projects.e2e.spec.ts` `200 — archives an active project`
- `projects.e2e.spec.ts` `409 — already archived project`
- `projects.e2e.spec.ts` `404 — unknown id`

**Verified:** 200 + body has `archived: true`; 409 on repeat; 404 for unknown UUID.  
**Implementation:** `@Post(':id/archive')` with `@HttpCode(200)` → `ProjectsService.archive()`.  
**Unit test coverage:** `projects.service.spec.ts` `archive` suite — 3 cases (success, 404, 409).  
**Status:** ✅ met

### AC5 — Validation errors → 400 with STACK error shape

**Evidence:**
- `projects.e2e.spec.ts` `400 — rejects empty body`
- `projects.e2e.spec.ts` `400 — rejects empty name`

**Verified:** 400 returned on missing `name` and on `name: ""`.  
**Implementation:** `CreateProjectDto` with `@IsString()`, `@IsNotEmpty()`, `@MaxLength(255)`. Global `ValidationPipe` (whitelist + forbidNonWhitelisted) in `main.ts` lines 12–16. NestJS default error shape: `{ statusCode, message, error }` — no custom envelope.  
**Status:** ✅ met

### AC6 — Swagger documents all project routes

**Evidence:**  
`ProjectsController` has:
- `@ApiTags('projects')` on the class
- `@ApiBody({ type: CreateProjectDto })` on POST `/projects` and PATCH `/:id`
- `@ApiResponse({ status: 201, ... })` on POST `/projects`
- `@ApiResponse({ status: 200, ... })` on GET `/projects`, PATCH `/:id`, POST `/:id/archive`
- `@ApiResponse({ status: 400, ... })` on POST `/projects` and PATCH `/:id`
- `@ApiResponse({ status: 404, ... })` on PATCH `/:id` and POST `/:id/archive`
- `@ApiResponse({ status: 409, ... })` on PATCH `/:id` and POST `/:id/archive`

All 4 routes are registered in `ProjectsModule`, imported into `AppModule`. Swagger at `/api/docs` will include all 4 routes.  
**Status:** ✅ met

### AC7 — Unit tests (service) + e2e tests (supertest + test DB)

**Evidence:** `npm run test:api` with `DATABASE_URL=postgresql://issue_tracker:issue_tracker@localhost:5432/issue_tracker`

```
Test Suites: 5 passed, 5 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        1.981 s
```

**Unit test file:** `apps/api/src/projects/projects.service.spec.ts` — 7 cases across `create`, `findAll`, `rename` (3 cases), `archive` (3 cases). Uses `getRepositoryToken(Project)` mock.  
**E2e test file:** `apps/api/src/projects/projects.e2e.spec.ts` — 10 cases. Supertest against live NestJS app + real Postgres. Covers: POST 201, POST 400 (×2), GET 200, PATCH 200/404/409, archive 200/409/404.  
**Invariants proven:** archived project cannot be renamed (409); archived project cannot be archived again (409); unknown id returns 404.  
**Status:** ✅ met — exit 0, 25/25 pass

---

## §Self-check

**Did α push ambiguity onto β?** No. All 7 ACs have concrete test evidence. The test runner output is literal (not manually enumerated). AC6 Swagger coverage is verifiable from the decorator declarations in the controller.

**Is every claim backed by evidence in the diff?**

| Claim | Evidence artifact |
|-------|------------------|
| POST /api/v1/projects → 201 | `projects.e2e.spec.ts` line 57 |
| GET /api/v1/projects → 200 + array | `projects.e2e.spec.ts` line 88 |
| PATCH → 404 on unknown id | `projects.e2e.spec.ts` line 129 |
| PATCH → 409 on archived | `projects.e2e.spec.ts` line 136 |
| POST archive → 200 + archived: true | `projects.e2e.spec.ts` line 154 |
| POST archive → 409 on repeat | `projects.e2e.spec.ts` line 168 |
| POST archive → 404 on unknown id | `projects.e2e.spec.ts` line 183 |
| ValidationPipe → 400 | `projects.e2e.spec.ts` lines 71, 78 |
| Swagger decorators present | `projects.controller.ts` lines 15–55 |
| Service mock covers all paths | `projects.service.spec.ts` 7 cases |
| D-CY2-4 not touched | `entities/project.entity.ts` unchanged (verified: no diff to entities/) |

**Peer enumeration:** this change is additive. No existing route family was modified. No sibling modules/controllers exist for the `projects` endpoint family. Peer enumeration passes vacuously (no peers to update).

**Harness audit:** no schema-bearing contract changed; only new NestJS module + DTOs added. Existing migrations, entities, data-source.ts are unmodified. Harness audit not required.

**Intra-doc repetition:** `projects.e2e.spec.ts` filename reference appears in §Skills (corrected from `e2e-spec.ts` to `e2e.spec.ts` after rename) and §ACs. Consistent.

**Caller-path trace:** `ProjectsModule` is imported into `AppModule` (`apps/api/src/app.module.ts`); all four routes are reachable from `main.ts` via `AppModule`. Non-test caller exists: `AppModule` line 5 (`import { ProjectsModule }`) and line 30 (`ProjectsModule` in imports array).

**Implementation contract compliance:**
- Language: TypeScript strict — ✅ (all files pass tsconfig strict)
- CLI integration target: N/A — ✅ (no `cn` subcommand added)
- Package scoping: new files in `apps/api/src/projects/` only; `app.module.ts` modified — ✅
- Existing-binary disposition: health/, middleware/, entities/, migrations/, data-source.ts, main.ts untouched — ✅
- Runtime dependencies: no new deps added — ✅
- JSON/wire contract: `/api/v1` prefix (global in main.ts); error shape via NestJS defaults; UUID string IDs; UTC ISO-8601 timestamps — ✅
- Backward-compat: additive only; `GET /api/v1/health` unchanged — ✅
