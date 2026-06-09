# issue-tracker

Minimal internal issue tracker (projects, issues, statuses, comments). v1 scope: `.cdd/SCOPE.md`.

## Prerequisites

- Node.js 20 LTS
- npm 10+
- Docker (for PostgreSQL 16)

## Quick start

Application code lands in cycle 1+. After scaffold:

```bash
cp .env.example .env
npm install
npm run dev:db    # Postgres via Docker
npm run dev:api   # NestJS API (port 3000)
npm run dev:web   # Angular dev server
npm run test:all  # api + web tests
```

## Project structure

```text
issue-tracker/
├── apps/
│   ├── api/          # NestJS REST API
│   └── web/          # Angular SPA
├── .cdd/             # CDD project binding (scope, stack, issues)
├── docker-compose.yml
└── package.json      # npm workspaces root
```

## CDD cycles

Development follows coherence-driven development (CDD) with hub `cn-sigma`. Cycle list and contracts:

- Index: `.cdd/ISSUES.md`
- Per-cycle contract: `.cdd/issues/N/ISSUE.md`
- Dispatch: `.cdd/STACK.md` §CDD dispatch
