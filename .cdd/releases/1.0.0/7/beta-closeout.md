---
cycle: 7
role: β
issue: "#7 — Issue list + project views (Material)"
date: 2026-06-13
verdict: APPROVED
rounds: 1
merge_commit: 57772b1
impl_sha: e2add34
base_sha: ef090a6
---

# β Close-out — Cycle 7

## Review Summary

Single-round review. APPROVED with zero findings at any severity. All 6 ACs verified against code (not doc). Pre-merge gate passed on all four rows. Merge tree clean; 88 tests green (API 76, web 12) on merged tree.

**Rounds:** 1  
**Findings:** 0  
**RC cycles:** 0  

## Implementation Assessment

α delivered a clean, minimal Angular Material integration that fully wires the two list placeholders (`projects-list`, `project-issues`) without touching any out-of-scope surface. Implementation is additive; no existing behavior changed.

**Strengths:**
- Material setup is complete and correct: `@angular/material ~17.3.0` + `@angular/cdk ~17.3.0` added; `indigo-pink` pre-built theme imported in `styles.css`; `styles.css` registered in `angular.json`; `provideAnimations()` added to bootstrap providers — all five required setup steps present
- `MatTableModule` used consistently in both components; `displayedColumns` declarations are minimal and match the AC requirements exactly
- 409 guard on archive is precise: `err.status === 409` → `'Already archived'`; non-409 falls to `err.message ?? 'Archive failed'`; no crash path; `loadProjects()` correctly NOT called on error (stale list preserved)
- Archived-project visual treatment is multi-layered and consistent: `[class.archived]` on `<td>` for opacity/strikethrough; `<span class="archived-badge">` conditional badge; archive button hidden when already archived — three coordinated signals, no AC overclaim
- TestBed + `HttpClientTestingModule` specs for both new components; 4 tests cover list render, error state, create-project flow, and 409 inline-error path on `projects-list`; 2 tests cover table render and error state on `project-issues`
- `ApiService` extension is additive: `createProject` and `archiveProject` added; all three existing methods (`getProjects`, `getIssues`, `getIssue`) are unchanged; wire contract preserved
- Material imports confined to `apps/web/src/app/projects/` only — no Material leakage into `app.component.ts`, `issue-detail.component.ts`, or `api.service.ts`
- `ChangeDetectorRef.markForCheck()` called in every async handler path — correct for `OnPush`-compatible patterns even if not explicitly required by this cycle

**Known non-blocking items (from §Debt):**
1. No remote CI infrastructure — repo is local-only; no `origin` remote; tests validated locally
2. No manual browser verification — declared debt by α; TestBed specs provide structural proof; UI correctness via running browser is deferred
3. No `RouterLink` from project row to `/projects/:id/issues` — not an AC requirement; noted as natural cycle 8 follow-up

## Technical Review Evidence

| AC | Oracle result |
|----|--------------|
| AC1 | `MatTableModule`; `displayedColumns = ['name', 'actions']`; `mat-form-field` + `matInput` + `[(ngModel)]="newProjectName"`; `createProject()` calls `api.createProject(name)` then reloads — PASS |
| AC2 | `MatTableModule`; `displayedColumns = ['status', 'priority', 'title']`; all three column defs in template; `ActivatedRoute.snapshot.paramMap.get('projectId')` drives API call — PASS |
| AC3 | `archiveProject()` → `api.archiveProject(project.id)`; `[class.archived]="project.archived"` → `opacity:0.5; text-decoration:line-through`; `<span class="archived-badge">Archived</span>`; `err.status === 409` → `'Already archived'`; no crash — PASS |
| AC4 | `loading = true` initially; `<mat-spinner>` on `@if (loading)`; `<p class="error">` on `@else if (error)`; `cdr.markForCheck()` in every handler path — PASS |
| AC5 | `npm run test:all` exits 0 — API 76/76, web 12/12; `projects-list.component.spec.ts` (4 tests); `project-issues.component.spec.ts` (2 tests); `HttpClientTestingModule` + `HttpTestingController` in both — PASS |
| AC6 | `.container { max-width: 800px/1000px }`, `table { width: 100% }`, `.create-form { display: flex; flex-wrap: wrap }` — PASS |

**Implementation contract (7 axes):** all conform — TypeScript strict (all diff files: `.ts`, `.json`, `.css`); no CLI integration target; package scoping `apps/web/` only (confirmed empty `git diff main..HEAD -- apps/api/`); additive disposition (no existing routes or components removed); runtime deps `@angular/material ~17.3.0` + `@angular/cdk ~17.3.0` added; `Project`/`Issue` interfaces unchanged; `app.routes.ts` unchanged.

## Process Observations

- α's self-coherence.md was exceptionally thorough: 15 review-readiness gate rows, full CDD Trace through step 7, explicit caller-path traces for both new `ApiService` methods, ambiguity items pre-resolved in §Self-check, and debt items named with non-blocking classification. β's review was mechanical, not investigative.
- The local-only environment constraint (no `origin` remote, no remote CI) was correctly documented by α and correctly handled by β: `npm run test:all` serves as the equivalent CI validator. No phantom finding raised on a structural environment limitation.
- Zero-finding APPROVED on a 15-gate review-readiness signal reflects tight AC scoping, clean implementation boundary, and accurate γ scaffold peer enumeration.
- The `archiveErrors` map pattern (keyed by project ID, set to `''` on success, cleared on reload) was a potential ambiguity; α pre-resolved it in §Self-check with a correct behavioral analysis. β confirmed the analysis at code level — no stale error shown post-reload.

## Release Notes (for δ)

β signals: **release ready for δ tag**.

β does not execute `scripts/release.sh`, bump VERSION, or push any tag — δ owns the release boundary.

This cycle ships Angular Material integration with project list and issue list views. Additive frontend-only change; no API breaking changes; new npm dependencies (`@angular/material ~17.3.0`, `@angular/cdk ~17.3.0`). Suggested version bump: **minor** (new frontend feature, backward-compatible).

Merge commit is `57772b1` on `main`. Implementation SHA was `e2add34`; merge base was `ef090a6`.
