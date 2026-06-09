# β Dispatch — Cycle 1

```
You are β. Project: issue-tracker.
Load ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md and follow its load order.
Issue: Read .cdd/issues/1/ISSUE.md from repo root (full contract: gap, AC, non-goals).
Branch: cycle/1
```

## Context for δ

- Allowed tools: `--allowedTools "Read,Write,Bash"`
- Git identity for β commits: `Beta <beta@issue-tracker.cdd.cnos>`
- β dispatched after α signals review-readiness: look for the review-readiness section at the end of `.cdd/unreleased/1/self-coherence.md` on `origin/cycle/1`.
- β writes review passes incrementally to `.cdd/unreleased/1/beta-review.md`, committing + pushing after each pass.
- On APPROVE: β merges `cycle/1` into `main` (`git merge --no-ff cycle/1`), then writes `.cdd/unreleased/1/beta-closeout.md`.
- Working directory: repo root of `issue-tracker` (`/home/mihail/Projects/usurobor/issue-tracker`).
- HUB (skill source): `../cn-sigma` relative to repo root (or `/home/mihail/Projects/usurobor/cn-sigma`).

## What β must review

α creates the full monorepo skeleton. The diff will contain:

**New files (expected 30–55 total):**
- `package.json` — npm workspaces root: `["apps/api","apps/web"]`; 6 required scripts
- `docker-compose.yml` — service `db` using `postgres:16`
- `.env.example` — `DATABASE_URL=postgresql://issue_tracker:issue_tracker@localhost:5432/issue_tracker`
- `.github/workflows/ci.yml` — `api` job (Node 20 + postgres service) + `web` job (Node 20)
- `apps/api/**` — NestJS 10 scaffold: `main.ts`, `app.module.ts`, `health/` module, `UserEmailMiddleware`, tsconfig, jest config, package.json
- `apps/web/**` — Angular 17 standalone scaffold: placeholder home component, `environments/environment.ts`, `environments/environment.development.ts`, tsconfig, jest config, package.json

**Modified files:**
- `README.md` — quick-start section with `dev:db`, `dev:api`, `dev:web` commands
- `.cdd/PROJECT.md` — build/run/test commands verified; `Last verified` date updated

## AC verification oracles

| AC | Oracle | Pass condition |
|----|--------|---------------|
| AC1 | `cat package.json \| jq '.workspaces, .scripts \| keys'` | workspaces = `["apps/api","apps/web"]`; scripts keys include all 6 names |
| AC2 | `cat docker-compose.yml` | service named `db` uses `postgres:16`; `dev:db` script = `docker compose up -d db` |
| AC3 | Read `apps/api/src/health/*.ts` + `apps/api/src/main.ts` | GET handler returns `{ status: 'ok' }`; global prefix `/api/v1` set in `main.ts`; response code 200 |
| AC4 | `rg UserEmailMiddleware apps/api/src/` | middleware reads `X-User-Email` header, sets `req.userEmail`, defaults to `"anonymous"`; wired in AppModule |
| AC5 | `cat apps/web/src/environments/environment.development.ts` | `apiUrl: 'http://localhost:3000/api/v1'` present |
| AC6 | `cat .env.example` | `DATABASE_URL=postgresql://...` line present |
| AC7 | `cat .github/workflows/ci.yml` | `api` job: Node 20 + postgres service container + `npm run test:api`; `web` job: Node 20 + `npm run test:web`; trigger: push + PR to main |
| AC8 | Read self-coherence.md §ACs + test files | actual `npm run test:all` output pasted (exit 0); ≥1 test file per app in diff |
| AC9 | `rg 'dev:db\|dev:api\|dev:web' README.md` | all three command names present in quick-start section |
| AC10 | `head -5 .cdd/PROJECT.md` | `Last verified` date = cycle 1 date; build/run/test table populated with real commands |

## Implementation contract verification (Rule 7)

β verifies the diff against every pinned axis before APPROVE:

| Axis | Verification |
|------|-------------|
| Language | All new source files are `.ts`; both `tsconfig.json` have `"strict": true` |
| CLI integration target | No `cn` subcommand or binary; web app only |
| Package scoping | `apps/api/` and `apps/web/` declared in root `package.json` workspaces |
| Existing-binary disposition | N/A (greenfield); no deletions of prior code |
| Runtime dependencies | NestJS 10.x in `apps/api/package.json`; Angular 17.x in `apps/web/package.json`; postgres:16 in docker-compose; Jest in both |
| Wire contract | Health endpoint code returns exactly `{ "status": "ok" }` with HTTP 200; global prefix `/api/v1` confirmed |
| Backward-compat | N/A (greenfield) |

Non-conformance on any axis → REQUEST CHANGES, severity D, classification `implementation-contract`.

## Release note

This is a substantial code cycle. After APPROVE and merge:
- β does NOT run `scripts/release.sh`, bump `VERSION`, or push any tag — δ owns the release boundary.
- β writes `.cdd/unreleased/1/beta-closeout.md` (review summary, implementation assessment, process observations).
- Merge command: `git fetch origin main && git checkout main && git merge --no-ff cycle/1 -m "feat: monorepo scaffold + docker + CI (closes issue 1)"`.

## Dispatch note

δ: dispatch β with `claude -p` in the `issue-tracker` repo root after α's review-readiness signal appears on `origin/cycle/1`. The diff is large (30–55 files); β should write review passes incrementally — at minimum: (1) contract integrity + implementation contract, (2) AC-by-AC coverage, (3) overall verdict — committing after each pass to avoid session timeout. Pull `origin/main` synchronously before computing the review-diff base for each review pass.
