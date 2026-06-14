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
