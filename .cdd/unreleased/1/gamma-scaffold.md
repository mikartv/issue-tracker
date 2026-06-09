# γ Scaffold — Cycle 1

Issue: Issue 1 — Monorepo scaffold + Docker + CI  
Mode: design-and-build, substantial  
Branch: cycle/1  

## Surfaces α will touch

| Surface | Path | Operation |
|---------|------|-----------|
| Workspaces root | `package.json` | create |
| Docker Compose | `docker-compose.yml` | create |
| Env example | `.env.example` | create |
| CI workflow | `.github/workflows/ci.yml` | create |
| API app | `apps/api/` | create (NestJS scaffold) |
| API entry | `apps/api/src/main.ts` | create |
| API app module | `apps/api/src/app.module.ts` | create |
| Health module | `apps/api/src/health/` | create |
| User email middleware | `apps/api/src/middleware/user-email.middleware.ts` | create |
| API tsconfig + jest | `apps/api/tsconfig*.json`, `apps/api/jest.config.*` | create |
| API package.json | `apps/api/package.json` | create |
| Web app | `apps/web/` | create (Angular scaffold) |
| Web environments | `apps/web/src/environments/environment*.ts` | create |
| Web tsconfig + jest | `apps/web/tsconfig*.json`, `apps/web/jest.config.*` | create |
| Web package.json | `apps/web/package.json` | create |
| README | `README.md` | update (quick-start section) |
| Project MCP | `.cdd/PROJECT.md` | update (commands + Last verified) |

## AC oracle approach

| AC | Oracle | Pass condition |
|----|--------|---------------|
| AC1 | `cat package.json \| jq '.workspaces, .scripts'` | workspaces = `["apps/api","apps/web"]`; scripts includes `dev:db`, `dev:api`, `dev:web`, `test:all`, `test:api`, `test:web` |
| AC2 | `cat docker-compose.yml` | service named `db` uses `postgres:16`; `dev:db` script maps to `docker compose up -d db` |
| AC3 | Read `apps/api/src/health/*.ts` + `apps/api/src/main.ts` | `@Get()` or `@Get('health')` returns `{ status: 'ok' }`; global prefix `/api/v1` set in main.ts |
| AC4 | `rg UserEmailMiddleware apps/api/src/` | middleware reads `X-User-Email` header; sets `req.userEmail` defaulting to `"anonymous"`; wired in AppModule |
| AC5 | `cat apps/web/src/environments/environment.development.ts` | `apiUrl: 'http://localhost:3000/api/v1'` present |
| AC6 | `cat .env.example` | `DATABASE_URL=postgresql://...` present |
| AC7 | `cat .github/workflows/ci.yml` | `api` job: Node 20 matrix + postgres service container + `npm run test:api`; `web` job: Node 20 + `npm run test:web` |
| AC8 | α pastes actual `npm run test:all` runner output into self-coherence.md | exit 0; ≥1 test per app confirmed from runner output |
| AC9 | `rg 'dev:db\|dev:api\|dev:web' README.md` | all three commands present in quick-start section |
| AC10 | `head -5 .cdd/PROJECT.md` | `Last verified` date updated; build/run/test table has real verified commands |

## Empirical anchor (§2.2a grep check)

Greenfield repo confirmed: no `apps/`, `docker-compose.yml`, `package.json` (root), `.env.example`, or `.github/` exist at `origin/cycle/1` tip — this repo is docs-only after cycle 0. The negation holds without grep because `.cdd/PROJECT.md` explicitly states "No application code yet — all build/run claims above are planned, not verified."

## Expected diff scope

Substantial — new top-level directory tree. Estimated 30–55 files:

- `apps/api/` — ~15–25 files: NestJS scaffold, `main.ts`, `app.module.ts`, `health/` module (controller + module), `middleware/user-email.middleware.ts`, tsconfig, jest config, `package.json`
- `apps/web/` — ~15–25 files: Angular 17 standalone scaffold, `app.component.ts`, routing, `environments/`, tsconfig, jest config, `package.json`
- Root: `package.json`, `docker-compose.yml`, `.env.example`
- `.github/workflows/ci.yml`
- `README.md` (modified: quick-start section added)
- `.cdd/PROJECT.md` (modified: Last verified + commands)
- `.cdd/unreleased/1/self-coherence.md` (α authors incrementally on this branch)
