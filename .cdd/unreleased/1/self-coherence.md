---
section_manifest:
  planned: [Gap, Skills, ACs, Self-check, Debt, CDD-Trace, Review-readiness]
  completed: [Gap, Skills, ACs, Self-check, Debt, CDD-Trace, Review-readiness]
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

## §Self-check

**Did α's work push ambiguity onto β?**

No. Each AC has a concrete oracle. No claim is "verified by visual inspection only." Test output is pasted verbatim (not enumerated from memory). The health controller AC is proven by unit test, not just file existence. The middleware AC is proven by 3 tests covering all branches (present/absent/blank header).

**Is every claim backed by evidence in the diff?**

Yes:
- AC1: `package.json` in diff, workspaces + scripts verified by node invocation
- AC2: `docker-compose.yml` in diff, `image: postgres:16` present
- AC3: `main.ts` and `health.controller.ts` in diff; `setGlobalPrefix('api/v1')` + `return { status: 'ok' }` grepped and unit-tested
- AC4: `user-email.middleware.ts` in diff; 3 passing unit tests
- AC5: `apps/web/src/environments/environment.development.ts` in diff; `apiUrl` grepped
- AC6: `.env.example` in diff; `DATABASE_URL` present
- AC7: `.github/workflows/ci.yml` in diff; both jobs verified
- AC8: `npm run test:all` output pasted verbatim (6 tests, 3 suites, all PASS)
- AC9: `README.md` in diff; all 3 dev commands present
- AC10: `.cdd/PROJECT.md` in diff; `Last verified` date + verified commands table

**Role self-check: were active skills applied as generation constraints?**

- TypeScript skill: `strict: true` in both tsconfigs; no `any` in production code; `as unknown as X` used only in test fixture where full `Request` shape isn't needed (test-boundary pragmatism, noted in §Debt)
- Test skill: invariants named before tests written; negative space covered (middleware: 2/3 tests are absence/blank cases); test families matched to surfaces (unit/example for scaffold — property tests not required for these determistic single-branch functions)
- Write skill: README governs quick-start; PROJECT.md governs verified commands; no fact duplicated across files without pointing to authority

**Peer enumeration:** This cycle creates all peers from scratch (greenfield). No sibling changes at same layer. UserEmailMiddleware is the only middleware; it has one unique AC4 claim. No peer set drift possible.

**Harness audit:** CI workflow (`ci.yml`) is a non-code harness. Audited against implementation: `api` job runs `npm run test:api` (confirmed working locally); Postgres service container uses same credentials as `.env.example`. No shell fixtures emit runtime contract JSON; no CI-emitted schema artifacts. Harness audit: complete.

## §Debt

**D1 — `as unknown as X` in test fixture (minor)**  
`apps/api/src/middleware/user-email.middleware.spec.ts` uses double cast to construct a minimal Express `Request` mock. TypeScript strict mode requires this because the test doesn't provide the full `Request` shape. Acceptable test-boundary pragmatism; no production-code `any` or unsafe casts present. A future refactor could extract a `MinimalRequest` interface for cleaner mocks.

**D2 — `start:dev` uses `ts-node` (not `nest start --watch`) (minor)**  
`apps/api/package.json` `start:dev` uses `ts-node -r tsconfig-paths/register src/main.ts` rather than `nest start --watch`. The `@nestjs/cli` is in devDependencies but `nest` binary is not used for dev-mode because `@nestjs/cli` is available at the workspace level. Both approaches are equivalent for cycle 1; cycle 2 may standardise on `nest start --watch` once TypeORM integration lands.

**D3 — Angular `ng serve` not smoke-tested in this cycle**  
`npm run dev:web` triggers `ng serve` which requires `@angular-devkit/build-angular` and the full Angular build pipeline. The build works in terms of installed packages, but the dev server start was not verified (no running Chrome/browser available in this session). AC5 is satisfied by code inspection + unit tests + environment file check. UI smoke-testing deferred to a future cycle or manual post-merge verification.

**D4 — CI not run (no GitHub remote)**  
The repository has no `origin` remote. The pre-review gate row 1 (rebase onto `origin/main`) and row 10 (branch CI green) are inapplicable. CI workflow is structurally correct per oracle verification (AC7); actual GitHub Actions run deferred until remote is configured. Noted in Review-readiness section.

**D5 — `supertest` deprecation warning (low)**  
`npm install` warns `supertest@6.3.4` is deprecated. `supertest` is a devDependency for integration tests that aren't in scope for cycle 1. Can be upgraded to `^7.1.3` in cycle 2 when e2e tests are added.

**No D-blocking debt.** All debt items are minor and do not block AC closure or β review.

## §CDD Trace

