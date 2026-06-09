---
section_manifest:
  planned: [Gap, Skills, ACs, Self-check, Debt, CDD-Trace, Review-readiness]
  completed: [Gap, Skills]
---

# Self-coherence — Cycle 1

## §Gap

**Issue:** Issue 1 — Monorepo scaffold + Docker + CI  
**Mode:** design-and-build, substantial  
**Branch:** cycle/1  
**Version:** 0.0.1 (greenfield; no prior implementation)

**Gap statement:** Docs-only repo after cycle 0. No `apps/`, no compose file, no tests. This cycle closes the gap by delivering a runnable monorepo skeleton: Postgres via Docker, NestJS health endpoint, Angular 17 placeholder app, CI green.

**Active ACs:** 10 (AC1–AC10)  
**Non-goals verified:** No TypeORM entities, no Swagger beyond health stub, no Angular Material, no auth beyond header stub middleware.

## §Skills

**Tier 1:**
- `cnos.cdd/skills/cdd/alpha/SKILL.md` — α role contract (dispatch intake, artifact order, self-coherence, pre-review gate)
- `cnos.cdd/skills/cdd/CDD.md` — canonical lifecycle and role contract

**Tier 2 (always-applicable):**
- `cnos.eng/skills/eng/typescript/SKILL.md` — TypeScript strict mode, boundary validation, module design, no `any`
- `cnos.eng/skills/eng/test/SKILL.md` — invariant-first testing, negative space, test family selection

**Tier 3 (issue-specific):**
- `cnos.core/skills/write/SKILL.md` — docs authoring (README, PROJECT.md, self-coherence)

**Active constraints applied:**
- TypeScript `strict: true` in both `apps/api/tsconfig.json` and `apps/web/tsconfig.json`
- No `any` in production code; `as unknown as X` used only in test fixtures (RequestWithUserEmail)
- External input treated as `unknown` at module boundaries
- Tests prove invariants (health controller returns exact shape; middleware branching on header presence/absence/blank)
- Negative-space tests: 2 of 3 middleware tests are rejection/default cases
