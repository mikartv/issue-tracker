---
cycle: 6
role: α
issue: "#6 — Angular shell + API client"
mode: design-and-build
---

# Self-coherence — Cycle 6

## §Gap

**Issue:** #6 — Angular shell + API client  
**Mode:** design-and-build (small-change band: 6 ACs, single-app scope, no new infrastructure)  
**Version:** cycle/6 branch  

**Gap framing:** Angular SPA shell existed as a bare scaffold (empty routes, no HttpClient, no API service) after cycle 1. Cycles 2–5 built the complete NestJS API. Cycle 6 bridges them: routing, typed HTTP client, placeholder feature components, dev connectivity.

---

## §Skills

**Tier 1 (CDD lifecycle):**
- `cnos.cdd/skills/cdd/alpha/SKILL.md` — α role contract (loaded, governs this work)
- `CDD.md` — canonical lifecycle

**Tier 2 (engineering):**
- TypeScript strict mode (`strict: true` in `apps/web/tsconfig.json`) — no `any`, no `as unknown as X` casts
- Angular 17 standalone component conventions, new `@if`/`@else` control flow syntax
- `@angular/common/http` — `HttpClient`, `provideHttpClient`, `provideHttpClientTesting`

**Tier 3 (issue-specific):**
- Angular 17 routing: `provideRouter`, `Routes`, `RouterOutlet`
- Jest + `jest-preset-angular` test harness (existing setup preserved)
- NestJS CORS: `app.enableCors()` (single-call API surface)

---

## §ACs

Per-AC oracles run against implementation SHA `c3b5943`.

| AC | Criterion | Evidence | Status |
|----|-----------|----------|--------|
| AC1 | Routes configured: `/projects`, `/projects/:projectId/issues`, `/issues/:issueId` | `apps/web/src/app/app.routes.ts` — three `{ path, component }` entries: `'projects'→ProjectsListComponent`, `'projects/:projectId/issues'→ProjectIssuesComponent`, `'issues/:issueId'→IssueDetailComponent` | ✅ PASS |
| AC2 | Shared `ApiService` using `HttpClient` + `environment.apiUrl` | `apps/web/src/app/api/api.service.ts` — `HttpClient` injected; `private readonly base = environment.apiUrl`; typed methods `getProjects(): Observable<Project[]>`, `getIssues(projectId: string): Observable<Issue[]>`, `getIssue(issueId: string): Observable<Issue>` | ✅ PASS |
| AC3 | Dev proxy or CORS configured; documented in README | CORS approach: `app.enableCors()` added to `apps/api/src/main.ts` before `app.listen`. README §"Dev connectivity — CORS (cycle 6)" documents choice, rationale, and startup sequence | ✅ PASS |
| AC4 | Placeholder pages show loading/error states | All three components contain `loading = true` and `error: string \| null = null`. Templates use Angular 17 `@if (loading)` / `@else if (error)` / `@else` blocks. Files: `projects-list.component.ts`, `project-issues.component.ts`, `issue-detail.component.ts` | ✅ PASS |
| AC5 | Unit tests for API service (mock HttpClient); `npm run test:web` exits 0 | `apps/web/src/app/api/api.service.spec.ts` — 4 tests using `provideHttpClient()` + `provideHttpClientTesting()` + `HttpTestingController`; covers happy path for all 3 methods. Runner output: 6 total tests passed (2 existing + 4 new); exit 0 | ✅ PASS |
| AC6 | No Angular Material imports | `grep -r "@angular/material" apps/web/` → no matches | ✅ PASS |

---

## §Self-check

**Did α push ambiguity onto β?** No. Every AC maps to a concrete file and line. No "should work" or untested claims.

**Connectivity choice documented?** Yes. CORS was chosen over proxy because `environments/environment.ts` is immutable and carries an absolute URL (`http://localhost:3000/api/v1`); a dev proxy only intercepts relative-path requests routed through the Angular dev server. Using CORS keeps environments untouched and is the only functionally correct approach. This is documented in README and in `self-coherence.md §ACs AC3`.

