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

