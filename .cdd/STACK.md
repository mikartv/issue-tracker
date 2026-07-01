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

**Cycle contracts live as GitHub Issue bodies** at `https://github.com/mikartv/issue-tracker/issues`.
δ creates each issue via `gh issue create`; the issue body is the binding contract.
Cycles 0–10 used local `.cdd/issues/N/ISSUE.md` (D-CY2-2: pre-remote era); cycle 11+ uses GitHub Issues.
Note: GitHub issue numbers start at #1 for this repo. Cycle 11 = gh #1, cycle 12 = gh #2, etc.
Mapping: gh_issue_number = cycle_number - 10.

γ/α/β dispatch prompts reference the issue via `gh issue view N`:

```text
Issue: gh issue view N         (full contract: gap, AC, non-goals — the issue body)
Branch: cycle/N
```

Cycle artifacts on branch `cycle/N`: `.cdd/unreleased/N/` (`gamma-scaffold.md`, `alpha-prompt.md`, `beta-prompt.md`, close-outs).

Project MCP: `.cdd/PROJECT.md` — verify claims against code/CI after cycle 1; update at each cycle close-out.

Default **7-axis implementation contract** for dispatch: table in §Implementation contract quick reference below. Per-cycle issue body may override or extend; axes MUST be pinned by δ in the issue body before α dispatch.

Hub: `cn-sigma` (identity/memory). Product facts stay in this repo's `.cdd/` — not in `cn-sigma/threads/`.

### γ-prompt: mandatory reads before scoping

Every γ-prompt MUST include a "Read before scoping" section with these inputs:

```text
## Skills (Tier 1a — load in order before any other step)
- ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md
- ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/gamma/SKILL.md
- ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/issue/SKILL.md
- ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md
- ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md

## Project context
- gh issue view N                          (full contract: gap, AC, non-goals)
- gh issue view N --comments               (operator clarifications, if any)
- .cdd/PROJECT.md                          (verified repo map)
- .cdd/STACK.md                            (pinned conventions + dispatch bindings)
- .cdd/iterations/INDEX.md                 (prior protocol findings, if exists)
- .cdd/releases/{last-version}/*/gamma-closeout.md  (last closed cycle)
- .cdd/SCOPE.md                            (product boundary)
```

Tier 1a skill paths are relative to the issue-tracker working directory. Skills are loaded as hard generation constraints — not post-hoc checklists. Skipping any Tier 1a file is a skill-loading gate violation (OPERATOR.md). Skipping project context risks repeating closed gaps or missing post-release MCAs.

### AC contract: UI screens

If an issue creates or modifies any component under `apps/web/src`, the AC MUST include:

- An explicit `routerLink` AC for every outbound navigation from that screen (list → detail, parent → child). Navigation is **never implied** by the existence of a screen.
- An empty-state AC for every list view (`projects = []`, `issues = []`).
- A runbook verification step (AC7-pattern): operator opens `/start`, clicks, arrives at `/destination`. Stated as concrete steps, not "navigation works".

### α-rule: runbook honesty

For any cycle that produces a runbook, smoke-test, or setup guide, α MUST:

1. Verify each step is executable from a **clean clone** given only the stated prerequisites. Check `.cdd/STACK.md §Database` and `§Dev ergonomics` for commands the runbook might omit.
2. Record the result in `alpha-closeout.md` as: "steps X, Y, Z executed — result [specific]" or "step Z could not be executed — reason [specific]".

A claim of "runbook verified" without specific step results is an honest-claim violation (severity D).

### β-rule: git identity check

β MUST run a mechanical git identity check before any other review step:

```bash
git log cycle/N --format='%ae %s'
```

Any implementation (feat/fix) commit authored by a non-α identity is an RC finding, severity D. CDD artifact commits (self-coherence updates, alpha-closeout) may be authored by α or γ per protocol.

### β-rule: CI green gate

β MUST verify CI is green on `cycle/N` before issuing APPROVE:

```bash
gh run list --branch cycle/N --limit 5
```

If the most recent run is not `completed / success`, β returns REQUEST CHANGES (D-severity, `ci-red`). Exception: if the cycle's scope is documentation-only (zero code/test changes), β notes this explicitly and may APPROVE without CI.

### β-rule: Angular ng build

For any cycle that modifies Angular component templates (`.html` files or inline template strings in `.component.ts`), β MUST run:

```bash
cd apps/web && npx ng build --configuration=production
```

and verify it exits 0 with no NG8XXX errors. A non-zero exit or any NG8XXX diagnostic is an RC finding (D-severity, `aot-build-fail`). Exception: documentation-only cycles with zero template changes.

*Rationale: Jest does not invoke the Angular AOT compiler; template property-binding errors (e.g. NG8002 binding to a directive selector) are invisible to Jest but caught by `ng build`. Cycle 19 established this gap — `[cdkDropListGroup]` escaped to main undetected (cdd-iteration.md F1).*

### α-rule: self-coherence diff counts

In `self-coherence.md §Diff scope`, derive all line counts from `git diff` at the **final committed state** — after all source edits for the cycle are committed. Never estimate; never copy from a measurement taken before a pending source edit.

Correct procedure:

```bash
git diff origin/main -- apps/web/src/app/projects/project-issues.component.ts | grep -c '^+'
git diff origin/main -- apps/web/src/app/projects/project-issues.component.ts | grep -c '^-'
```

Subtract the `^-` count from the `^+` count for the net figure. If a source edit is made after §Diff scope is written, recount before committing self-coherence.

*Rationale: Cycles 18 and 19 both had α baseline/diff-count discrepancies from estimation errors. Cycle 19's B-1 and B-2 findings consumed 2 extra review rounds for a documentation-only correction (cdd-iteration.md F3).*

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
