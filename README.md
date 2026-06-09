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

## CDD cycles

Development follows coherence-driven development (CDD) with hub `cn-sigma`. Cycle list and contracts:

- Index: `.cdd/ISSUES.md`
- Per-cycle contract: `.cdd/issues/N/ISSUE.md`
- Dispatch: `.cdd/STACK.md` §CDD dispatch