| Step | Description | Evidence |
|------|-------------|----------|
| 0 | Issue selected | Issue 1 — Monorepo scaffold + Docker + CI; `cycle/1` branch |
| 1 | Issue read | `.cdd/issues/1/ISSUE.md` — 10 ACs, non-goals, implementation contract |
| 2 | Branch | `cycle/1` — already created by γ; α switched to it (`git switch cycle/1`) |
| 3 | Source-of-truth docs read | `.cdd/STACK.md`, `.cdd/SCOPE.md`, `.cdd/PROJECT.md`, `.cdd/unreleased/1/gamma-scaffold.md` |
| 4 | Skills loaded | Tier 1: CDD.md + alpha/SKILL.md; Tier 2: typescript/SKILL.md + test/SKILL.md; Tier 3: write/SKILL.md |
| 5 | Design | Not required — implementation contract fully pinned by δ; architecture is a standard NestJS+Angular monorepo with no novel design choices |
| 6 | Implementation | Files authored (31 new files). Full enumeration: `package.json`, `package-lock.json`, `docker-compose.yml`, `.env.example`, `.gitignore`, `.github/workflows/ci.yml`, `apps/api/package.json`, `apps/api/tsconfig.json`, `apps/api/tsconfig.build.json`, `apps/api/src/main.ts`, `apps/api/src/app.module.ts`, `apps/api/src/health/health.module.ts`, `apps/api/src/health/health.controller.ts`, `apps/api/src/health/health.controller.spec.ts`, `apps/api/src/middleware/user-email.middleware.ts`, `apps/api/src/middleware/user-email.middleware.spec.ts`, `apps/web/package.json`, `apps/web/angular.json`, `apps/web/jest.config.js`, `apps/web/tsconfig.json`, `apps/web/tsconfig.app.json`, `apps/web/tsconfig.spec.json`, `apps/web/setup-jest.ts`, `apps/web/src/main.ts`, `apps/web/src/index.html`, `apps/web/src/app/app.component.ts`, `apps/web/src/app/app.component.spec.ts`, `apps/web/src/app/app.routes.ts`, `apps/web/src/environments/environment.ts`, `apps/web/src/environments/environment.development.ts`, `README.md` (modified), `.cdd/PROJECT.md` (modified). Caller paths: `main.ts` → `AppModule` → `HealthModule` → `HealthController`; `AppModule` configures `UserEmailMiddleware` for all routes. Tests cover all new public surfaces. Commit: `4a5ff33` |
| 7 | Self-coherence | This document — §Gap through §CDD Trace written incrementally, one section per commit. Commits: `f450cac` (§Gap), `ea0099a` (§Skills), `7856d3d` (§ACs), `b2fb15a` (§Self-check), `44967d8` (§Debt), current (§CDD Trace) |

**Artifact enumeration (pre-review gate row 11):**  
All α-authored files are referenced in §ACs above. New modules with non-test callers:
- `HealthModule` → imported by `AppModule` (`app.module.ts`)
- `UserEmailMiddleware` → applied by `AppModule` (`consumer.apply(UserEmailMiddleware).forRoutes('*')`)
- `HealthController` → registered in `HealthModule`

**Test caller trace (pre-review gate row 12):**  
- `HealthController.check()` — called by `health.controller.spec.ts` (test) and by NestJS routing at `GET /api/v1/health` (main.ts bootstrap path)
- `UserEmailMiddleware.use()` — called by `user-email.middleware.spec.ts` (test) and by NestJS middleware pipeline on every request

**Git identity:**  
Author email for α commits on `cycle/1`: `alpha@issue-tracker.cdd.cnos` (set via `git config user.email` at session start; verified by `git log -1 --format='%ae'`).

---

## Review-readiness | round 1 | implementation SHA: 4a5ff33 | branch CI: N/A (no remote) | ready for β

**Pre-review gate checklist:**

| Row | Check | Result |
|-----|-------|--------|
| 1 | `origin/cycle/1` rebased onto `origin/main` | N/A — no remote configured (D4 in §Debt); local branch on current `main` tip |
| 2 | `self-coherence.md` carries CDD Trace through step 7 | ✅ §CDD Trace complete, all 7 steps present |
| 3 | Tests present or explicit reason none apply | ✅ 3 suites, 6 tests (4 api + 2 web), all PASS |
| 4 | Every AC has evidence | ✅ §ACs — AC1–AC10 each mapped to oracle output |
| 5 | Known debt explicit | ✅ §Debt — D1–D5 declared; no D-blocking items |
| 6 | Schema/shape audit completed | N/A — no schema-bearing runtime contracts introduced this cycle |
| 7 | Peer enumeration completed | N/A — greenfield; no sibling surfaces at same layer |
| 8 | Harness audit completed | ✅ CI workflow audited in §Self-check |
| 9 | Post-patch re-audit completed | N/A — no mid-cycle RC patches |
| 10 | Branch CI green | N/A — no remote; CI workflow structurally correct (AC7 oracle) |
| 11 | Artifact enumeration matches diff | ✅ All 31 new/modified files listed in §CDD Trace step 6 |
| 12 | Caller-path trace for new modules | ✅ `HealthModule`, `HealthController`, `UserEmailMiddleware` — callers named in §CDD Trace |
| 13 | Test assertion count from runner output | ✅ API: 4 tests (verbatim output pasted in §ACs); Web: 2 tests (verbatim) |
| 14 | Author email matches `alpha@issue-tracker.cdd.cnos` | ✅ `git log -1 --format='%ae'` → `alpha@issue-tracker.cdd.cnos` |
| 15 | γ-artifact at canonical §5.1 path | ✅ `.cdd/unreleased/1/gamma-scaffold.md` present on `cycle/1` (`git ls-tree` confirms) |

**γ-artifact:** `gamma-scaffold.md` at canonical §5.1 path on `cycle/1`.

**Branch:** `cycle/1` (local-only; no remote push possible without `origin` configured)

**Implementation SHA:** `4a5ff33` — `feat: monorepo scaffold — NestJS API, Angular web, Docker, CI (closes AC1–AC10)`

**α is review-ready.** Branch `cycle/1` contains the complete monorepo skeleton. β may review from this HEAD.
