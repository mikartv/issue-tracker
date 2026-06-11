# α Dispatch — Cycle 3

```
You are α. Project: issue-tracker.
Load ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md and follow its load order.
Issue: Read .cdd/issues/3/ISSUE.md from repo root (full contract: gap, AC, non-goals).
Branch: cycle/3
Tier 3 skills:
  - ../cn-sigma/.cn/vendor/packages/cnos.core/skills/write/SKILL.md
  - ../cn-sigma/.cn/vendor/packages/cnos.eng/skills/eng/typescript/SKILL.md
  - ../cn-sigma/.cn/vendor/packages/cnos.eng/skills/eng/test/SKILL.md
```

## Implementation contract (pinned by δ; α MUST NOT improvise)

| Axis | Pinned value |
|------|--------------|
| Language | TypeScript strict (`"strict": true`); all new files must pass the existing `apps/api/tsconfig.json`; NestJS decorators (`@Controller`, `@Get`, `@Post`, `@Patch`, `@Body`, `@Param`, `@HttpCode`, `@NotFoundException`, `@ConflictException`) + Swagger decorators (`@ApiTags`, `@ApiResponse`, `@ApiBody`, `@ApiProperty`) |
| CLI integration target | N/A — standalone web app; no `cn` subcommand |
| Package scoping | New module files in `apps/api/src/projects/` only (subdirectory `dto/` allowed); modify `apps/api/src/app.module.ts` to import `ProjectsModule`; no new files outside `apps/api/src/projects/` except this one `app.module.ts` modification |
| Existing-binary disposition | Do NOT modify: `health/`, `middleware/`, `entities/` (D-CY2-4 stays deferred — `project.entity.ts` has all needed columns already), `migrations/`, `data-source.ts`, `main.ts`, or any cycle-1/2 test files |
| Runtime dependencies | No new runtime deps; `class-validator`, `class-transformer`, `@nestjs/swagger`, `typeorm`, `@nestjs/typeorm`, `pg` already installed from cycles 1–2 |
| JSON/wire contract preservation | `/api/v1` prefix (global, already in `main.ts`); error shape: `{ "statusCode": N, "message": "...", "error": "..." }` per `.cdd/STACK.md §Error response shape`; UUID string IDs; timestamps as UTC ISO-8601; `GET /api/v1/health` unchanged |
| Backward-compat invariant | N/A — additive; no existing project routes exist |

## Context for δ

- Allowed tools: `--allowedTools "Read,Write,Bash"`
- Git identity for α commits: `Alpha <alpha@issue-tracker.cdd.cnos>`
- Mode: design-and-build, typical (7 ACs)
- Branch: `cycle/3` — already exists on origin; γ created it. α does NOT create the branch.
  - Run: `git fetch origin cycle/3 && git switch cycle/3`
- Working directory: repo root of `issue-tracker` (`/home/mihail/Projects/usurobor/issue-tracker`).
- HUB (skill source): `../cn-sigma` relative to repo root (or `/home/mihail/Projects/usurobor/cn-sigma`).
- `.cdd/unreleased/3/gamma-scaffold.md` is already on `origin/cycle/3` — α does NOT create or modify it.
- Write `.cdd/unreleased/3/self-coherence.md` incrementally: one section per commit+push (`§Gap`, `§Design`, `§Skills`, `§ACs`, `§Self-check`, `§Debt`, `§CDD Trace`). Do NOT batch all sections into one commit — session timeout will discard partial work.
- On review-readiness: append the review-readiness section to `.cdd/unreleased/3/self-coherence.md` as a final separate commit+push.
- Test database: `DATABASE_URL=postgresql://issue_tracker:issue_tracker@localhost:5432/issue_tracker` — matches CI (Postgres service container) and local `docker compose up -d db`. AC7 e2e tests MUST use this real database; no mocking or in-memory substitution for e2e tests.

## Key source-of-truth files α must read before implementing

1. `.cdd/issues/3/ISSUE.md` — issue contract (gap, ACs, non-goals)
2. `.cdd/SCOPE.md` — `§Active design constraints` (archive rules, error semantics, auth stub)
3. `.cdd/STACK.md` — `§Error response shape`, `§Validation`, `§Swagger` path, `§Enum storage`
4. `.cdd/PROJECT.md` — verified repo map; update `Last verified` date, API entry point row, and test counts after implementing

