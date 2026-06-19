<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
-->

# Self-Coherence — Cycle 11 (gh #1)

## §Gap

**Issue:** gh #1 — Cycle 11 — UX navigation: routerLink between views
**Mode:** design-and-build
**Version:** 1.0.0

Three Angular views exist (`/projects`, `/projects/:id/issues`, `/issues/:id`) but were
not connected by `routerLink`. Application was navigable only by manual URL entry.
Single routerLink confirmed in codebase: `issue-detail.component.ts:54` (back-link only).

The gap closes when:
- Every project row links to its issues list
- Every issue row links to its detail view
- Empty states are shown when lists are empty
- Status/priority display as human-readable labels
- Form submit errors are inline (not full-view replacements)

## §Skills

**Tier 1a (loaded in order before any other step):**
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md` — kernel + domain package registry
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md` — α role contract

**Tier 2 (always-applicable):**
- `.cdd/PROJECT.md` — verified repo map
- `.cdd/STACK.md` — pinned conventions + dispatch bindings
- `.cdd/SCOPE.md` — product boundary

**Tier 3 (issue-specific):**
- `.cdd/unreleased/11/gamma-scaffold.md` — γ scaffold with AC oracle corrections and expected diff scope
- Angular 17 standalone component patterns (RouterLink, OnPush, HttpClientTestingModule)

Design artifact: not required — single-surface Angular-only UX change, no API or route
changes, no new abstractions. The implementation notes in the dispatch prompt provided
sufficient orientation.

## §ACs

Per-AC oracles run against implementation SHA `3b1b943`.

| AC | Status | Evidence |
|----|--------|----------|
| AC1 | PASS | `grep -r "routerLink" apps/web/src/app/projects/projects-list.component.ts` → `<a [routerLink]="['/projects', project.id, 'issues']"` at line 45. Test `AC1: project name links have routerLink to /projects/:id/issues` passes — verifies href `/projects/1/issues` and `/projects/2/issues` on rendered links. |
| AC2 | PASS | `grep -r "routerLink" apps/web/src/app/projects/project-issues.component.ts` (corrected oracle) → `<a [routerLink]="['/issues', issue.id]"` at line 57. Test `AC2: issue title links have routerLink to /issues/:id` passes — verifies href `/issues/i1` and `/issues/i2`. |
| AC3 | PASS | Template shows `<p>No projects yet.</p>` inside `@else if (projects.length === 0)` at line 41. Test `AC3: shows "No projects yet." when project list is empty` passes — flushes empty array, checks textContent and confirms table is null. |
| AC4 | PASS | Template shows `<p>No issues yet.</p>` inside `@else if (issues.length === 0)` at line 41 of `project-issues.component.ts`. Test `AC4: shows "No issues yet." when issue list is empty` passes. |
| AC5 | PASS | Template display expressions use `statusLabels[issue.status] ?? issue.status` and `priorityLabels[issue.priority] ?? issue.priority` (lines 46, 51). No raw enum strings in `{{ ... }}` bindings. `grep "in_progress\|critical" apps/web/src/app/projects/project-issues.component.ts` returns only class-body lines (statusLabels map key `in_progress: 'In Progress'`, priorityLabels map key `critical: 'Critical'`, and `priorities` array for select form field). Test `AC5: status and priority display as human-readable labels` passes — confirms `In Progress`, `High`, `Medium` in DOM text and `in_progress` absent. Note: corrected oracle from dispatch prompt applied — AC5 scope is template display expressions only, not TS class body. |
| AC6 | PASS | Two patterns fixed: (1) load error: both components changed from `@else if (error) { <error replaces view> }` to `@if (error) { <error> }` inside the `@else` block so the form remains visible. (2) submit error in `ProjectIssuesComponent`: `submitCreate()` now sets `this.createError` instead of `this.error`; `createError` shown inline under Create Issue button as `<p class="create-error">`. Test `AC6 inline create error: non-409 submit failure shows createError inline without replacing table` passes — verifies `component.createError` truthy, `component.error` null, table still present, `.create-error` element present in DOM. |
| AC7 | DEFERRED | Manual runbook gate — not executable by α; deferred to operator. Router plumbing is correct (RouterLink imported, routes unchanged from cycle 6, `routerLink` bindings use correct paths). |

## §Self-check

**Did α's work push ambiguity onto β?**

No. Every AC has concrete evidence: grep oracle results, line-number citations, and passing
test names. AC7 is correctly deferred as a manual runbook gate — this is stated explicitly,
not silently omitted. AC5 uses the corrected oracle from the dispatch prompt (template display
expressions only, not TS class body); this is called out explicitly.

**Is every claim backed by evidence in the diff?**

- AC1: `routerLink` binding confirmed by grep + rendered href in test.
- AC2: `routerLink` binding confirmed by grep + rendered href in test (corrected oracle path used).
- AC3: Empty state text confirmed by template inspection + test.
- AC4: Empty state text confirmed by template inspection + test.
- AC5: Label maps confirmed by template inspection + test asserting human-readable labels visible and raw `in_progress` absent from DOM.
- AC6: `createError` field confirmed by grep; test verifies table visible and `.create-error` element present after non-409 submit failure.

**Peer enumeration:**

Surfaces that could carry routerLink for this app: `ProjectsListComponent`,
`ProjectIssuesComponent`, `IssueDetailComponent`. `IssueDetailComponent` already had a
back-link (cycle 8). The issue gap statement named only `projects-list` and `project-issues`
as missing routerLink. Both are now updated. `IssueDetailComponent` is out of scope (not
modified; has pre-existing routerLink). Peer set = {ProjectsListComponent ✓,
ProjectIssuesComponent ✓, IssueDetailComponent — exempt (pre-existing link, not part of gap)}.

