---
section_manifest:
  planned: [Gap, Skills, ACs, Self-check, Debt, CDD-Trace, Review-readiness]
  completed: [Gap, Skills, ACs]
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

## §ACs

Per-AC oracles run against branch HEAD `4a5ff33` (scaffold commit).

**AC1** ✅ Root `package.json` has `"workspaces": ["apps/api","apps/web"]` and scripts `dev:db`, `dev:api`, `dev:web`, `test:all`, `test:api`, `test:web`.  
Oracle: `node -e "..."` → `workspaces: ["apps/api","apps/web"]`; `scripts: ["dev:db","dev:api","dev:web","test:all","test:api","test:web"]`

**AC2** ✅ `docker-compose.yml` defines service `db` using `postgres:16`; `dev:db` script = `docker compose up -d db`.  
Oracle: `cat docker-compose.yml` → `image: postgres:16`; `dev:db: "docker compose up -d db"` in root package.json.

**AC3** ✅ `apps/api/src/main.ts` calls `app.setGlobalPrefix('api/v1')`; `health.controller.ts` `@Get()` returns `{ status: 'ok' }`.  
Oracle: `grep setGlobalPrefix apps/api/src/main.ts` → `app.setGlobalPrefix('api/v1')`; controller `check()` returns `{ status: 'ok' }`.  
Unit-test evidence: `HealthController returns { status: "ok" }` — 1 test, PASS.

**AC4** ✅ `UserEmailMiddleware` reads `req.headers['x-user-email']`; sets `req.userEmail` to trimmed header value or `'anonymous'`.  
Wired in `AppModule` via `consumer.apply(UserEmailMiddleware).forRoutes('*')`.  
Oracle: `grep x-user-email,userEmail,anonymous apps/api/src/middleware/user-email.middleware.ts` → all 3 present at correct lines.  
Unit-test evidence: 3 tests (header present / absent / blank) — all PASS.

**AC5** ✅ `apps/web/src/environments/environment.development.ts` contains `apiUrl: 'http://localhost:3000/api/v1'`.  
`AppComponent` is standalone (no NgModule). Placeholder home page renders `<h1>Issue Tracker</h1>`.  
Oracle: `cat apps/web/src/environments/environment.development.ts` → `apiUrl: 'http://localhost:3000/api/v1'`.

**AC6** ✅ `.env.example` at repo root contains `DATABASE_URL=postgresql://issue_tracker:issue_tracker@localhost:5432/issue_tracker`.  
Oracle: `cat .env.example` → `DATABASE_URL=postgresql://...`.

**AC7** ✅ `.github/workflows/ci.yml` — `api` job: Node 20 (`actions/setup-node@v4` with `node-version: '20'`), Postgres service container (`postgres:16`), runs `npm run test:api`; `web` job: Node 20, runs `npm run test:web`.  
Oracle: `grep -E 'api:|web:|postgres' .github/workflows/ci.yml` → both jobs confirmed.

**AC8** ✅ `npm run test:all` output (verbatim from this session):
```
Test Suites: 2 passed, 2 total  (api — health.controller.spec.ts + user-email.middleware.spec.ts)
Tests:       4 passed, 4 total  (api)
Test Suites: 1 passed, 1 total  (web — app.component.spec.ts)
Tests:       2 passed, 2 total  (web)
```
Total: 3 suites, 6 tests, all PASS. At least 1 test per app: ✅

**AC9** ✅ README quick-start section contains all three commands with descriptions.  
Oracle: `grep -E 'dev:db|dev:api|dev:web' README.md` → all 3 present with port annotations.

**AC10** ✅ `.cdd/PROJECT.md` updated — `Last verified: 2026-06-09 (cycle 1 — scaffold complete; npm run test:all passes locally)`; build/run/test table expanded with ✅ verified status and sample output.  
Oracle: `head -5 .cdd/PROJECT.md` → `Last verified: 2026-06-09`.

**All 10 ACs met.**
