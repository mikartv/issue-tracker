# Stack & conventions — issue-tracker

Pinned decisions below are **not optional**. α MUST NOT choose alternatives unless a cycle `ISSUE.md` explicitly rescopes.

## Runtime versions

| Tool | Version |
|------|---------|
| Node.js | 20 LTS |
| npm | 10+ (bundled with Node 20) |
| PostgreSQL | 16 |
| NestJS | 10.x |
| Angular | 17.x |
| TypeScript | 5.x, `strict: true` in both apps |

## Monorepo layout

```text
issue-tracker/
├── apps/
│   ├── api/              # NestJS
│   └── web/              # Angular
├── docker-compose.yml
├── .env.example
├── package.json          # npm workspaces root (required)
├── package-lock.json
└── .cdd/
```

**Monorepo tool:** npm workspaces in root `package.json`:

```json
{ "workspaces": ["apps/api", "apps/web"] }
```

Do not use Nx, pnpm workspaces, or separate unlinked repos in v1.

## Backend (NestJS)

- **Modules:** `health`, `projects`, `issues`, `comments` (business modules land in cycles 3–5; scaffold cycle creates `health` only)
- **ORM:** TypeORM + explicit migrations in `apps/api/src/migrations/`
- **Schema sync:** `synchronize: false` always (dev, test, prod)
- **Validation:** `class-validator` + `class-transformer`; global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`
- **Config:** `@nestjs/config`; load `.env` from repo root
- **API prefix:** `/api/v1` (global prefix in `main.ts`)
- **Swagger:** `@nestjs/swagger` at `/api/docs` (not under `/api/v1`)
- **Tests:** Jest in `apps/api`; e2e with supertest against a test Postgres (GitHub Actions service container or docker)
- **Auth stub:** `UserEmailMiddleware` (or guard) reads `X-User-Email`; exposes `req.userEmail: string` (default `"anonymous"`). Scaffold cycle adds middleware; business cycles use it for comment author.

### Error response shape

All non-2xx responses use JSON:

```json
{
  "statusCode": 400,
  "message": "Human-readable summary",
  "error": "Bad Request"
}
```

Validation errors may use Nest's default array form for `message`. Do not invent a custom envelope per module.

### Enum storage

Status and priority stored as `varchar` columns with TypeORM enum types in code. Postgres CHECK constraints optional but not required in v1.

## Frontend (Angular)

- **Components:** standalone only (no NgModules for feature code)
- **UI library:** plain HTML + minimal component CSS in cycles 6–8; **Angular Material** introduced in cycle 7 only (issues list + project views)
- **HTTP:** `HttpClient` → `environment.apiUrl` (default `http://localhost:3000/api/v1`)
- **Routing:**
  - `/projects` — project list
  - `/projects/:projectId/issues` — issues for project
  - `/issues/:issueId` — issue detail + comments
- **Environments:** `apps/web/src/environments/environment.ts` and `environment.development.ts`
- **Tests:** Jest in `apps/web` (not Karma/Jasmine)

## Database

- PostgreSQL 16 service named `db` in `docker-compose.yml`
- Dev: `docker compose up -d db`
- Connection: `DATABASE_URL=postgresql://issue_tracker:issue_tracker@localhost:5432/issue_tracker` in `.env`
- Migrations: `npm run migration:run -w apps/api` (script defined in cycle 1/2)

## Dev ergonomics

- `.env.example` committed at repo root; `.env` gitignored
- Root `package.json` scripts (required names):

| Script | Action |
|--------|--------|
| `dev:db` | `docker compose up -d db` |
| `dev:api` | start NestJS API via ts-node (no auto-reload) |
| `dev:web` | start Angular dev server |
| `test:all` | run api + web test suites |
| `test:api` | api tests only |
| `test:web` | web tests only |

- README at repo root documents the three startup commands (db, api, web)
- ESLint + Prettier in both apps
- Branch per cycle: `cycle/N` matching issue ID

## CDD dispatch (cnos + cn-sigma)

This project does **not** mirror cycles to GitHub Issues. Contracts live at `.cdd/issues/N/ISSUE.md`.

γ/α/β dispatch prompts MUST reference the local file — **not** `gh issue view`:

```text
Issue: Read `.cdd/issues/N/ISSUE.md` from repo root (full contract: gap, AC, non-goals)
Branch: cycle/N
```

Cycle artifacts on branch `cycle/N`: `.cdd/unreleased/N/` (`gamma-scaffold.md`, `alpha-prompt.md`, `beta-prompt.md`, close-outs).

Project MCP: `.cdd/PROJECT.md` — verify claims against code/CI after cycle 1; update at each cycle close-out.

Default **7-axis implementation contract** for dispatch: table in §Implementation contract quick reference below. Per-cycle `ISSUE.md` may override or extend; empty rows MUST be filled by δ from defaults before α dispatch.

Hub: `cn-sigma` (identity/memory). Product facts stay in this repo's `.cdd/` — not in `cn-sigma/threads/`.

## CI (delivered in Issue 1)

GitHub Actions workflow `.github/workflows/ci.yml`:

- Trigger: push + pull_request to `main`
- Job `api`: Node 20, Postgres service container, `npm run test:api`
- Job `web`: Node 20, `npm run test:web`
- Both jobs run lint if configured in scaffold

## Implementation contract quick reference (7 axes)

For γ dispatch prompts — default pinned values for this repo:

| Axis | Pinned value |
|------|--------------|
| Language | TypeScript (strict) |
| CLI integration target | N/A (standalone web app, not `cn` subcommand) |
| Package scoping | `apps/api/`, `apps/web/`, root workspace |
| Existing-binary disposition | N/A (greenfield) |
| Runtime dependencies | Node 20, NestJS 10, Angular 17, TypeORM, PostgreSQL 16 |
| JSON/wire contract preservation | `/api/v1` prefix; error shape above; UUID string IDs |
| Backward-compat invariant | N/A until v1 ships; thereafter additive-only changes |
