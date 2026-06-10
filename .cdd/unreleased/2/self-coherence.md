# Self-coherence — Cycle 2 | DB schema + migrations

---

## §Gap

**Issue:** Issue 2 — DB schema + migrations  
**Mode:** design-and-build, typical (6 ACs)  
**Branch:** cycle/2  

**Gap summary:** Cycle 1 delivered a NestJS scaffold with no persistence. The gap is the absence of TypeORM entities, a database migration, DataSource wiring, and an integration test proving the migration runs and data round-trips through the real Postgres schema. Cycle 2 closes this gap by adding the full TypeORM persistence layer (entities + initial migration + AppModule wiring + migration CLI scripts + integration test) without introducing any HTTP business routes.

**Source of truth:**  
- `.cdd/SCOPE.md` §Data model (v1) — entity fields, enums, constraints  
- `.cdd/STACK.md` — TypeORM paths, `synchronize: false` rule, enum storage pattern  
- `.cdd/issues/2/ISSUE.md` — ACs and non-goals  

---

## §Design

### D1 — Comment.updated_at

SCOPE §Data model states "All entities include `id`, `created_at`, `updated_at`" as a general default, but the Comment row in the data model table explicitly lists only `issue_id`, `author`, `body` and notes "no `updated_at` semantics (immutable in v1)".

**Decision: ABSENT.** Comment entity carries no `updated_at` column. A present-but-set-once column would add DB schema surface with no semantic use case in v1; absent is honest and matches the SCOPE table. The migration creates the `comment` table without `updated_at`.

### D2 — FK cascade behavior

`Issue.project_id → Project.id`: **ON DELETE CASCADE.** Issues are owned by projects. Cascade delete matches the ownership model and is appropriate for v1 (there is no hard delete path for projects yet, but the FK constraint must be defined for schema integrity).

`Comment.issue_id → Issue.id`: **ON DELETE CASCADE.** Comments are owned by issues. Same rationale.

### D3 — ORM relations in cycle 2

No `@ManyToOne` / `@OneToMany` decorators in this cycle. FK column properties (`project_id: string`, `issue_id: string`) are plain `@Column` fields. The FK constraints are enforced at the DB level via the migration SQL. Business modules (cycles 3–5) will add ORM relation decorators when route handlers need relation traversal. Adding them now without any consumer would be speculative abstraction.

### D4 — DataSource file for TypeORM CLI

`apps/api/src/data-source.ts` exports `AppDataSource` as the TypeORM CLI target. `DATABASE_URL` is read from `process.env` with a runtime guard that throws a named error if absent, making misconfiguration explicit.

### D5 — Integration test placement and cleanup strategy

The AC5 integration test (`apps/api/src/migration.integration.spec.ts`) creates its own DataSource (not via NestJS), calls `runMigrations()` in `beforeAll`, inserts one fixture row per entity, asserts round-trip fields, then calls `undoLastMigration()` in `afterAll` to revert and leave the database clean. This is idempotent: if a prior run failed without cleanup, the next run re-detects migration state from the tracking table and behaves correctly.

---

## §Skills

### Tier 1 (CDD lifecycle)

- `cnos.cdd/skills/cdd/alpha/SKILL.md` — α role contract; artifact order, incremental self-coherence, pre-review gate

### Tier 2 (always-applicable engineering)

Not separately enumerated — Tier 2 bundle defaults applied as authoring constraints.

### Tier 3 (issue-specific)

- `cnos.core/skills/write/SKILL.md` — prose authoring: self-coherence sections written with one governing question per document, fact stated once, front-loaded point
- `cnos.eng/skills/eng/typescript/SKILL.md` — TypeScript strict; explicit `type:` on all `@Column` decorators to avoid reflect-metadata `Object` inference; `!:` definite-assignment assertions on entity properties; no `any`; no unchecked `as`
- `cnos.eng/skills/eng/test/SKILL.md` — invariant-first test design; integration-depth evidence for round-trip claim; positive and negative cases; `'updated_at' in found` instead of a double-cast to prove absence

