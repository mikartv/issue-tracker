# Project MCP — issue-tracker

**Last verified:** 2026-06-09 (docs-only; code claims unverified until cycle 1)  
**Verify with:** `npm run test:all` (after cycle 1)

## Build / run / test

| Command | Purpose | Status |
|---------|---------|--------|
| `npm run dev:db` | Start Postgres 16 via Docker | cycle 1 |
| `npm run dev:api` | NestJS watch mode | cycle 1 |
| `npm run dev:web` | Angular dev server | cycle 1 |
| `npm run test:all` | api + web test suites | cycle 1 |

Update this table with verified output after each cycle close-out.

## Repo map

| Path | Role |
|------|------|
| `apps/api/` | NestJS REST API (`/api/v1`, Swagger at `/api/docs`) |
| `apps/web/` | Angular 17 SPA |
| `.cdd/SCOPE.md` | Product boundary |
| `.cdd/STACK.md` | Stack pins, CDD dispatch binding |
| `.cdd/ISSUES.md` | Cycle index |
| `.cdd/issues/N/ISSUE.md` | Per-cycle dispatch contract |

## Entry points

| Surface | Entry | Cycle |
|---------|-------|-------|
| API | `apps/api/src/main.ts` | 1 |
| Web | `apps/web/src/main.ts` | 1 |
| Migrations | `apps/api/src/migrations/` | 2 |

## CI / local parity

GitHub Actions `.github/workflows/ci.yml` — cycle 1. Verify local `npm run test:all` matches CI jobs.

## Conventions

See `.cdd/STACK.md`. Branch per cycle: `cycle/N`. Cycle artifacts: `.cdd/unreleased/N/` on same branch.

## Decisions (append-only, short)

- 2026-06-09: Greenfield; contracts in `.cdd/` before code. Issues local (not GitHub Issues). Hub: cn-sigma.

## Known unknowns / debt

- No application code yet — all build/run claims above are planned, not verified.
- CORS vs Angular dev proxy — decided in cycle 6.
