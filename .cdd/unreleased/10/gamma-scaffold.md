---
cycle: 10
issue: "#10 — Integration smoke + README polish"
role: γ
artifact: gamma-scaffold
---

# γ Scaffold — Cycle 10

## Issue

#10 — Integration smoke + README polish

## Mode

substantial

## Selection rationale

Selected under `cnos.cds/skills/cds/CDS.md` §Selection function → assessment-commitment default: cycle 9 `gamma-closeout.md` explicitly committed to #10 as next MCA ("Issue #10 — Integration smoke + README polish is the natural next cycle"). All prior cycles (1–9) complete on main. No P0 override or operational-infrastructure override present.

## Peer enumeration (§2.2a)

Directories named by issue impact graph scanned before authoring this scaffold.

### docs/SMOKE.md

`find . -name "SMOKE.md"` → no matches. Does not exist. AC3 requires creating it (or a supertest smoke suite covering the same path).

### README.md

Exists at repo root. Current content covers: prerequisites (Node 20 LTS, npm 10+, Docker), quick-start commands (`dev:db`, `dev:api`, `dev:web`, `test:all`), project structure, CORS section, startup sequence, auth header stub note. Partially satisfies AC1 — α must verify each SCOPE DoD item is present and patch any gap found.

### Swagger setup

`apps/api/src/main.ts` confirms `DocumentBuilder` + `SwaggerModule.setup('api/docs', app, document)` at `/api/docs`. Swagger endpoint exists. AC4 requires verifying all v1 endpoints appear — controller decorator coverage may be incomplete; α must verify each module (`health`, `projects`, `issues`, `comments`) against live or decorator-grep evidence.

### Test files (enumerated)

API: `migration.integration.spec.ts`, `health/health.controller.spec.ts`, `middleware/user-email.middleware.spec.ts`, `projects/projects.e2e.spec.ts`, `projects/projects.service.spec.ts`, `issues/issues.e2e.spec.ts`, `issues/issues.service.spec.ts`, `comments/comments.e2e.spec.ts`, `comments/comments.service.spec.ts`

Web: `app/app.component.spec.ts`, `app/api/api.service.spec.ts`, `app/issues/issue-detail.component.spec.ts`, `app/projects/projects-list.component.spec.ts`, `app/projects/project-issues.component.spec.ts`

Root script `test:all` = `npm run test:api && npm run test:web` (confirmed in `package.json`). PROJECT.md last updated cycle 5 with stale counts (76 api + 2 web). α must run `npm run test:all` and record actual counts for AC2 and AC6.

### PROJECT.md last verified

Cycle 5 (2026-06-13). Web components added in cycles 6–9 are absent from the repo map. Angular Material (cycle 7), cycle 6 CORS decision, cycle 7–9 web components, and cycle 9 test counts are all missing. AC6 requires a full update pass to cycle 9 state.

### SCOPE DoD items

| Item | Source | Current state |
|------|--------|---------------|
| `docker compose up -d db` starts Postgres | SCOPE.md | `dev:db` script exists; Docker Compose confirmed |
| `npm run test:all` passes | SCOPE.md | script exists; actual pass must be verified |
| Manual smoke: create project → issue → comment → status through full workflow | SCOPE.md | no `docs/SMOKE.md` exists |
| Swagger documents all v1 endpoints | SCOPE.md | endpoint configured; coverage unverified |
| README documents db, api, web startup | SCOPE.md | README exists; needs verification against checklist |

## Surfaces α is expected to touch

1. `docs/SMOKE.md` — create (AC3 primary deliverable)
2. `README.md` — verify against AC1 checklist; patch if any item is absent or unclear
3. `apps/api/src/{health,projects,issues,comments}/` — verify `@ApiTags` / `@ApiResponse` decorator coverage for AC4; add missing decorators only (no new routes)
4. `.cdd/PROJECT.md` — update to cycle 9 state: test counts, web component map, Angular routes, cycle 6–9 decisions (AC6)

If README already satisfies AC1 in full, no edit is required — α records verification result in `self-coherence.md`.

## AC oracle approach

| AC | Oracle method |
|----|---------------|
| AC1 | Read README against SCOPE DoD list: Node 20, Docker, `dev:db`, `dev:api`, `dev:web`, `test:all`. All 6 items explicitly present → pass. |
| AC2 | Run `npm run test:all` from repo root; all suites pass, 0 failures → pass. Record suite count and test count in `self-coherence.md`. |
| AC3 | `docs/SMOKE.md` exists with operator-runnable steps covering: create project, create issue on project, add comment to issue, advance status through `open → in_progress → done → closed`. No chat context needed. |
| AC4 | Grep `@ApiTags` / `@ApiResponse` across all controllers; cross-check against route count per module. OR start API + Postgres and confirm `/api/docs` renders all v1 routes. Zero missing endpoints → pass. |
| AC5 | Read SCOPE.md and STACK.md; read current code. List contradictions found. Zero open (unresolved) contradictions → pass. |
| AC6 | Read `.cdd/PROJECT.md`; diff against actual code and README state at cycle 9. All verified-command rows, repo map entries, entry points, and decisions current → pass. |

## Expected diff scope

- **New:** `docs/SMOKE.md`
- **Modified:** `.cdd/PROJECT.md` (cycle 9 update — test counts, component map, decisions)
- **Possibly modified:** `README.md` (only if AC1 gap found)
- **Possibly modified:** controller files in `apps/api/src/` (only if AC4 decorator gap found)
- No new API routes, no schema changes, no npm packages, no migration files