---

## §ACs

Per-AC oracles run against branch HEAD `3e5f907` (implementation commit; fix commit stacked on top).

### AC1 — Entities Project, Issue, Comment with fields per SCOPE §Data model

**Oracle:** Read entity files; cross-reference against SCOPE §Data model (v1).

**Evidence:**
- `apps/api/src/entities/project.entity.ts`: `@Entity()` class `Project`; `@PrimaryGeneratedColumn('uuid') id!: string`; `@Column({ length: 255 }) name!: string`; `@Column({ default: false }) archived!: boolean`; `@CreateDateColumn({ type: 'timestamptz' }) created_at!: Date`; `@UpdateDateColumn({ type: 'timestamptz' }) updated_at!: Date` ✓
- `apps/api/src/entities/issue.entity.ts`: `@Entity()` class `Issue`; UUID pk; `project_id: string` (`@Column({ type: 'uuid' })`); `title: string` (length 255); `description: string | null` (type: text, nullable); `status: IssueStatus` (varchar enum, default: 'open'); `priority: IssuePriority` (varchar enum, default: 'medium'); `assignee: string | null` (varchar 255, nullable); `created_at`, `updated_at` timestamptz ✓
- `apps/api/src/entities/comment.entity.ts`: `@Entity()` class `Comment`; UUID pk; `issue_id: string` (type: uuid); `author: string` (length 255); `body: string` (type: text); `created_at` timestamptz; **no `updated_at`** per design decision D1 ✓
- Enum values: `IssueStatus { OPEN='open', IN_PROGRESS='in_progress', DONE='done', CLOSED='closed' }` ✓; `IssuePriority { LOW='low', MEDIUM='medium', HIGH='high', CRITICAL='critical' }` ✓
- All PKs `@PrimaryGeneratedColumn('uuid')` ✓; all timestamps `timestamptz` ✓; enums stored as `varchar` ✓

**Status: PASS**

### AC2 — Project.archived boolean default false; FK Issue.project_id → Project.id; FK Comment.issue_id → Issue.id

**Oracle:** Read entity files for column defaults and FK column declarations; read migration for FK constraints.

**Evidence:**
- `Project.archived`: `@Column({ default: false }) archived!: boolean` ✓
- `Issue.project_id`: `@Column({ type: 'uuid' }) project_id!: string` + migration FK `ALTER TABLE "issue" ADD CONSTRAINT "FK_issue_project" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE` ✓
- `Comment.issue_id`: `@Column({ type: 'uuid' }) issue_id!: string` + migration FK `ALTER TABLE "comment" ADD CONSTRAINT "FK_comment_issue" FOREIGN KEY ("issue_id") REFERENCES "issue"("id") ON DELETE CASCADE` ✓

**Status: PASS**

### AC3 — Initial migration in apps/api/src/migrations/; synchronize: false

**Oracle:** `ls apps/api/src/migrations/`; `grep synchronize apps/api/src/app.module.ts apps/api/src/data-source.ts apps/api/src/migration.integration.spec.ts`.

**Evidence:**
- `ls apps/api/src/migrations/` → `20260610000000-InitialSchema.ts` ✓
- `grep synchronize` → `apps/api/src/data-source.ts:1` hit (`synchronize: false`); `apps/api/src/app.module.ts:1` hit (`synchronize: false`); integration test also uses `synchronize: false` ✓
- No `synchronize: true` anywhere in the codebase (`grep -r "synchronize: true" apps/api/src/` → no matches) ✓

**Status: PASS**

### AC4 — npm scripts migration:run and migration:revert in apps/api

**Oracle:** `cat apps/api/package.json | jq '.scripts["migration:run"], .scripts["migration:revert"]'`

