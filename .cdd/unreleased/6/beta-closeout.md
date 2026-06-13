---
cycle: 6
role: β
issue: "#6 — Angular shell + API client"
date: 2026-06-13
verdict: APPROVED
rounds: 1
merge_commit: main (merged cycle/6 via --no-ff)
impl_sha: c3b5943
---

# β Close-out — Cycle 6

## Review Summary

Single-round review. APPROVED with zero findings at any severity. All 6 ACs verified against code (not doc). Pre-merge gate passed on all four rows. Merge tree clean, 6 tests green on merged tree.

**Rounds:** 1  
**Findings:** 0  
**RC cycles:** 0  

## Implementation Assessment

α delivered a clean, minimal implementation that correctly bridges the Angular scaffold (cycle 1) to the NestJS API (cycles 2–5). The work is additive and correctly scoped.

**Strengths:**
- `ApiService` properly uses `environment.apiUrl` as the base — no hardcoded URLs in production code (hardcoded URL appears only in tests, correctly anchoring to the concrete value the environment resolves to)
- Standalone components throughout — no NgModule introduced; consistent with STACK.md §Frontend constraint
- Angular 17 `@if`/`@else` control flow used correctly in all 3 placeholder components
- `provideHttpClient()` present in `main.ts`; `provideHttpClientTesting()` used correctly in spec
- CORS rationale is technically sound: `environment.ts` carries an absolute URL; dev proxy only intercepts relative paths; CORS is the only functionally correct approach given the immutable environment constraint
- TypeScript strict mode: no implicit `any`, no `as unknown as` casts in any new file
- Blast radius confined correctly: `apps/api/src/` diff is one line (`app.enableCors()`); `apps/web/src/environments/` and `app.component.ts` are zero-diff

**Known non-blocking items (from §Debt):**
1. `loading = true` never resolves — data-fetch wiring is a declared non-goal (cycles 7–9)
2. `X-User-Email` auth header not yet sent — declared non-goal
3. `app.enableCors()` uses default (all origins) — appropriate for local dev; production restriction is out of scope for this cycle

## Technical Review Evidence

| AC | Oracle result |
|----|--------------|
| AC1 | `app.routes.ts` lines 7–9: `'projects'`, `'projects/:projectId/issues'`, `'issues/:issueId'` with corresponding standalone components — PASS |
| AC2 | `api.service.ts`: `HttpClient` constructor injection; `private readonly base = environment.apiUrl`; `getProjects()` / `getIssues(string)` / `getIssue(string)` returning typed `Observable<...>` — PASS |
| AC3 | `apps/api/src/main.ts` line 27: `app.enableCors()`; README §"Dev connectivity — CORS (cycle 6)": choice + rationale + startup sequence documented — PASS |
| AC4 | All 3 components: `loading = true`, `error: string \| null = null`; `@if (loading)` / `@else if (error)` / `@else` in template — PASS |
| AC5 | `npm run test:web` → 6 passed, 6 total, exit 0; `api.service.spec.ts`: 4 tests using `provideHttpClientTesting()` + `HttpTestingController` covering all 3 methods — PASS |
| AC6 | `grep -r "@angular/material" apps/web/` → no matches — PASS |

**Implementation contract (7 axes):** all conform — TypeScript strict, no new CLI entrypoints, all new source under `apps/web/src/app/`, no new npm deps, existing-binary constraints met, wire contract preserved, backward-compat maintained.

## Process Observations

- α's self-coherence.md was thorough: each AC had file+line evidence, the review-readiness signal was explicit, caller-path traces were present, and debt was named with non-blocking classification. This made β's review mechanical rather than investigative.
- The environment-constraint note (local-only repo, no remote CI) was correctly documented by α and correctly handled by β: web tests run directly as the equivalent CI validator. No phantom finding raised on a structural environment limitation.
- CORS vs proxy decision was documented in both README and self-coherence.md — the dual documentation makes the choice auditable without requiring β to reconstruct the rationale from the diff alone.
- Single-round APPROVED with zero findings reflects tight AC scoping and clean implementation. The γ scaffold's peer enumeration (confirming the gap was fully open) was accurate and did not produce false-gap issues.

## Release Notes (for δ)

β signals: **release ready for δ tag**.

β does not execute `scripts/release.sh`, bump VERSION, or push any tag — δ owns the release boundary.

This cycle ships new Angular routing, ApiService, and placeholder components. It is a minor feature addition on the web tier; no API breaking changes; no new npm packages. Suggested version bump: **minor** (new frontend feature, backward-compatible).

Merge commit is on `main`. The implementation SHA was `c3b5943`; β review commit was `5331e11`; merge commit is the current `main` HEAD.
