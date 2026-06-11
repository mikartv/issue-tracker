# Project MCP — issue-tracker

**Last verified:** 2026-06-10 (cycle 2 — TypeORM entities + migration + integration test; `npm run test:api` 7 tests pass)  
**Verify with:** `npm run test:all` (from repo root)

## Build / run / test

| Command | Purpose | Status |
|---------|---------|--------|
| `npm install` | Install all workspace deps | ✅ verified |
| `npm run dev:db` | Start Postgres 16 via Docker (`docker compose up -d db`) | ✅ configured |
| `npm run dev:api` | NestJS watch mode (`ts-node src/main.ts`) | ✅ configured |
| `npm run dev:web` | Angular dev server (`ng serve`) | ✅ configured |
| `npm run test:all` | api + web test suites | ✅ `9 tests passed` (cycle 2) |
| `npm run test:api` | API tests only (Jest) | ✅ `7 tests passed` (cycle 2) |
| `npm run test:web` | Web tests only (Jest via jest-preset-angular) | ✅ `2 tests passed` |

Sample output from `npm run test:all` (cycle 2):
```
Test Suites: 3 passed, 3 total (api)
Tests:       7 passed, 7 total (api)
Test Suites: 1 passed, 1 total (web)
Tests:       2 passed, 2 total (web)
```

## Repo map

| Path | Role |
|------|------|
| `apps/api/` | NestJS REST API (`/api/v1`, Swagger at `/api/docs`) |
| `apps/api/src/health/` | Health check endpoint (`GET /api/v1/health`) |
| `apps/api/src/middleware/` | `UserEmailMiddleware` — sets `req.userEmail` from `X-User-Email` |
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

## Known unknowns / debt

- CORS vs Angular dev proxy — decided in cycle 6.
- Business modules (projects/issues/comments) — cycles 3–5.
- ORM-level @ManyToOne/@OneToMany relations — deferred to cycle 3 (no consumer in cycle 2).
