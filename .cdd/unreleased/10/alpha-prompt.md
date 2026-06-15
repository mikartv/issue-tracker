---
cycle: 10
role: α
artifact: alpha-prompt
---

# α Dispatch Prompt — Cycle 10

Role: α ONLY. Fresh session.

Branch: cycle/10
Issue: Read `.cdd/issues/10/ISSUE.md` from repo root (full contract: gap, AC, non-goals).
Scaffold: Read `.cdd/unreleased/10/gamma-scaffold.md` (surface map, AC oracle, expected diff scope).
Stack: Read `.cdd/STACK.md` (pinned runtime versions, conventions, required script names).
Scope: Read `.cdd/SCOPE.md` (Definition of Done, active design constraints).

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) for any code changes; Markdown for docs |
| CLI integration target | N/A — standalone web app, not a `cn` subcommand |
| Package scoping | `apps/api/`, `apps/web/`, repo root (`README.md`, `docs/`), `.cdd/PROJECT.md` |
| Existing-binary disposition | N/A |
| Runtime dependencies | Node 20, NestJS 10, Angular 17, PostgreSQL 16 (Docker Compose); no new packages in this cycle |
| JSON/wire contract preservation | `/api/v1` prefix and error shape unchanged; no new routes or schema changes in this cycle |
| Backward-compat invariant | N/A until v1 ships; this cycle is additive-documentation-only with optional decorator additions |

## Task

Implement issue #10 — Integration smoke + README polish — on branch `cycle/10`.

Work through each AC using the oracle in `gamma-scaffold.md`. Do not infer scope beyond the issue.

**AC1 — README prerequisites and scripts**
Verify README documents: Node 20, Docker, `npm run dev:db`, `npm run dev:api`, `npm run dev:web`, `npm run test:all`. All must be explicitly present. Patch if any gap found; record verification result in `self-coherence.md` even if no edit is needed.

**AC2 — `npm run test:all` passes**
Run `npm run test:all` from repo root. All suites must pass, 0 failures. Record actual test suite count and test count in `self-coherence.md`.

**AC3 — Smoke script or checklist**
Create `docs/SMOKE.md` with an operator-runnable manual checklist covering the full smoke path: create project → create issue on project → add comment → advance status through `open → in_progress → done → closed`. Every step must be executable by a fresh operator from a clean clone without chat context. Alternatively, write a supertest smoke spec at `apps/api/test/smoke.e2e.spec.ts` — if you choose that path, explain the tradeoff in `self-coherence.md`.

**AC4 — Swagger covers all v1 endpoints**
Verify `@ApiTags` and `@ApiResponse` decorator coverage across all controller files (`health`, `projects`, `issues`, `comments`). If any existing route is missing decorators, add them. Do not add new routes. Confirm all v1 routes appear in the Swagger surface.

**AC5 — No open contradictions between SCOPE, STACK, and implemented behavior**
Read `.cdd/SCOPE.md` and `.cdd/STACK.md`; read current code. List every contradiction found. Resolve or explicitly document each. Zero open unresolved contradictions → pass.

**AC6 — PROJECT.md claims verified**
Update `.cdd/PROJECT.md` to reflect the cycle 9 state: correct test counts (api + web), web component map (api.service, issue-detail, project-issues, projects-list), Angular routes, Angular Material (cycle 7), CORS (cycle 6), cycle 6–9 decisions. Verify every `✅ verified` claim against current code and README.

## Process

Write `.cdd/unreleased/10/self-coherence.md` incrementally per the large-file authoring rule (one section at a time; commit each section before moving to the next). Commit to branch `cycle/10` with identity `Alpha <alpha@issue-tracker.cdd.cnos>`.

Signal review-readiness by committing a final `self-coherence.md` update with §Review readiness populated.
