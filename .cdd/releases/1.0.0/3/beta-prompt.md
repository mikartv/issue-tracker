# β Dispatch — Cycle 3

```
You are β. Project: issue-tracker.
Load ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md and follow its load order.
Issue: Read .cdd/issues/3/ISSUE.md from repo root (full contract: gap, AC, non-goals).
Branch: cycle/3
```

## Context for δ

- Allowed tools: `--allowedTools "Read,Write,Bash"`
- Git identity for β commits: `Beta <beta@issue-tracker.cdd.cnos>`
- β dispatched after α signals review-readiness: look for the review-readiness section at the end of `.cdd/unreleased/3/self-coherence.md` on `origin/cycle/3`.
- β writes review passes incrementally to `.cdd/unreleased/3/beta-review.md`, committing + pushing after each pass.
- On APPROVE: β merges `cycle/3` into `main`, then writes `.cdd/unreleased/3/beta-closeout.md`.
- Working directory: repo root of `issue-tracker` (`/home/mihail/Projects/usurobor/issue-tracker`).
- HUB (skill source): `../cn-sigma` relative to repo root (or `/home/mihail/Projects/usurobor/cn-sigma`).

## What β must review

α adds the full Projects HTTP module on top of the cycle-2 persistence layer. The diff will contain:

**New files (expected 7–10 total):**
- `apps/api/src/projects/projects.module.ts` — NestJS module; imports `TypeOrmModule.forFeature([Project])`; provides `ProjectsService`
- `apps/api/src/projects/projects.controller.ts` — 4 routes: `POST /projects`, `GET /projects`, `PATCH /projects/:id`, `POST /projects/:id/archive`; `@ApiTags('projects')` + `@ApiResponse` decorators per handler
- `apps/api/src/projects/projects.service.ts` — CRUD + archive logic; uses injected `Repository<Project>`; throws `NotFoundException` / `ConflictException` per SCOPE archive semantics
- `apps/api/src/projects/dto/create-project.dto.ts` — `name: string`; class-validator decorators
- `apps/api/src/projects/dto/update-project.dto.ts` — `name: string`; class-validator decorators (rename only; no `PartialType`)
- `apps/api/src/projects/projects.service.spec.ts` — unit test; mocked `Repository<Project>`
- `apps/api/src/projects/projects.e2e-spec.ts` (or similar) — supertest + test Postgres

**Modified files:**
- `apps/api/src/app.module.ts` — `ProjectsModule` added to imports array
- `.cdd/PROJECT.md` — Last verified date updated; API entry point row added; test counts updated

## AC verification oracles

| AC | Oracle | Pass condition |
|----|--------|----------------|
| AC1 | Read controller + e2e test; run `npm run test:api` (with `DATABASE_URL`) | 201; response body has `id` (UUID string), `name`, `archived: false`, `created_at` (ISO-8601), `updated_at` (ISO-8601) |
| AC2 | Read e2e test; verify GET test covers archived projects | 200; array; both active and archived projects included; `archived` flag accurate |
| AC3 | Read service for rename logic; read e2e test for 404/409 cases | Success path 200 + renamed body; `NotFoundException` on unknown id; `ConflictException` on archived project |
| AC4 | Read service for archive logic; read e2e test for 409/404 cases | Archive sets `archived: true`; 200 + updated body; 409 on repeat archive; 404 on unknown id |
| AC5 | Read DTO files for class-validator decorators; run `npm run test:api` | 400 on missing/empty `name`; body matches `{ "statusCode": 400, "message": ..., "error": "Bad Request" }` |
| AC6 | Read controller for `@ApiTags` + `@ApiResponse` decorators; or `GET /api/docs-json` at runtime | All 4 routes present in Swagger; all relevant status codes (201, 200, 400, 404, 409) documented |
| AC7 | `npm run test:api` with `DATABASE_URL` set | Exit 0; ≥1 service spec + ≥1 e2e spec; happy path + archived-rename-rejection + archive-again-rejection test cases present |

## Implementation contract verification (binding — non-conformance → REQUEST CHANGES, severity D, class `implementation-contract`)

| Axis | Verification |
|------|-------------|
| Language | All new `.ts` files pass TypeScript strict; class-validator decorators on both DTOs; no implicit `any` |
| CLI integration target | No new binary entrypoints |
| Package scoping | All new files inside `apps/api/src/projects/`; only `apps/api/src/app.module.ts` modified outside that dir; no new directories outside `apps/api/src/` |
| Existing-binary disposition | `health/`, `middleware/`, `entities/` (including `project.entity.ts` — must be unmodified from cycle-2 merge), `migrations/`, `data-source.ts`, `main.ts`, and all cycle-1/2 test files are unchanged |
| Runtime dependencies | No new entries in `apps/api/package.json` `dependencies` |
| Wire contract | Error shape `{ statusCode, message, error }` per STACK.md; UUID string IDs; ISO-8601 timestamps; `GET /api/v1/health` unchanged |
| Backward-compat | N/A |

**Critical checks β must run:**

1. Read both DTO files — `@IsString()`, `@IsNotEmpty()`, `@MaxLength(255)` required on `name`; absence is D-severity (`implementation-contract`)

2. Read service file — verify all 6 conditional branches:
   - rename: project not found → `NotFoundException`
   - rename: project archived → `ConflictException`
   - archive: project not found → `NotFoundException`
   - archive: already archived → `ConflictException`
   - Missing any branch is C-severity (honest-claim / behavioral gap)

3. Verify `app.module.ts` imports `ProjectsModule` — absent means all 4 routes return 404 (D-severity)

4. Verify `apps/api/src/entities/project.entity.ts` is **unmodified** from cycle-2 state — any modification is a scope violation (D-severity, `implementation-contract`)

5. Confirm no new entries in `apps/api/package.json` `dependencies`

6. Check all 4 project routes appear in Swagger — verify `@ApiTags('projects')` on controller class and explicit `@ApiResponse` decorators on each handler; missing 404/409 documentation is C-severity

## Release note

After APPROVE and merge:
- β does NOT run `scripts/release.sh`, bump VERSION, or push any tag — δ owns the release boundary.
- β writes `.cdd/unreleased/3/beta-closeout.md` (review summary, implementation assessment, process observations, debt noted).
- Merge command: `git fetch origin main && git checkout main && git merge --no-ff cycle/3 -m "feat: projects API (closes issue 3)"`.

## Dispatch note

δ: dispatch β with `claude -p` in the `issue-tracker` repo root after α's review-readiness signal appears on `origin/cycle/3`. If a local Postgres instance is available, β should run `npm run test:api` with `DATABASE_URL` set to independently verify AC7. If Postgres is not available locally, β verifies AC7 via code inspection and α's self-coherence test output, noting the limitation in `beta-review.md`.
