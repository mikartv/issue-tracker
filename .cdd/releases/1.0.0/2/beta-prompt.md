# β Dispatch — Cycle 2

```
You are β. Project: issue-tracker.
Load ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md and follow its load order.
Issue: Read .cdd/issues/2/ISSUE.md from repo root (full contract: gap, AC, non-goals).
Branch: cycle/2
```

## Context for δ

- Allowed tools: `--allowedTools "Read,Write,Bash"`
- Git identity for β commits: `Beta <beta@issue-tracker.cdd.cnos>`
- β dispatched after α signals review-readiness: look for the review-readiness section at the end of `.cdd/unreleased/2/self-coherence.md` on `origin/cycle/2`.
- β writes review passes incrementally to `.cdd/unreleased/2/beta-review.md`, committing + pushing after each pass.
- On APPROVE: β merges `cycle/2` into `main`, then writes `.cdd/unreleased/2/beta-closeout.md`.
- Working directory: repo root of `issue-tracker` (`/home/mihail/Projects/usurobor/issue-tracker`).
- HUB (skill source): `../cn-sigma` relative to repo root (or `/home/mihail/Projects/usurobor/cn-sigma`).

## What β must review

α adds the full TypeORM persistence layer. The diff will contain:

**New files (expected 10–20 total):**
- `apps/api/src/entities/project.entity.ts` — `Project`: id (UUID pk), name (varchar 255), archived (boolean default false), created_at, updated_at (timestamptz)
- `apps/api/src/entities/issue.entity.ts` — `Issue`: id (UUID pk), project_id (FK → Project), title (varchar 255), description (text nullable), status (varchar enum, default open), priority (varchar enum, default medium), assignee (varchar 255 nullable), created_at, updated_at (timestamptz)
- `apps/api/src/entities/comment.entity.ts` — `Comment`: id (UUID pk), issue_id (FK → Issue), author (varchar 255), body (text), created_at (timestamptz); updated_at per α's documented design decision
- `apps/api/src/data-source.ts` — TypeORM DataSource config for CLI; synchronize: false
- `apps/api/src/migrations/<timestamp>-InitialSchema.ts` — initial migration creating all three tables
- Integration test file (path per α's design decision)

**Modified files:**
- `apps/api/src/app.module.ts` — TypeOrmModule.forRoot added; synchronize: false
- `apps/api/package.json` — new deps (typeorm@^0.3, @nestjs/typeorm@^10, pg@^8); new scripts (migration:run, migration:revert)
- `apps/api/tsconfig.json` — possibly (emitDecoratorMetadata: true, experimentalDecorators: true)
- `.cdd/PROJECT.md` — Last verified date updated; Migrations entry filled
- `package-lock.json` — updated

## AC verification oracles

| AC | Oracle | Pass condition |
|----|--------|---------------|
| AC1 | Read `apps/api/src/entities/*.entity.ts`; cross-ref every column against `.cdd/SCOPE.md` §Data model (v1) | Three entity files; id=UUID v4 pk, created_at/updated_at=timestamptz; entity-specific columns match SCOPE field names, types, and constraints exactly |
| AC2 | Read `project.entity.ts` for `archived`; read `issue.entity.ts` for project FK; read `comment.entity.ts` for issue FK | `Project.archived` boolean column with default false; `Issue` has `project_id` FK to `Project.id`; `Comment` has `issue_id` FK to `Issue.id` |
| AC3 | `ls apps/api/src/migrations/`; `grep -r synchronize apps/api/src/` | ≥1 migration file; every `synchronize` occurrence is `false`; no `synchronize: true` anywhere in src |
| AC4 | `cat apps/api/package.json \| jq '.scripts["migration:run"], .scripts["migration:revert"]'` | Both keys present with non-null TypeORM CLI invocations referencing the data-source path |
| AC5 | Read integration test file; `npm run test:api` (with DATABASE_URL set) | Test creates real DataSource, runs migrations, inserts one fixture row per entity, reads back and asserts all fields; exit 0 |
| AC6 | `rg '@Controller\|@Get\|@Post\|@Put\|@Patch\|@Delete' apps/api/src/ -l` | Only `health.controller.ts`; no project/issue/comment controller files exist |

## Implementation contract verification (binding — non-conformance → REQUEST CHANGES, severity D, class `implementation-contract`)

| Axis | Verification |
|------|-------------|
| Language | All new `.ts` source files pass TypeScript strict; `emitDecoratorMetadata: true` and `experimentalDecorators: true` present in tsconfig where required |
| CLI integration target | No new binary entrypoints; web app only |
| Package scoping | Entity files only in `apps/api/src/entities/`; migration files only in `apps/api/src/migrations/`; no business controllers or services added |
| Existing-binary disposition | Health module, UserEmailMiddleware, and cycle-1 test files are unmodified (tsconfig additions are the only permitted exception) |
| Runtime dependencies | `typeorm@^0.3.x`, `@nestjs/typeorm@^10.x`, `pg@^8.x` in `apps/api/package.json` dependencies; no other new runtime deps |
| Wire contract | `GET /api/v1/health` response unchanged; no new HTTP routes added |
| Backward-compat | N/A |

**Critical checks β must run:**
1. `grep -r "synchronize" apps/api/src/` — any `true` value is D-severity (`implementation-contract`)
2. Diff each entity column against `.cdd/SCOPE.md` §Data model (v1) field by field — any divergence (wrong name, wrong type, missing constraint, wrong default) is a finding
3. Confirm `data-source.ts` does not set `synchronize: true` and that both migration scripts in package.json reference it

## Release note

After APPROVE and merge:
- β does NOT run `scripts/release.sh`, bump VERSION, or push any tag — δ owns the release boundary.
- β writes `.cdd/unreleased/2/beta-closeout.md` (review summary, implementation assessment, process observations, debt noted).
- Merge command: `git fetch origin main && git checkout main && git merge --no-ff cycle/2 -m "feat: typeorm entities + migrations (closes issue 2)"`.

## Dispatch note

δ: dispatch β with `claude -p` in the `issue-tracker` repo root after α's review-readiness signal appears on `origin/cycle/2`. If a local Postgres instance is available, β should run `npm run test:api` with `DATABASE_URL` set to independently verify AC5. If Postgres is not available locally, β verifies AC5 via code inspection and α's self-coherence test output, noting the limitation in beta-review.md.
