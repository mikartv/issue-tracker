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
