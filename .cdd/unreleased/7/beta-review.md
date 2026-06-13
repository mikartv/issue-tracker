---
cycle: 7
issue: "#7 — Issue list + project views (Material)"
role: β
artifact: beta-review
round: 1
date: 2026-06-13
base_sha: 1c6d3bd
head_sha: f35d6c1
verdict: APPROVED
---

# β Review — Cycle 7

**Verdict:** APPROVED

**Round:** 1  
**Branch CI state:** local-only (no remote `origin`); `npm run test:all` exits 0 — API 76/76, web 12/12  
**Merge instruction:** `git merge --no-ff cycle/7 -m "feat: issue list + project views with Angular Material (Closes #7)"` into `main`

---

## §2.0.0 Contract Integrity

| Check | Result | Notes |
|---|---|---|
| Status truth preserved | yes | Issue open → implemented; ACs checkboxes are unchecked in source (issue tracking is local), not contradictory |
| Canonical sources/paths verified | yes | All paths in self-coherence.md resolve to present files |
| Scope/non-goals consistent | yes | Non-goals (issue detail, create-issue form, dark theme) absent from diff |
| Constraint strata consistent | yes | 7-axis implementation contract preserved; no improvised deviations |
| Exceptions field-specific/reasoned | yes | 409 guard is explicit (`err.status === 409`); non-409 falls to generic error path |
| Path resolution base explicit | yes | All imports relative; `environment.apiUrl` base explicit in ApiService |
| Proof shape adequate | yes | TestBed + HttpTestingController; mechanical oracles + error-state coverage |
| Cross-surface projections updated | yes | `apps/web/package.json`, `angular.json`, `main.ts`, `styles.css` all updated consistently |
| No witness theater / false closure | yes | α declared no-manual-browser as known debt; spec tests provide structural proof; no overclaim |
| PR body matches branch files | n/a | No GitHub PR; local-only repo |
| γ artifacts present (gamma-scaffold.md) | yes | `.cdd/unreleased/7/gamma-scaffold.md` present at commit `c39acb9`; rule 3.11b satisfied |

---

## §2.0 Issue Contract

### AC Coverage

| # | AC | In diff? | Status | Notes |
|---|----|----------|--------|-------|
| AC1 | `/projects` — Material table or list of projects; create project form (name) | yes | **MET** | `MatTableModule`; `displayedColumns = ['name', 'actions']`; `mat-form-field` + `matInput` + `[(ngModel)]="newProjectName"`; `createProject()` calls `api.createProject(name)` then reloads |
| AC2 | `/projects/:projectId/issues` — issue list with status, priority, title columns | yes | **MET** | `MatTableModule`; `displayedColumns = ['status', 'priority', 'title']`; all three column defs in template; `ActivatedRoute.snapshot.paramMap.get('projectId')` drives the API call |
| AC3 | Archive action on project; archived projects visually distinct; handle 409 on archive-again | yes | **MET** | Archive button in `actions` column; `[class.archived]="project.archived"` applies `opacity:0.5; text-decoration:line-through`; `<span class="archived-badge">Archived</span>` rendered when `project.archived`; 409 → `'Already archived'` message; non-409 → `err.message ?? 'Archive failed'`; no crash path |
| AC4 | Loading and error states for failed API calls | yes | **MET** | Both components: `loading = true` initial; `<mat-spinner>` on loading; `<p class="error">` on error; error handlers set error string and clear loading flag; `cdr.markForCheck()` called in each path |
| AC5 | Component tests for list components (TestBed + HttpClientTestingModule) | yes | **MET** | `projects-list.component.spec.ts` (4 tests: list render, error state, create project, 409 archive); `project-issues.component.spec.ts` (2 tests: table render, error state); `npm run test:web` exits 0; 12 tests, 4 suites |
| AC6 | Responsive enough for desktop browser (mobile not required) | yes | **MET** | `.container { max-width: 800px/1000px }`, `table { width: 100% }`, `.create-form { display: flex; flex-wrap: wrap }` |

### Named Doc Updates

| Doc / File | In diff? | Status | Notes |
|------------|----------|--------|-------|
| `apps/web/package.json` | yes | present | `@angular/material ~17.3.0` and `@angular/cdk ~17.3.0` added |
| `apps/web/src/styles.css` | yes | present | New file; Material theme import + base CSS |
| `apps/web/angular.json` | yes | present | `"styles": ["src/styles.css"]` registered |
| `apps/web/src/main.ts` | yes | present | `provideAnimations()` added to bootstrap providers |

### CDD Artifact Contract

| Artifact | Required? | Present? | Notes |
|----------|-----------|----------|-------|
| `gamma-scaffold.md` | yes | yes | Committed at `c39acb9`; surfaces match diff scope |
| `self-coherence.md` | yes | yes | §CDD Trace steps 0–7 complete; §Review-readiness table present; 15 gate rows |
| `beta-review.md` | yes | yes (this file) | Being produced now |

### Active Skill Consistency

