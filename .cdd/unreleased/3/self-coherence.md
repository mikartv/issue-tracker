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

**Unit test file:** `apps/api/src/projects/projects.service.spec.ts` — 8 cases across `create`, `findAll`, `rename` (3 cases), `archive` (3 cases). Uses `getRepositoryToken(Project)` mock.  
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
| Service mock covers all paths | `projects.service.spec.ts` 8 cases |
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

---

## §Debt

**Carried forward (unchanged from cycle 2):**

- **D-CY2-1:** `as unknown as X` cast in `user-email.middleware.spec.ts` — not touched this cycle; still present.
- **D-CY2-2:** No GitHub remote; cloud CI not executed. `npm run test:api` passes locally but cannot be verified on GitHub Actions. Pre-review gate row 10 (branch CI green) is partially met: local pass only.
- **D-CY2-3:** `supertest@6.3.4` deprecation warning — checked: `npm run test:api` output shows no deprecation warning for this cycle's test run (no warning lines in output). No new D-CY3-x entry needed.
- **D-CY2-4:** No `@ManyToOne`/`@OneToMany` decorators on entities — intentionally deferred; Projects API does not need relation loading; `project.entity.ts` unchanged.

**New debt from cycle 3:**

- **D-CY3-1:** E2e test file renamed from `projects.e2e-spec.ts` to `projects.e2e.spec.ts` — γ scaffold named `projects.e2e-spec.ts`; Jest testRegex `.*\.spec\.ts$` requires `.spec.ts` suffix; file renamed to match. Self-coherence §ACs references updated. No functional impact; naming deviates from γ scaffold by intent.
- **D-CY3-2:** `supertest` default import (`import supertest from 'supertest'`) required instead of namespace import (`import * as supertest`) due to `esModuleInterop: true` + module type. The `@types/supertest@6.x` type declaration exports the function as default. No runtime issue; type-system artifact from supertest v6 typings.

**Pre-review gate provisional close-out:** α will not be re-dispatched for close-out in this session. `alpha-closeout.md` will be written at re-dispatch time (standard path per alpha SKILL.md §2.8). This is expected; no additional debt.

---

## §CDD Trace

**Step 0 — Dispatch intake**  
Branch `cycle/3` received. Already on branch (no origin; local-only repo per D-CY2-2). Git identity set: `alpha@issue-tracker.cdd.cnos`.

**Step 1 — Issue read**  
`.cdd/issues/3/ISSUE.md` read in full. 7 ACs identified. Non-goals noted.

**Step 2 — Skill load**  
Tier 1: alpha/SKILL.md. Tier 2: write/SKILL.md. Tier 3: typescript/SKILL.md, test/SKILL.md.

**Step 3 — Source-of-truth reads**  
`.cdd/SCOPE.md`, `.cdd/STACK.md`, `.cdd/PROJECT.md`, `.cdd/unreleased/3/gamma-scaffold.md` all read before implementation.

**Step 4 — Design**  
Committed in `self-coherence.md §Design` (SHA `ea7c914`). Six decisions documented. Plan: not required (straightforward implementation sequencing).

**Step 5 — Tests + code + docs**

| SHA | Artifact |
|-----|---------|
| `4b1ced7` | `apps/api/src/projects/` (5 new files: module, controller, service, 2 DTOs); `projects.service.spec.ts`; `projects.e2e-spec.ts`; `app.module.ts` modified |
| `5c85c80` | `projects.e2e-spec.ts` → `projects.e2e.spec.ts` (Jest testRegex fix) |
| `926c274` | e2e cleanup fix: `createQueryBuilder().delete()` replaces `delete({})` |
| `4761dcf` | `.cdd/PROJECT.md` updated |

**Step 6 — All new files in diff**

| File | Status | Mentioned in |
|------|--------|-------------|
| `apps/api/src/projects/dto/create-project.dto.ts` | new | §ACs AC1/AC5 |
| `apps/api/src/projects/dto/update-project.dto.ts` | new | §ACs AC3 |
| `apps/api/src/projects/projects.controller.ts` | new | §ACs AC1–AC6; caller in AppModule |
| `apps/api/src/projects/projects.service.ts` | new | §ACs all; unit test covers all methods |
| `apps/api/src/projects/projects.module.ts` | new | §ACs AC6; caller: AppModule |
| `apps/api/src/projects/projects.service.spec.ts` | new | §ACs AC7 |
| `apps/api/src/projects/projects.e2e.spec.ts` | new | §ACs AC7 |
| `apps/api/src/app.module.ts` | modified | §Self-check caller-path trace |
| `.cdd/PROJECT.md` | modified | §Self-check |
| `.cdd/unreleased/3/self-coherence.md` | new (this file) | — |

