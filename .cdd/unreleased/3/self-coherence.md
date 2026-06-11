# Self-coherence — Cycle 3

## §Gap

**Issue:** Issue 3 — Projects API  
**Mode:** design-and-build, typical (7 ACs)  
**Branch:** cycle/3  

**Gap statement:** Cycle 2 delivered the DB persistence layer (Project entity + migration). Clients cannot manage projects. This cycle closes the gap by adding the full Projects HTTP module on top of the existing entity: four routes (create, list, rename, archive), validation, Swagger documentation, and tests (unit + e2e).

**Additive:** yes — no existing project routes; no existing `apps/api/src/projects/` directory. This cycle is purely additive to the cycle 2 persistence layer.

**Out of scope (this cycle):** issues/comments endpoints, pagination, delete project, ORM relation decorators (D-CY2-4 stays deferred).
