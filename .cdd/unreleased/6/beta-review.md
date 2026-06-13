---
cycle: 6
role: β
issue: "#6 — Angular shell + API client"
round: 1
branch: cycle/6
main_sha: fafc028e4f5d0faa6f31fda20778ab755c5847c2
branch_head: 933165cb2fe5fb1b7edb91bb4283c6b5fab5a6a6
impl_sha: c3b5943
date: 2026-06-13
---

# β Review — Cycle 6

**Verdict:** APPROVED

**Round:** 1  
**Fixed this round:** n/a (first and final round)  
**Branch CI state:** provisional — local-only repo; no remote CI configured; web tests green locally (6/6 at impl SHA `c3b5943`)  
**Merge instruction:** `git merge --no-ff cycle/6 -m "feat: angular shell + api client (closes issue 6)"`

---

## §2.0.0 Contract Integrity

| Check | Result | Notes |
|---|---|---|
| Status truth preserved | yes | All 6 ACs marked ✅ PASS in self-coherence.md; code evidence matches claims |
| Canonical sources/paths verified | yes | STACK.md §Frontend matches routes, no Angular Material, standalone-only confirmed |
| Scope/non-goals consistent | yes | Full UI deferred to cycles 7–9; auth header stub deferred; both declared non-goals in issue |
| Constraint strata consistent | yes | CORS approach rationalized against environment.ts immutability; proxy correctly eliminated |
| Exceptions field-specific/reasoned | yes | `app.enableCors()` — only allowed api/src edit this cycle; documented in README + self-coherence §Self-check |
| Path resolution base explicit | yes | All file references in self-coherence §ACs and §CDD Trace are repo-root-relative and verified |
| Proof shape adequate | yes | Each AC has file+line evidence; test runner output cited |
| Cross-surface projections updated | yes | README updated; self-coherence §CDD Trace step 6 enumerates all artifacts |
| No witness theater / false closure | yes | AC5 oracle: test count stated (6 passed); AC6 oracle: grep result stated (no matches) |
| PR body matches branch files | n/a | No PR body; self-coherence.md is the artifact record; all files listed match diff |
| γ artifacts present (gamma-scaffold.md) | yes | `.cdd/unreleased/6/gamma-scaffold.md` confirmed present on branch; §5.1 canonical dispatch |

---

## §2.0 Issue Contract

### AC Coverage

| # | AC | In diff? | Status | Notes |
|---|----|----------|--------|-------|
| AC1 | Routes: `/projects`, `/projects/:projectId/issues`, `/issues/:issueId` | yes | PASS | `app.routes.ts` lines 7–9: three path+component entries confirmed by read |
| AC2 | ApiService: HttpClient + environment.apiUrl; getProjects/getIssues/getIssue → Observable | yes | PASS | `api.service.ts`: `HttpClient` injected (line 30); `private readonly base = environment.apiUrl` (line 28); all 3 methods typed `Observable<...>` |
| AC3 | Dev proxy or CORS; documented in README | yes | PASS | CORS: `app.enableCors()` in `apps/api/src/main.ts` line 27; README §"Dev connectivity — CORS (cycle 6)" documents choice + rationale + startup sequence |
| AC4 | Placeholder pages: loading + error states | yes | PASS | All 3 components: `loading = true`, `error: string \| null = null`; templates use `@if (loading)` / `@else if (error)` / `@else` blocks |
| AC5 | Unit tests for ApiService (mock HttpClient); npm run test:web exits 0 | yes | PASS | `api.service.spec.ts`: 4 tests using `provideHttpClientTesting()` + `HttpTestingController`; `npm run test:web` → 6 passed, exit 0 |
| AC6 | No Angular Material imports | n/a | PASS | `grep -r "@angular/material" apps/web/` → no matches |

### Named Doc Updates

| Doc / File | In diff? | Status | Notes |
|------------|----------|--------|-------|
| README.md — startup sequence + CORS | yes | present | §"Dev connectivity — CORS (cycle 6)" section added; startup sequence in quick start retained |
| self-coherence.md | yes | present | Written by α; §CDD Trace through step 7; review-readiness signal present |

### CDD Artifact Contract

| Artifact | Required? | Present? | Notes |
|----------|-----------|----------|-------|
| gamma-scaffold.md | yes | yes | Present at `.cdd/unreleased/6/gamma-scaffold.md` (authored by γ, commit `de1ff9f`) |
| alpha-prompt.md | yes | yes | Present at `.cdd/unreleased/6/alpha-prompt.md` |
| beta-prompt.md | yes | yes | Present at `.cdd/unreleased/6/beta-prompt.md` |
| self-coherence.md | yes | yes | Present; review-readiness section complete |
| beta-review.md | yes | yes (this file) | Being written now |

### Active Skill Consistency

| Skill | Required by | Applied? | Notes |
|-------|-------------|----------|-------|
| TypeScript strict | STACK.md, impl contract | yes | `tsconfig.json` has `"strict": true`; no implicit any, no `as unknown as` casts in new files |
| Angular 17 standalone | STACK.md §Frontend | yes | All 3 components: `standalone: true`; no NgModule usage |
| Angular 17 `@if`/`@else` control flow | §ACs AC4 | yes | All 3 component templates use new control flow syntax |
| `provideHttpClient` / `provideHttpClientTesting` | AC2, AC5 | yes | `main.ts` line 8: `provideHttpClient()`; spec file uses `provideHttpClientTesting()` |

---

