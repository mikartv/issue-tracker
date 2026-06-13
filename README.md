# issue-tracker

Minimal internal issue tracker (projects, issues, statuses, comments). v1 scope: `.cdd/SCOPE.md`.

## Prerequisites

- Node.js 20 LTS
- npm 10+
- Docker (for PostgreSQL 16)

## Quick start

```bash
cp .env.example .env
npm install
npm run dev:db    # Start Postgres 16 via Docker (port 5432)
npm run dev:api   # Start NestJS API in watch mode (port 3000)
npm run dev:web   # Start Angular dev server (port 4200)
npm run test:all  # Run api + web test suites
```

### API endpoints

- `GET /api/v1/health` → `{ "status": "ok" }`
- Swagger UI: `http://localhost:3000/api/docs`

## Project structure

```text
issue-tracker/
├── apps/
│   ├── api/          # NestJS REST API (/api/v1, Swagger at /api/docs)
│   └── web/          # Angular 17 SPA (standalone components)
├── .cdd/             # CDD project binding (scope, stack, issues)
├── .github/
│   └── workflows/
│       └── ci.yml    # GitHub Actions: api + web test jobs
├── docker-compose.yml
├── .env.example
└── package.json      # npm workspaces root
```

## Dev connectivity — CORS (cycle 6)

The Angular SPA (`apps/web`, port 4200) calls the NestJS API (`apps/api`, port 3000) directly using the absolute base URL `environment.apiUrl = 'http://localhost:3000/api/v1'`. Because the two servers run on different ports, the browser enforces the same-origin policy.

**Chosen approach: CORS.** `app.enableCors()` is called in `apps/api/src/main.ts` (before `app.listen`), which instructs NestJS/Express to emit the `Access-Control-Allow-Origin: *` header. This allows the Angular dev server on port 4200 to receive API responses.

A dev proxy (`proxy.conf.json`) was not used because it requires the Angular app to use a relative API URL (`/api/v1`), but `environments/environment.ts` is immutable and carries an absolute URL; changing it would violate the cycle-6 implementation contract.

### Startup sequence

```bash
npm run dev:db    # PostgreSQL 16 via Docker (port 5432)
npm run dev:api   # NestJS API — watch mode (port 3000)
npm run dev:web   # Angular dev server (port 4200)
```

Open `http://localhost:4200` and navigate to `/projects`, `/projects/:projectId/issues`, or `/issues/:issueId`.

### Auth header stub

Future cycles will pass `X-User-Email: <email>` as an HTTP header for request attribution. The `ApiService` does not send this header yet; see `.cdd/issues/` for the planned cycle.

## CDD cycles

Development follows coherence-driven development (CDD) with hub `cn-sigma`. Cycle list and contracts:

- Index: `.cdd/ISSUES.md`
- Per-cycle contract: `.cdd/issues/N/ISSUE.md`
- Dispatch: `.cdd/STACK.md` §CDD dispatch
