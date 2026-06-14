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
