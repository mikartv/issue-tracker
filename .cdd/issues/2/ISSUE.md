# Issue 2 — DB schema + migrations

**Mode:** design-and-build  
**Status:** open  
**Branch:** cycle/2

## Problem

**What exists:** Nest scaffold without persistence (cycle 1).  
**What is expected:** TypeORM entities and migrations for `projects`, `issues`, `comments`.  
**Where they diverge:** No tables; api cannot persist data.

## Source of truth

- `.cdd/SCOPE.md` — §Data model (v1): fields, enums, constraints
- `.cdd/STACK.md` — TypeORM paths, `synchronize: false`, migration scripts

## Implementation contract (pinned by δ; α MUST NOT improvise)

| Axis | Pinned value |
|------|--------------|
| Language | TypeScript strict |
| CLI integration target | N/A |
| Package scoping | `apps/api/src/entities/`, `apps/api/src/migrations/` |
| Existing-binary disposition | extend cycle-1 Nest scaffold only |
| Runtime dependencies | TypeORM, PostgreSQL 16 driver |
| JSON/wire contract preservation | N/A (no HTTP business routes this cycle) |
| Backward-compat invariant | N/A |

Entity columns MUST match `.cdd/SCOPE.md` §Data model (v1) exactly.

## Acceptance Criteria

- [ ] AC1: Entities `Project`, `Issue`, `Comment` with fields per SCOPE §Data model (UUID pk, timestamptz, enums as varchar)
- [ ] AC2: `Project.archived` boolean default false; FK `Issue.project_id`, `Comment.issue_id`
- [ ] AC3: Initial migration in `apps/api/src/migrations/`; `synchronize: false`
- [ ] AC4: npm scripts `migration:run` and `migration:revert` in `apps/api`
- [ ] AC5: Integration test: run migrations against test DB, insert fixture row per entity, assert round-trip
- [ ] AC6: No HTTP routes for business CRUD yet (health only)

## Non-goals

- REST endpoints
- Seed data
- Soft delete

## Closure

Migrations run cleanly on fresh Postgres; tests pass on `cycle/2`.