**Sibling surfaces:**

`app.routes.ts` and `api.service.ts` unchanged — confirmed by implementation contract constraint
and diff inspection. No new packages added. No API changes.

**Test coverage completeness:**

6 new tests added (2 for `projects-list`, 4 for `project-issues`). All 39 web tests pass.
Test runner output: `Tests: 39 passed, 39 total` (from `npm run test:web` at SHA `3b1b943`).

## §Debt

**D1 — API tests (pre-existing, unrelated to this cycle):**
`npm run test:api` fails with Postgres connection error in this environment. This is a
pre-existing environmental issue — verified by running the API tests against the base
commit (`c5146d0`) with the same result. My changes touch only `apps/web/`; the API test
suite is unaffected by this cycle's diff.

**D2 — AC7 manual runbook gate:**
AC7 cannot be executed by α. It requires a running app (db + api + web) and a browser.
This is noted in the issue body as `(runbook gate)` and in the AC oracle table as
"Manual runbook gate — operator executes." The dispatch prompt explicitly states
"Note on AC7: Manual runbook gate — not executable by α; deferred to operator."
Deferred to operator/β confirmation.

**No other debt.** All AC1–AC6 are mechanically verified. No known regressions. No
partial implementations. No outstanding ambiguities pushed onto β.

## §CDD Trace

| Step | Role | Artifact | SHA / Evidence |
|------|------|----------|----------------|
| S0 — Dispatch received | α | Dispatch prompt loaded; branch `cycle/11` confirmed | `c5146d0` (γ scaffold) on `origin/cycle/11` |
| S1 — Skills loaded | α | CDD.md + alpha/SKILL.md loaded; PROJECT.md, STACK.md, gamma-scaffold.md read | Pre-implementation |
| S2 — Issue read | α | `gh issue view 1` — gap, mode, ACs, non-goals, implementation contract | Pre-implementation |
| S3 — Git identity set | α | `alpha@issue-tracker.cdd.cnos` / Alpha | Pre-commit; verified `git log -1 --format='%ae'` |
| S4 — Implementation | α | 4 files changed: `projects-list.component.ts`, `project-issues.component.ts`, `.spec.ts` files | `3b1b943` |
| S5 — Tests green | α | `npm run test:web` → `Tests: 39 passed, 39 total` (5 suites) | At `3b1b943` |
| S6 — Diff enumeration | α | All 4 modified files declared in §ACs. No new modules; callers exist (route wiring unchanged from cycle 6). | `git diff --stat origin/main..3b1b943` |
| S7 — Self-coherence | α | This file (`self-coherence.md`) written section-by-section, committed incrementally | `201c7ad` → `8dfd97d` → (this commit) |

**Diff stat (`git diff --stat origin/main..3b1b943`):**
```
apps/web/src/app/projects/project-issues.component.spec.ts | 71 +++++++++++++
apps/web/src/app/projects/project-issues.component.ts      | 83 ++++++++++----
apps/web/src/app/projects/projects-list.component.spec.ts  | 27 +++++
apps/web/src/app/projects/projects-list.component.ts       | 48 ++++++---
4 files changed, 178 insertions(+), 51 deletions(-)
```

All 4 files are mentioned in §ACs. No unmentioned files.

**Pre-review gate:**

| Row | Check | Result |
|-----|-------|--------|
| 1 | Branch rebased onto `origin/main` | PASS — merge-base = `c97225f` = current `origin/main` HEAD (observed at self-coherence write time) |
| 2 | `self-coherence.md` carries CDD Trace through step 7 | PASS — this section |
| 3 | Tests present | PASS — 6 new tests added; 39 total pass |
| 4 | Every AC has evidence | PASS — §ACs table |
| 5 | Known debt explicit | PASS — §Debt: D1 (pre-existing API test env), D2 (AC7 runbook gate) |
| 6 | Schema/shape audit | N/A — no schema-bearing contract changes |
| 7 | Peer enumeration | PASS — ProjectsListComponent, ProjectIssuesComponent, IssueDetailComponent enumerated; exempt stated |
| 8 | Harness audit | N/A — no schema-bearing contract changes |
| 9 | Polyglot re-audit | PASS — diff is TypeScript only; no shell/YAML/Markdown surfaces changed |
| 10 | Branch CI | Cannot verify locally (GitHub Actions); noted as known limitation — β to verify CI green before merge |
| 11 | Artifact enumeration matches diff | PASS — all 4 diff files mentioned in §ACs |
| 12 | New modules caller-path trace | N/A — no new modules added; label maps and `createError` are fields on existing components |
| 13 | Test assertion count from runner | PASS — `Tests: 39 passed, 39 total` (from actual runner output) |
| 14 | Commit author email | PASS — all α commits: `alpha@issue-tracker.cdd.cnos`; γ commit: `gamma@issue-tracker.cdd.cnos`; pre-dispatch beta commits: `beta@issue-tracker.cdd.cnos` (not implementation commits) |
| 15 | γ-artifact at §5.1 path | PASS — `git cat-file -e origin/cycle/11:.cdd/unreleased/11/gamma-scaffold.md` → exists |

## §Review-readiness | round 1 | implementation SHA: 3b1b943 | branch CI: pending (local npm run test:web green at 2026-06-18) | ready for β

γ-artifact: canonical §5.1 path — `.cdd/unreleased/11/gamma-scaffold.md` present on `origin/cycle/11`.

All AC1–AC6 mechanical checks passed. AC7 is a manual runbook gate — deferred to operator.
`npm run test:web` → `Tests: 39 passed, 39 total` (5 suites, 2026-06-18).
Branch CI (GitHub Actions): β to verify green before merge per STACK.md §"β-rule: CI green gate".