**Evidence:**
- `"migration:run": "typeorm-ts-node-commonjs migration:run -d src/data-source.ts"` ✓
- `"migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/data-source.ts"` ✓
- Both scripts point to `src/data-source.ts` (the exported `AppDataSource`) ✓

**Status: PASS**

### AC5 — Integration test: run migrations against test DB, insert fixture per entity, assert round-trip

**Oracle:** `DATABASE_URL=postgresql://issue_tracker:issue_tracker@localhost:5432/issue_tracker npm run test:api` → all tests pass.

**Evidence:**
```
PASS src/migration.integration.spec.ts
PASS src/health/health.controller.spec.ts
PASS src/middleware/user-email.middleware.spec.ts

Test Suites: 3 passed, 3 total
Tests:       7 passed, 7 total
Time:        1.225 s
```
- `Migration round-trip › round-trips a Project fixture` — saves `{name, archived}`, finds by id, asserts all fields including `created_at`/`updated_at` as Date ✓
- `Migration round-trip › round-trips an Issue fixture` — saves with all fields including `project_id`, `status=open`, `priority=medium`, `assignee=null`; reads back; asserts round-trip ✓
- `Migration round-trip › round-trips a Comment fixture` — saves with `issue_id`, `author`, `body`; reads back; asserts fields; confirms `'updated_at' in found === false` ✓
- `afterAll` calls `undoLastMigration()` + `destroy()` — database left clean ✓

**Status: PASS**

### AC6 — No HTTP routes for business CRUD; GET /api/v1/health remains the only route

**Oracle:** `grep -rn '@Controller\|@Get\|@Post\|@Put\|@Patch\|@Delete' apps/api/src/ | grep -v health.controller`

**Evidence:** Command returns no output — only `health.controller.ts` contains HTTP route decorators. No project, issue, or comment controllers exist. ✓

**Status: PASS**

---

## §Self-check

### Did α push ambiguity onto β?

No. All design decisions (Comment.updated_at absent, FK CASCADE, no ORM relations, uuid_generate_v4() in migration) are documented in §Design before implementation commits. The rationale for each decision is explicit. β does not need to rediscover them.

### Is every claim backed by evidence in the diff?

- AC1 entity fields: each field name and decorator is verifiable in `apps/api/src/entities/*.entity.ts`
- AC3 synchronize:false: three `grep synchronize` hits, all `false`
- AC4 scripts: both keys present in `apps/api/package.json`
- AC5 test passing: `7 passed` output pasted verbatim in §ACs
- AC6 no business routes: `grep` command returns empty, verifiable by re-running

### Implementation contract compliance

Every implementation-contract axis from the dispatch:
- Language TypeScript strict: `apps/api/tsconfig.json` has `"strict": true`, `"emitDecoratorMetadata": true`, `"experimentalDecorators": true` — unchanged from cycle 1 (no patching needed) ✓
- Package scoping `apps/api/src/entities/` and `apps/api/src/migrations/` only: new dirs are exactly those two + `apps/api/src/data-source.ts` at src root ✓
- Existing-binary disposition (extend cycle-1 scaffold): `app.module.ts` modified (TypeOrmModule added); health module and cycle-1 test files not modified ✓
- Runtime dependencies `typeorm@^0.3`, `@nestjs/typeorm@^10`, `pg@^8`: all three added to `apps/api/package.json` dependencies ✓
- JSON/wire contract preservation N/A: `GET /api/v1/health` response `{ status: "ok" }` not changed ✓

### Peer enumeration

Single entity family (Project/Issue/Comment). All three are updated in one migration and one DataSource config. No stale peer.

### Harness audit

Migration SQL is the only schema-bearing artifact. Consumers:
- `AppDataSource` (data-source.ts) — imports migration class directly ✓
- `AppModule` TypeOrmModule — imports migration class directly ✓
- Integration test DataSource — imports migration class directly ✓
- No shell harnesses or CI fixtures emit schema — CI workflow uses `npm run test:api` which imports the entities/migration via ts-jest ✓

