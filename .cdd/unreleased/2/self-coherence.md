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
