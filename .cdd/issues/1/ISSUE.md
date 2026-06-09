# Issue 1 — Monorepo scaffold + Docker + CI

**Mode:** design-and-build  
**Status:** open  
**Branch:** cycle/1

## Problem

**What exists:** Docs-only repo after cycle 0.  
**What is expected:** Runnable monorepo skeleton: Postgres via Docker, Nest health endpoint, Angular placeholder, CI green.  
**Where they diverge:** No `apps/`, no compose file, no tests.

## Source of truth

- `.cdd/STACK.md` — layout, versions, scripts, error shape, middleware, CDD dispatch
- `.cdd/PROJECT.md` — update with verified commands after scaffold
- `.cdd/SCOPE.md` — non-goals (no business entities yet)

## Implementation contract (pinned by δ; α MUST NOT improvise)

| Axis | Pinned value |
|------|--------------|
| Language | TypeScript strict |
| CLI integration target | N/A |
| Package scoping | npm workspaces: `apps/api`, `apps/web`; root `package.json` |
| Existing-binary disposition | N/A (greenfield) |
| Runtime dependencies | Node 20, NestJS 10, Angular 17, PostgreSQL 16 (docker only) |
| JSON/wire contract preservation | `GET /api/v1/health` → `{ "status": "ok" }`; error shape per STACK.md |
| Backward-compat invariant | N/A |

## Acceptance Criteria

- [ ] AC1: Root `package.json` with workspaces `["apps/api", "apps/web"]` and scripts: `dev:db`, `dev:api`, `dev:web`, `test:all`, `test:api`, `test:web`
- [ ] AC2: `docker-compose.yml` service `db` (Postgres 16); `npm run dev:db` starts it
- [ ] AC3: `apps/api` NestJS app: `GET /api/v1/health` returns 200 `{ "status": "ok" }`
- [ ] AC4: `UserEmailMiddleware` sets `req.userEmail` from `X-User-Email` or `"anonymous"`
- [ ] AC5: `apps/web` Angular 17 standalone app serves placeholder home page; `environment.development.ts` points `apiUrl` to `http://localhost:3000/api/v1`
- [ ] AC6: `.env.example` at repo root with `DATABASE_URL` (used in cycle 2; api may boot without DB connection in this cycle)
- [ ] AC7: `.github/workflows/ci.yml` runs `test:api` and `test:web` on Node 20 (api job uses Postgres service container)
- [ ] AC8: At least one unit test per app; `npm run test:all` passes locally
- [ ] AC9: README quick-start updated with real commands for db + api + web
- [ ] AC10: `.cdd/PROJECT.md` updated — build/run/test commands verified with actual output; `Last verified` date set

## Non-goals

- TypeORM entities, migrations, business modules (projects/issues/comments)
- Swagger beyond bare health (optional stub ok)
- Angular Material
- Authentication beyond header stub middleware

## Closure

All AC met; `npm run test:all` green; CI config present; branch `cycle/1`.