## §2.1 Implementation Review

### Critical Checks (per dispatch contract)

| # | Check | Evidence | Result |
|---|-------|----------|--------|
| 1 | `provideHttpClient` in `main.ts` | `apps/web/src/main.ts` line 8: `providers: [provideRouter(routes), provideHttpClient()]` | PASS |
| 2 | No NgModule in new component files | `grep -r "NgModule" apps/web/src/app/` → no matches | PASS |
| 3 | No Angular Material | `grep -r "@angular/material" apps/web/` → no matches | PASS |
| 4 | Route completeness — all 3 paths | `app.routes.ts` lines 7–9: `'projects'`, `'projects/:projectId/issues'`, `'issues/:issueId'` | PASS |
| 5 | Loading + error states in all 3 components | All 3 files confirmed by read: `loading = true`, `error: string \| null = null`, both states in template | PASS |
| 6 | api/ blast radius — only main.ts changed | `git diff main..cycle/6 -- apps/api/src/` → only `main.ts` (+1 line: `app.enableCors()`); documented in README + self-coherence | PASS |
| 7 | Proxy wiring — N/A | CORS chosen; no proxy.conf.json; no angular.json `proxyConfig` entry — consistent with CORS approach; README and self-coherence explain why proxy was eliminated | PASS |
| 8 | ApiService URL construction | `api.service.ts` line 28: `private readonly base = environment.apiUrl`; no hardcoded `localhost:3000` in service (grep confirms); hardcoded URL in spec tests is correct (tests verify the concrete URL the environment resolves to) | PASS |

### Implementation Contract Verification (7 axes)

| Axis | Pinned value | Diff conforms? | Evidence |
|------|-------------|----------------|----------|
| Language | TypeScript strict | yes | `tsconfig.json` `"strict": true`; no `any` or `as unknown as` in new files |
| CLI integration target | N/A (standalone web app) | yes | No new binary entrypoints; purely Angular app additions |
| Package scoping | `apps/api/`, `apps/web/`, root workspace | yes | All new source under `apps/web/src/app/`; no new npm deps in any package.json |
| Existing-binary disposition | N/A (greenfield) | yes | `apps/api/src/` — only `main.ts` touched (one line CORS); `apps/web/src/environments/` zero-diff; `app.component.ts` zero-diff |
| Runtime dependencies | Node 20, NestJS 10, Angular 17 | yes | No new runtime packages added; no `@angular/material`; `provideHttpClient` is from existing `@angular/common/http` |
| Wire contract preservation | `/api/v1` prefix; UUID string IDs | yes | `environment.apiUrl = 'http://localhost:3000/api/v1'` unchanged; API routes unmodified; service uses `${base}/projects`, `${base}/projects/${id}/issues`, `${base}/issues/${id}` |
| Backward-compat invariant | Existing tests pass | yes | `app.component.spec.ts` 2 existing tests still pass; confirmed by `npm run test:web` output: 6 passed (2 + 4) |

### Honest-Claim Verification (rule 3.13)

| Claim | Source | Verification |
|-------|--------|--------------|
| "6 total tests passed" | self-coherence §ACs AC5 | Independently reproduced: `npm run test:web` → "Tests: 6 passed, 6 total" |
| `environment.apiUrl` is the HTTP base | self-coherence §ACs AC2 | `api.service.ts` line 28: `private readonly base = environment.apiUrl` confirmed by read |
| Only `main.ts` touched in `apps/api/src/` | self-coherence §Self-check | `git diff main..cycle/6 -- apps/api/src/` confirms one-line change only |
| `app.component.ts` zero-diff | self-coherence §Self-check | `git diff main..cycle/6 -- apps/web/src/app/app.component.ts` → empty output |
| No Angular Material | self-coherence §ACs AC6 | `grep -r "@angular/material" apps/web/` → no matches confirmed by β grep |

### CI Status (rule 3.10)

Local-only repository — no remote configured; no GitHub Actions runs exist. The CI workflow (`.github/workflows/ci.yml`) defines two jobs (`api` + `web`) triggered on push/pull_request to `main`. Because there is no remote, no branch protection rules are configured and no required workflows exist. Fallback per rule 3.10: "every workflow that runs on cycle branch" — none have run. The web-tier tests (the self-contained contract validator for this cycle) were run directly: `npm run test:web` → exit 0, 6 passed. This is the maximum CI verification achievable in this environment. α's self-coherence §Review-readiness gate 10 documents the same constraint. Verdict: provisional; no blocking CI finding.

---

## Findings

| # | Finding | Evidence | Severity | Type |
|---|---------|----------|----------|------|
| — | No findings | — | — | — |

Zero findings at any severity.

---

## Notes

- STACK.md §Frontend confirms "Angular Material introduced in cycle 7 only" — AC6 prohibition is correctly scoped to cycle 6 and satisfied.
- CORS rationale is sound: `environment.ts` carries `http://localhost:3000/api/v1` (absolute URL); dev proxy intercepts only relative paths routed through the Angular dev server; CORS is the only functionally correct approach given the immutable environment file.
- `loading = true` permanently (never resolves) is correct per issue non-goals — data-fetch wiring deferred to cycles 7–9. Named in §Debt, non-blocking.
- `app.enableCors()` uses NestJS default (all origins) — appropriate for local development; §Debt item 3 notes the production restriction caveat.
- All α commits bear `alpha@issue-tracker.cdd.cnos` (verified via `git log --format='%ae'`).