| Skill | Required by | Applied? | Notes |
|-------|-------------|----------|-------|
| `cdd/beta/SKILL.md` | dispatch | yes | Pre-merge gate rows verified; β identity asserted |
| `cdd/review/SKILL.md` | beta/SKILL.md | yes | Phases 1–3 executed; verdict rules applied |

---

## §2.1 Implementation Review

### Implementation Contract — 7 Axes

| Axis | Pinned value | Observed | Status |
|------|-------------|----------|--------|
| Language | TypeScript strict | All diff files: `.ts`, `.json`, `.css` | ✓ |
| CLI integration target | N/A | N/A | ✓ |
| Package scoping | `apps/web/` only; no `apps/api/` changes | `git diff main..HEAD -- apps/api/` → empty | ✓ |
| Existing-binary disposition | Additive; placeholders replaced; no existing routes removed | `app.routes.ts` diff empty; `issue-detail.component.ts` diff empty | ✓ |
| Runtime dependencies | `@angular/material ~17.x`, `@angular/cdk ~17.x` added; Angular 17 preserved | `package.json` line additions confirmed | ✓ |
| JSON/wire contract preservation | `Project` and `Issue` interfaces in `ApiService` unchanged | Both interfaces unchanged; only `createProject` and `archiveProject` added | ✓ |
| Backward-compat invariant | `app.routes.ts` unchanged; existing components outside `apps/web/src/app/projects/` untouched | Confirmed empty diff on routes; `issue-detail.component.ts` untouched | ✓ |

### Non-Goals Confirmed Absent

| Non-goal | Verified absent? | Evidence |
|----------|-----------------|----------|
| Issue detail page | yes | `apps/web/src/app/issues/issue-detail.component.ts` diff empty |
| Create issue form | yes | No `createIssue` method; no issue-creation UI in either component |
| Dark theme | yes | Only `indigo-pink` pre-built theme in `styles.css`; no `dark` theme import |

### Material Scope Check

Material imports appear **only** in `apps/web/src/app/projects/` — confirmed by:
```
grep -r "@angular/material" apps/web/src/ --include="*.ts" -l
→ apps/web/src/app/projects/project-issues.component.ts
→ apps/web/src/app/projects/projects-list.component.ts
```
No Material imports in `app.component.ts`, `issue-detail.component.ts`, or `api.service.ts`.

### Specific Checks (dispatch instructions 9–10)

**Archived-project visual treatment (instruction 9):**
- `[class.archived]="project.archived"` on `<td>` → `opacity: 0.5; text-decoration: line-through` (CSS class in component styles)
- `<span class="archived-badge">Archived</span>` conditional on `@if (project.archived)` — badge present with grey background `#ccc`
- Archive button hidden for already-archived projects (`@if (!project.archived)`)
- Consistent across list rendering — visual treatment is present

**409 handling on archive-again (instruction 10):**
- `archiveProject()` error handler: `err.status === 409 ? 'Already archived' : (err.message ?? 'Archive failed')`
- Result stored in `archiveErrors[project.id]`; rendered as `<span class="inline-error">` in the table cell
- No crash: error path does not rethrow; `loadProjects()` is NOT called on error (correct — stale list preserved)
- Test `'shows inline 409 error on archive conflict without navigating'` verifies `archiveErrors['1'] === 'Already archived'`
- Confirmed no crash: component state remains stable after 409

### CI Status (rule 3.10)

No remote CI infrastructure (repo is local-only; no `origin` remote). Local test run:

```
npm run test:all (2026-06-13)
API:  Test Suites: 9 passed, 9 total / Tests: 76 passed, 76 total
Web:  Test Suites: 4 passed, 4 total / Tests: 12 passed, 12 total
```

Both suites exit 0. Consistent with α's §Review-readiness gate row 10 declaration.

### γ Artifact Completeness (rule 3.11b)

`.cdd/unreleased/7/gamma-scaffold.md` present on `cycle/7` at commit `c39acb9`. Gate satisfied.

---

## Findings

| # | Finding | Evidence | Severity | Type |
|---|---------|----------|----------|------|
| — | No findings | All AC oracles pass; implementation contract conforms; no non-goals implemented; tests green | — | — |

---

## Notes

1. **Navigation between routes** — The projects list has no `RouterLink` to navigate from a project row to its `/projects/:id/issues` view. This is not required by any AC (AC1 and AC2 define separate routes; no AC mandates a link between them) and is therefore not a finding. Users can navigate directly by URL. A navigation link would improve UX and is natural for cycle 8 or a small follow-up.

2. **Subscription management** — Components use `subscribe()` directly without explicit teardown. Since `HttpClient` observables complete after one emission, there is no persistent subscription to leak. Acceptable for this use case.

3. **`archiveErrors` key retained after reload** — `archiveErrors[project.id]` is set to `''` on successful archive (before `loadProjects()` fires). Template checks `@if (archiveErrors[project.id])` — falsy for empty string, so no stale error is shown. The component state resets after reload. Behaviorally correct.

---

**Search space closed:** β reviewed all 6 ACs against diff evidence, verified 7 implementation-contract axes, confirmed non-goals absent, confirmed γ artifact present, confirmed test suites green. No blocker found.