**Implementation contract compliance:**
- Language: TypeScript strict — no `any`, no `as unknown as X` casts in any new file ✅
- Package scoping: all new source under `apps/web/src/app/` ✅
- No new `package.json` dependencies ✅
- `apps/api/src/` — only `main.ts` touched (one line: `app.enableCors()`), as explicitly allowed ✅
- `apps/web/src/environments/` — zero diff ✅
- `apps/web/src/app/app.component.ts` — zero diff ✅
- Existing 2 web tests still pass ✅
- No Angular Material ✅

**Caller-path trace for new modules:**
- `ApiService` (`api.service.ts`) — tested directly via `api.service.spec.ts`; called from routes at runtime via Angular DI; cycle 7–9 components will inject it
- `ProjectsListComponent` — registered in `app.routes.ts` at path `'projects'`; `RouterOutlet` in `app.component.ts` resolves it at runtime
- `ProjectIssuesComponent` — registered at `'projects/:projectId/issues'`
- `IssueDetailComponent` — registered at `'issues/:issueId'`
- All 3 components are reachable via `app.routes.ts` → `provideRouter(routes)` in `main.ts`

---

## §Debt

**No blocking debt.** All 6 ACs are fully satisfied.

**Known non-blocking items:**
1. Placeholder components start with `loading = true` but never resolve. A real data-fetch will be wired in cycles 7–9 (declared non-goal in issue #6).
2. `X-User-Email` auth header is not yet sent; README documents this as an optional future stub (declared non-goal in issue #6).
3. `app.enableCors()` uses the NestJS default (all origins, all methods). A restricted CORS policy (origin whitelist) should be added before production deployment, but is out of scope for local dev.

---

## §CDD Trace

### Step 1 — Issue received and read
Issue #6 read in full: gap, 6 ACs, non-goals, closure criterion. γ scaffold (`gamma-scaffold.md`) read. All named artifacts loaded before coding.

### Step 2 — Branch
`cycle/6` checked out as dispatched. Branch created by γ (commit `de1ff9f`). α did not create a new branch.

### Step 3 — Active skills
Tier 1: `alpha/SKILL.md`, `CDD.md`. Tier 2: TypeScript strict, Angular 17, jest-preset-angular. Tier 3: HttpClient, NestJS CORS.

### Step 4 — Design
Not required. Issue scope is additive and fully specified: 3 routes, 1 service, 3 components, 1 CORS/proxy choice. No architectural ambiguity.

### Step 5 — Plan
Not required. Implementation ordering is unambiguous: types/service → components → routes → providers → connectivity → tests → docs.

### Step 6 — Artifacts produced

All new files added in commit `c3b5943`:

| File | Purpose | AC |
|------|---------|-----|
| `apps/web/src/app/api/api.service.ts` | Typed HttpClient wrapper; `getProjects`, `getIssues`, `getIssue`; `environment.apiUrl` base | AC2 |
| `apps/web/src/app/api/api.service.spec.ts` | 4 unit tests via `provideHttpClientTesting` | AC5 |
| `apps/web/src/app/projects/projects-list.component.ts` | Standalone; `@if (loading)` / `@else if (error)` / `@else` | AC1, AC4 |
| `apps/web/src/app/projects/project-issues.component.ts` | Standalone; loading + error states | AC1, AC4 |
| `apps/web/src/app/issues/issue-detail.component.ts` | Standalone; loading + error states | AC1, AC4 |

Modified files:

| File | Change | AC |
|------|--------|-----|
| `apps/web/src/app/app.routes.ts` | 3 routes replacing empty array | AC1 |
| `apps/web/src/main.ts` | `provideHttpClient()` added to providers | AC2 |
| `apps/api/src/main.ts` | `app.enableCors()` before `app.listen` | AC3 |
| `README.md` | Dev connectivity section: startup sequence, CORS rationale, auth stub note | AC3 |

CDD-dir files (on branch, not new implementation):
- `.cdd/unreleased/6/gamma-scaffold.md` — written by γ
- `.cdd/unreleased/6/alpha-prompt.md`, `beta-prompt.md` — written by γ
- `.cdd/unreleased/6/self-coherence.md` — this file (α)

### Step 7 — Self-coherence
Sections §Gap, §Skills, §ACs, §Self-check, §Debt written and committed incrementally. Every AC mapped to file+line evidence. No ambiguity pushed to β.
