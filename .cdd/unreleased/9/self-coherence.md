## §Review-readiness | round 1 | implementation SHA: aa088c8 | branch CI: green (33/33, local) | ready for β

### Pre-review gate

| Row | Check | Status |
|-----|-------|--------|
| 1 | `cycle/9` base = `75b080e` (main HEAD); no drift — branch is on current main | ✅ |
| 2 | `self-coherence.md` carries CDD Trace through step 7 | ✅ |
| 3 | Tests present; 10 new test cases | ✅ |
| 4 | Every AC has evidence (§ACs table) | ✅ |
| 5 | Known debt explicit (§Debt — 4 items) | ✅ |
| 6 | No schema-bearing contract changed (no API files touched) | N/A |
| 7 | No claim touches a family-of-surfaces requiring peer enumeration beyond γ-scaffold §"Peer Enumeration" already completed | ✅ |
| 8 | No schema-bearing harness audit required | N/A |
| 9 | No mid-cycle patch; re-audit not applicable | N/A |
| 10 | `npm run test:web` → 33 passed, 0 failed at HEAD `a84ee24` | ✅ |
| 11 | All 10 diff files explicitly mentioned in §Files (6 α-authored implementation files + 3 γ-authored scaffold files + self-coherence) | ✅ |
| 12 | New module callers: `createIssue` ← `submitCreate()` in `project-issues.component.ts`; `updateIssue` ← `saveEdit()` in `issue-detail.component.ts` | ✅ |
| 13 | Test assertion count from runner: 33 (pasted from actual output above) | ✅ |
| 14 | `git log -1 --format='%ae' HEAD` → `alpha@issue-tracker.cdd.cnos` | ✅ |
| 15 | γ-artifact at canonical §5.1 path: `.cdd/unreleased/9/gamma-scaffold.md` present on branch | ✅ |

---

## §Skills

**Tier 1:**
- `CDD.md` — canonical lifecycle and role contract
- `alpha/SKILL.md` — α role surface (this file)

**Tier 2:**
- `eng/typescript` — TypeScript authoring constraints (strict mode, type safety)
- `eng/angular` — Angular 17 standalone components, OnPush CD, template syntax

**Tier 3 (issue-specific):**
- None declared in issue; implementation contract fully specifies technology (Angular 17 + Angular Material, TypeScript strict)

---

## §Files Changed

| File | Δ lines | Notes |
|------|---------|-------|
| `apps/web/src/app/api/api.service.ts` | +14 | `createIssue()` and `updateIssue()` methods |
| `apps/web/src/app/projects/project-issues.component.ts` | +122 | Create-issue form, state, submit logic, event handlers |
| `apps/web/src/app/issues/issue-detail.component.ts` | +115 | Edit mode, edit state, save/cancel, event handlers |
| `apps/web/src/app/api/api.service.spec.ts` | +54 | 2 new tests |
| `apps/web/src/app/projects/project-issues.component.spec.ts` | +82 | 4 new tests |
| `apps/web/src/app/issues/issue-detail.component.spec.ts` | +70 | 4 new tests + mock type update |
| `.cdd/unreleased/9/self-coherence.md` | +68 (and growing) | This file |

γ-authored artifacts on branch (not α-authored): `alpha-prompt.md`, `beta-prompt.md`, `gamma-scaffold.md`.

---

## §Test Counts

`npm run test:web` before cycle 9: **23 tests** (5 suites)  
`npm run test:web` after cycle 9: **33 tests** (5 suites)  
Delta: +10 tests

Actual runner output (last run at HEAD `8e3d434`):
```
Tests:       33 passed, 33 total
Test Suites: 5 passed, 5 total
Time:        1.642 s
```

---

## §CDD Trace

| Step | Action | Artifact |
|------|--------|---------|
| 0 | Dispatch received; loaded `alpha/SKILL.md`, `CDD.md` | — |
| 1 | Configured git identity: `alpha@issue-tracker.cdd.cnos` | — |
| 2 | Checked out `cycle/9` (already on branch) | — |
| 3 | Read `ISSUE.md`, `gamma-scaffold.md`; enumerated all artifacts named in issue + scaffold | — |
| 4 | Gap analysis: `createIssue`/`updateIssue` absent from `ApiService`; create form absent from `ProjectIssuesComponent`; edit mode absent from `IssueDetailComponent` — matches γ-scaffold peer enumeration | — |
| 5 | Mode confirmed: `design-and-build`; design not required (ACs fully bounded; API endpoints exist) | — |
| 6 | Implemented in artifact order: ApiService → ProjectIssuesComponent → IssueDetailComponent → specs | `apps/web/…` (6 files); callers: `submitCreate()` calls `api.createIssue()`; `saveEdit()` calls `api.updateIssue()`; both have non-test callers in component templates |
| 7 | Self-coherence written incrementally (§Gap, §Skills, §ACs, §Self-check, §Debt, §Files, §Tests, §CDD Trace) | `.cdd/unreleased/9/self-coherence.md` |

