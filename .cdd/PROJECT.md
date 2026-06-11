# Project MCP — issue-tracker

**Last verified:** 2026-06-11 (cycle 4 — Issues API: module, controller, service, 3 DTOs, unit + e2e tests; `npm run test:api` 62 tests pass)  
**Verify with:** `npm run test:all` (from repo root)

## Build / run / test

| Command | Purpose | Status |
|---------|---------|--------|
| `npm install` | Install all workspace deps | ✅ verified |
| `npm run dev:db` | Start Postgres 16 via Docker (`docker compose up -d db`) | ✅ configured |
| `npm run dev:api` | NestJS watch mode (`ts-node src/main.ts`) | ✅ configured |
| `npm run dev:web` | Angular dev server (`ng serve`) | ✅ configured |
| `npm run test:all` | api + web test suites | ✅ `64 tests passed` (cycle 4: 62 api + 2 web) |
| `npm run test:api` | API tests only (Jest) | ✅ `62 tests passed` (cycle 4) |
| `npm run test:web` | Web tests only (Jest via jest-preset-angular) | ✅ `2 tests passed` |

Sample output from `npm run test:all` (cycle 4):
```
Test Suites: 7 passed, 7 total (api)
Tests:       62 passed, 62 total (api)
Test Suites: 1 passed, 1 total (web)
Tests:       2 passed, 2 total (web)
```

## Repo map

| Path | Role |
|------|------|
| `apps/api/` | NestJS REST API (`/api/v1`, Swagger at `/api/docs`) |
| `apps/api/src/health/` | Health check endpoint (`GET /api/v1/health`) |
| `apps/api/src/middleware/` | `UserEmailMiddleware` — sets `req.userEmail` from `X-User-Email` |
| `apps/api/src/projects/` | Projects module: create, list, rename, archive (cycle 3) |
| `apps/api/src/issues/` | Issues module: create, list-by-project, get, patch, status-transition (cycle 4) |
| `apps/web/` | Angular 17 SPA (standalone components) |
| `apps/web/src/environments/` | Angular environment files |
| `docker-compose.yml` | Postgres 16 service (`db`) |
| `.env.example` | `DATABASE_URL` template |
| `.github/workflows/ci.yml` | CI: api job (Postgres service) + web job on Node 20 |
| `.cdd/SCOPE.md` | Product boundary |
| `.cdd/STACK.md` | Stack pins, CDD dispatch binding |
| `.cdd/ISSUES.md` | Cycle index |
| `.cdd/issues/N/ISSUE.md` | Per-cycle dispatch contract |

## Entry points

| Surface | Entry | Cycle |
|---------|-------|-------|
| API | `apps/api/src/main.ts` | 1 ✅ |
| Projects API | `apps/api/src/projects/projects.controller.ts` | 3 ✅ |
| Issues API | `apps/api/src/issues/issues.controller.ts` | 4 ✅ |
| Web | `apps/web/src/main.ts` | 1 ✅ |
| Migrations | `apps/api/src/migrations/20260610000000-InitialSchema.ts` | 2 ✅ |

## CI / local parity

GitHub Actions `.github/workflows/ci.yml`:
- `api` job: Node 20, Postgres 16 service container, `npm run test:api`
- `web` job: Node 20, `npm run test:web`

Local `npm run test:all` = CI api + web jobs combined.

## Conventions

See `.cdd/STACK.md`. Branch per cycle: `cycle/N`. Cycle artifacts: `.cdd/unreleased/N/` on same branch.

## Decisions (append-only, short)

- 2026-06-09: Greenfield; contracts in `.cdd/` before code. Issues local (not GitHub Issues). Hub: cn-sigma.
- 2026-06-09: Cycle 1 — monorepo scaffold delivered. npm workspaces root with `apps/api` (NestJS 10) and `apps/web` (Angular 17). Jest in both apps (ts-jest for API, jest-preset-angular for web). Tests pass locally.

## Decisions (append-only, short) — cycle 2

- 2026-06-10: Cycle 2 — TypeORM persistence layer. Entities Project/Issue/Comment. Initial migration with uuid-ossp extension, FK CASCADE constraints. AppModule wired with TypeOrmModule.forRootAsync; synchronize: false. Integration test proves migration round-trip.

## Decisions (append-only, short) — cycle 3

- 2026-06-11: Cycle 3 — Projects HTTP API. NestJS `ProjectsModule` with controller, service, two DTOs (create/update). Four routes: POST /projects (201), GET /projects (200), PATCH /projects/:id (200/404/409), POST /projects/:id/archive (200/404/409). Global ValidationPipe + class-validator on DTOs. Swagger via @ApiTags/@ApiResponse decorators. Unit tests mock TypeORM repository; e2e tests use real Postgres with supertest. 25 API tests pass.

## Decisions (append-only, short) — cycle 4

- 2026-06-11: Cycle 4 — Issues HTTP API. NestJS `IssuesModule` with one controller (empty prefix), service, three DTOs (create/update/update-status). Five routes: POST /projects/:projectId/issues (201/404/409), GET /projects/:projectId/issues (200), GET /issues/:id (200/404), PATCH /issues/:id (200/400/404), POST /issues/:id/status (200/400/404). Status transitions enforced via constant `TRANSITIONS` map; skips, reverts, same-status, and transitions from `closed` all return 400. Archived-project guard in service (loads Project repo). `--runInBand` added to `jest` script to prevent e2e races on shared Postgres. 62 API tests pass (25 pre-existing + 17 new unit + 20 new e2e).

## Known unknowns / debt

- CORS vs Angular dev proxy — decided in cycle 6.
- Business modules (comments) — cycle 5.
- ORM-level @ManyToOne/@OneToMany relations — deferred (D-CY2-4); issues loaded by project_id column directly.