**Caller-path trace for new modules:**
- `ProjectsModule` → imported by `AppModule` (`app.module.ts` line 5 + line 30)
- `ProjectsController`, `ProjectsService` → wired inside `ProjectsModule` (module.ts lines 8–9)
- All four routes reachable from `main.ts` via `AppModule`

**Step 7 — Pre-review gate**  
Run immediately before §Review-readiness commit. See §Review-readiness.

---

## §Review-readiness | round 1 | base SHA: af9543a | implementation SHA: 9988672 | branch CI: local pass at 2026-06-11 | ready for β

**Pre-review gate — all rows:**

| Row | Check | Result |
|-----|-------|--------|
| 1 | `cycle/3` rebased onto current `main` HEAD | ✅ merge-base = main HEAD `af9543a` (observed 2026-06-11; main did not advance during α session) |
| 2 | `self-coherence.md` carries CDD Trace through step 7 | ✅ §CDD Trace present (SHA `9988672`) |
| 3 | Tests present | ✅ unit test + e2e test files created |
| 4 | Every AC has evidence | ✅ §ACs: all 7 with evidence |
| 5 | Known debt explicit | ✅ §Debt: D-CY2-1 thru D-CY2-4 carried; D-CY3-1, D-CY3-2 new |
| 6 | Schema/shape audit | ✅ not required — no schema-bearing contract changed |
| 7 | Peer enumeration | ✅ not required — additive change; no existing route family modified |
| 8 | Harness audit | ✅ not required — no schema-bearing contract changed |
| 9 | Polyglot re-audit | ✅ TypeScript only; `npm run test:api` passes; no shell/YAML/Markdown surfaces changed |
| 10 | Branch CI green | ⚠️ local only — no GitHub remote (D-CY2-2); `npm run test:api` exits 0, 25/25 pass locally |
| 11 | Artifact enumeration matches diff | ✅ all 10 files in §CDD Trace step 6 table |
| 12 | Caller-path trace for new modules | ✅ `ProjectsModule` → `AppModule`; all routes reachable from `main.ts` |
| 13 | Test assertion count from runner | ✅ 25 tests (runner output in §ACs AC7) |
| 14 | Commit author email | ✅ all α commits: `alpha@issue-tracker.cdd.cnos` |
| 15 | γ-artifact at canonical §5.1 path | ✅ `git ls-tree cycle/3 .cdd/unreleased/3/gamma-scaffold.md` → present |

**γ-artifact:** canonical §5.1 path — `.cdd/unreleased/3/gamma-scaffold.md` present on `cycle/3`.

**Summary:** All 7 ACs met with test evidence. 25 tests pass locally. Branch is on `cycle/3`, 11 commits ahead of `main`. No open ambiguities. Ready for β review.

---

## Fix-round | round 1

**β finding addressed:** F1 — honest-claim mis-count (`projects.service.spec.ts` "7 cases" → "8 cases").

| Site | Location | Change |
|------|----------|--------|
| §ACs AC7 unit test file line | `self-coherence.md` line 157 | "7 cases" → "8 cases" |
| §Self-check claim-evidence table | `self-coherence.md` line 181 | "7 cases" → "8 cases" |

**Arithmetic:** 1 (`create`) + 1 (`findAll`) + 3 (`rename`) + 3 (`archive`) = 8. The runner total of 25 (7 pre-existing + 8 service + 10 e2e) was already correct; only the per-file description was wrong.

**Intra-doc grep:** `grep "7 cases" self-coherence.md` → 0 hits after fix. `grep "8 cases" self-coherence.md` → 2 hits (both sites updated).

**Scope:** documentation only — no code or test changes.

**Re-audit:** F1 is the sole finding. All ACs remain met; runner output (25/25) unchanged. No new surfaces affected.