Implementation SHA (last non-self-coherence commit): `aa088c8`

---

## §Debt

1. **Non-409 create errors replace table view** — when `submitCreate()` fails with a non-409 error, the shared `error` property is set. The template's `@else if (error)` block then shows the error and hides the table and form. UX is suboptimal; a separate `createError` property would show the error inline without hiding the table. Deferred as v1 behavior; the issue has no AC for this case.

2. **Edit success message persists across reloads** — `editSuccessMessage` is cleared only when `enterEditMode()` is called next, not on route navigation or page reload. Adequate for v1.

3. **Reactive forms not used** — template-driven binding with `[value]` + `(input)` event handlers is used throughout, consistent with the existing `IssueDetailComponent` comment form pattern. Reactive forms (FormGroup/FormControl) would give more structured validation but were not required by the issue.

4. **α close-out provisional** — per `alpha/SKILL.md` §2.8, α close-out is written after β approval. No `alpha-closeout.md` is authored at review-readiness time. This is the standard path for bounded dispatch; close-out will be written on re-dispatch after β merge.

No AC is unmet. No required peer or harness enumeration was skipped (this change touches no schema-bearing parser or shared harness; peer enumeration was done for the two new ApiService methods and all three component files as specified by γ-scaffold §"Surfaces γ Expects α to Touch").

---

## §Self-check

**Git identity:** `git config user.email` → `alpha@issue-tracker.cdd.cnos` ✅  
**Last commit author email:** `git log -1 --format='%ae' HEAD` → `alpha@issue-tracker.cdd.cnos` ✅

**Did α push ambiguity onto β?**  
No. All 6 ACs have concrete evidence (test pass + diff). The archived-project detection approach (409 → `projectArchived`) is fully implemented and tested, not deferred. The edit-mode template structure (view/edit toggle, success message placement) matches the dispatch spec exactly.

**Is every claim backed by evidence in the diff?**  
Yes. Each AC row in §ACs names either a specific method/property in the diff or a passing test case. No claim asserts more than the diff delivers.

**Constraint compliance:**
- No files under `apps/api/` were modified ✅
- `apps/web/src/app/app.routes.ts` not modified ✅
- No NgModules introduced; all components remain standalone ✅
- `ProjectIssuesComponent` existing table functionality preserved ✅
- `IssueDetailComponent` existing comment and status functionality preserved (comments section outside edit toggle; `moveToNextStatus` unchanged) ✅

---

## §ACs

| AC | Met? | Evidence |
|----|------|---------|
| AC1: Create issue form on `/projects/:projectId/issues` (title required; description, priority, assignee optional) | ✅ | `project-issues.component.ts`: create-section with 4 `mat-form-field` blocks (title, description, priority select, assignee). Spec: `AC1: create form fields…present in DOM after issues load` passes. |
| AC2: Edit title, description, priority, assignee on detail page (PATCH API) | ✅ | `issue-detail.component.ts`: `enterEditMode()` copies fields; `saveEdit()` calls `api.updateIssue(issueId, dto)` (PATCH). Specs: `AC2a edit toggle` and `AC2b save call` both pass. |
| AC3: Block create when project archived (show message, no submit) | ✅ | `submitCreate()` error handler: `err.status === 409` → `this.projectArchived = true`; template shows "Project is archived — cannot create issues"; `[disabled]="!newTitle.trim() || projectArchived"`. Spec: `AC3: 409 archived message` passes. |
| AC4: Client-side validation mirrors API (title non-empty) | ✅ | Create button: `[disabled]="!newTitle.trim() || projectArchived"`. Save button: `[disabled]="!editTitle.trim()"`. Specs: `AC4: Create Issue button disabled` and `AC4: save button disabled when edit title is empty` both pass. |
| AC5: Component tests for create/edit forms | ✅ | 10 new test cases across 3 spec files: 2 in `api.service.spec.ts`, 4 in `project-issues.component.spec.ts`, 4 in `issue-detail.component.spec.ts`. `npm run test:web` → 33 passed, 0 failed. |
| AC6: Success feedback (snackbar or inline message) | ✅ | Create: `successMessage = 'Issue created'` shown via `@if (successMessage)`. Edit: `editSuccessMessage = 'Issue saved'` shown in view section after save. Specs: `AC6: success message appears` (both create and edit) pass. |

---

## §Gap

**Issue:** #9 — Create/edit issue flows  
**Mode:** design-and-build  

The gap was the absence of any UI form flows for creating or editing issues. Before this cycle, issues could only be created via direct API calls, and the issue detail page was read-only. This cycle closes that gap by adding a create-issue form on the project-issues page and an inline edit mode on the issue-detail page, both wired to existing API endpoints (`POST /api/v1/projects/:projectId/issues` and `PATCH /api/v1/issues/:id`).
