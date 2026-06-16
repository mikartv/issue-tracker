# γ Scaffold — Cycle 2

Issue: Issue 2 — DB schema + migrations  
Mode: design-and-build, typical (6 ACs)  
Branch: cycle/2  

## Surfaces α will touch

| Surface | Path | Operation |
|---------|------|-----------|
| Entity: Project | `apps/api/src/entities/project.entity.ts` | create |
| Entity: Issue | `apps/api/src/entities/issue.entity.ts` | create |
| Entity: Comment | `apps/api/src/entities/comment.entity.ts` | create |
| DataSource | `apps/api/src/data-source.ts` | create (TypeORM CLI target) |
| Initial migration | `apps/api/src/migrations/<timestamp>-InitialSchema.ts` | create |
| AppModule | `apps/api/src/app.module.ts` | modify (add TypeOrmModule.forRoot) |
| API package.json | `apps/api/package.json` | modify (add typeorm, @nestjs/typeorm, pg; add migration scripts) |
| API tsconfig | `apps/api/tsconfig.json` | modify if needed (emitDecoratorMetadata, experimentalDecorators) |
| Integration test | `apps/api/src/` (path per α's design) | create (migrations + fixture round-trip) |
| Project MCP | `.cdd/PROJECT.md` | modify (Last verified + Migrations entry) |
| Self-coherence | `.cdd/unreleased/2/self-coherence.md` | create (α incremental) |

## AC oracle approach

| AC | Oracle | Pass condition |
|----|--------|---------------|
| AC1 | Read `apps/api/src/entities/*.entity.ts`; cross-ref against `.cdd/SCOPE.md` §Data model (v1) | Three entity classes with `@Entity()`; id=UUID v4 pk, created_at/updated_at=timestamptz; entity-specific columns match SCOPE exactly |
| AC2 | Read `project.entity.ts` for `archived`; read `issue.entity.ts` for project FK; read `comment.entity.ts` for issue FK | `Project.archived` boolean column with `default: false`; `Issue` has FK `project_id` → `Project.id`; `Comment` has FK `issue_id` → `Issue.id` |
| AC3 | `ls apps/api/src/migrations/` + `grep synchronize apps/api/src/app.module.ts apps/api/src/data-source.ts` | ≥1 migration file; all `synchronize` occurrences are `false`; no `synchronize: true` anywhere |
| AC4 | `cat apps/api/package.json \| jq '.scripts["migration:run"], .scripts["migration:revert"]'` | Both keys present with non-null TypeORM CLI invocations |
| AC5 | `npm run test:api` (with `DATABASE_URL` set) | Integration test creates real DataSource, runs migrations, inserts one fixture row per entity, reads back + asserts round-trip; exit 0 |
| AC6 | `rg '@Controller\|@Get\|@Post\|@Put\|@Patch\|@Delete' apps/api/src/ -l` | Only `health.controller.ts`; no project/issue/comment controller files |

## Empirical anchor (§2.2a)

No TypeORM wiring, entities, or migrations exist on `origin/cycle/2` at scaffold time:

- `rg "Entity|Migration|typeorm" apps/api/src/` → no matches (confirmed)
- `ls apps/api/src/entities/ 2>/dev/null` → directory absent (confirmed)
- `ls apps/api/src/migrations/ 2>/dev/null` → directory absent (confirmed)
- `apps/api/package.json` contains no `typeorm`, `@nestjs/typeorm`, or `pg` deps (confirmed by reading file)
- `apps/api/src/app.module.ts` contains no `TypeOrmModule` import (confirmed by reading file)

Gap is additive: this cycle creates the full TypeORM persistence layer from scratch.

## Design decision α must make and document

SCOPE.md says "All entities include id, created_at, updated_at" but Comment constraints say "no `updated_at` semantics (immutable in v1)". α must decide whether Comment carries a physical `updated_at` column (present but set once, never updated) or omits it entirely. Decision must appear in §Design of self-coherence.md before first implementation commit.

## Expected diff scope

Typical — 12–20 files:

- `apps/api/src/entities/` — 3 new entity files
- `apps/api/src/migrations/` — 1 initial migration file
- `apps/api/src/data-source.ts` — TypeORM DataSource for CLI
- `apps/api/src/app.module.ts` — modified
- `apps/api/package.json` — modified (new deps + scripts)
- `apps/api/tsconfig.json` — possibly modified
- Integration test — 1 file
- `.cdd/PROJECT.md` — modified
- `.cdd/unreleased/2/self-coherence.md` — α incremental
- `package-lock.json` — updated