## Route contract (all 4 routes required exactly)

| Method | Path | Request body | Success | Error cases |
|--------|------|--------------|---------|-------------|
| `POST` | `/api/v1/projects` | `{ "name": string }` | 201 + project object | 400 (validation) |
| `GET` | `/api/v1/projects` | — | 200 + project array | — |
| `PATCH` | `/api/v1/projects/:id` | `{ "name": string }` | 200 + updated project | 400 (validation), 404 (not found), 409 (archived) |
| `POST` | `/api/v1/projects/:id/archive` | — | 200 + archived project | 404 (not found), 409 (already archived) |

## Design constraints α must enforce

- **ValidationPipe is already global** (`main.ts` lines 12–16); add class-validator decorators to DTOs only — no per-controller `@UsePipes` needed
- **CreateProjectDto**: `name` field with `@IsString()`, `@IsNotEmpty()`, `@MaxLength(255)`, `@ApiProperty()`
- **UpdateProjectDto** (rename only): same validators as create; `name` is required — do NOT use `PartialType`; only renaming is in scope per ISSUE.md AC3
- **Archive endpoint**: `POST /api/v1/projects/:id/archive` with no request body; responds 200 with the updated project entity; use `@HttpCode(200)` explicitly since `@Post` defaults to 201
- **Exceptions**: `NotFoundException` (NestJS built-in → 404) and `ConflictException` (NestJS built-in → 409); do NOT invent custom exception classes
- **Swagger**: `@ApiTags('projects')` on the controller class; explicit `@ApiResponse({ status: N, description: '...' })` for each status code on each handler; all 4 routes must appear in `/api/docs-json`
- **D-CY2-4 stays deferred**: do NOT add `@OneToMany`/`@ManyToOne` decorators to `project.entity.ts`; the Projects API does not require relation loading

## Test requirements (AC7)

**Unit test** (`projects.service.spec.ts`):
- Mock the TypeORM `Repository<Project>` via `getRepositoryToken(Project)` or Jest manual mock
- Cover: `create`, `findAll`, `rename` (success + 404 + 409-archived), `archive` (success + 404 + 409-already-archived)

**E2e test** (`projects.e2e-spec.ts` or similar path under `apps/api/src/`):
- Use supertest against a live Nest app wired to a test Postgres (`DATABASE_URL`)
- Each test case creates its own fixture data; clean up after suite
- Cover: POST creates project (201), GET lists projects, PATCH renames (200), PATCH on archived → 409, POST archive (200), POST archive again → 409, POST on unknown id → 404

Both test files must be discoverable by `npm run test:api` (Jest discovers files matching `*.spec.ts` / `*.e2e-spec.ts` under `apps/api/src/`). Run `npm run test:api` with `DATABASE_URL` set before signaling review-readiness; exit 0 is required.

## Carry-forward debt (awareness only — do NOT fix in this cycle)

- D-CY2-1: `as unknown as X` cast in `user-email.middleware.spec.ts`
- D-CY2-2: No GitHub remote; cloud CI not executed (if supertest deprecation warning appears, log as D-CY3-x in `§Debt`)
- D-CY2-3: `supertest@6.3.4` deprecation warning — note in `§Debt` if it appears during e2e testing
- D-CY2-4: No `@ManyToOne`/`@OneToMany` decorators — explicitly deferred; do NOT touch here
- D-CY2-7: α pre-review gate improvement — apply stricter per-`§Design`-claim code-side verification at review-readiness gate time (each `§Design` behavioral claim must name the code artifact that implements it)

## Dispatch note

δ: before routing, confirm `gamma-scaffold.md` exists on the branch:
```bash
git ls-tree -r --name-only origin/cycle/3 .cdd/unreleased/3/gamma-scaffold.md
```
Invoke α with `claude -p` in the `issue-tracker` repo root. α must run `npm run test:api` with `DATABASE_URL` set locally to verify AC7 before signaling review-readiness.
