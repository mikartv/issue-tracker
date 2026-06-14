---
cycle: 9
issue: "#9 — Create/edit issue flows"
role: γ
artifact: gamma-scaffold
date: 2026-06-14
mode: design-and-build
work_shape: substantial
---

# γ Scaffold — Cycle 9

## Selection

Selected: Issue #9 — Create/edit issue flows  
Decisive clause: CDS §Selection function → Assessment-commitment default — cycle 8 `gamma-closeout.md` named #9 as next MCA under "Next MCA" section.  
No alternatives displaced: no P0 override; no operational-infrastructure override; no cross-repo proposals pending.

## Mode

`design-and-build` — all 6 ACs are fully bounded by the issue; API endpoints exist (`POST /api/v1/projects/:projectId/issues`, `PATCH /api/v1/issues/:id`); no prior design staging cycle required.

## Work Shape

Substantial (6 ACs). Five-factor check:

| Factor | Reading | Splitting signal? |
|--------|---------|-------------------|
| (a) New code surface | Two new ApiService methods; create form in `ProjectIssuesComponent`; inline edit mode in `IssueDetailComponent` | No — one coherent CRUD feature |
| (b) Cross-module breadth | 3 implementation files + 2–3 spec files; no new modules | No |
| (c) Lifecycle span | Code + component tests only; no infra change | No |
| (d) MCA preconditions | Design fully embedded in issue ACs; API endpoints already exist | No |
| (e) Independent shippability | Create and edit share ApiService, AC4 validation, AC5 tests, AC6 feedback — not independently shippable | No |

Decision: keep whole. No split indicator fires.

## Peer Enumeration (binding, §2.2a)

All assertions below are empirically grounded:

- `createIssue()` absent from `ApiService` — confirmed: `grep -rn "createIssue" apps/web/src/` returns no match (only `createProject` exists in `api.service.ts`)
- `updateIssue()` absent from `ApiService` — confirmed: `api.service.ts` contains only `updateIssueStatus`; `updateIssue` (PATCH) does not exist
- Create-issue form absent from `ProjectIssuesComponent` — confirmed: `apps/web/src/app/projects/project-issues.component.ts` has only a mat-table; no form, no create logic
- Inline edit absent from `IssueDetailComponent` — confirmed: `apps/web/src/app/issues/issue-detail.component.ts` is read-only; no edit mode, no PATCH call, no `editMode` state
- `MatSnackBar` / `MatSelectModule` absent from web app — confirmed: no `MatSnackBar` or `MatSelect` imports anywhere in `apps/web/src/`
- `POST /api/v1/projects/:projectId/issues` exists — confirmed: `apps/api/src/issues/issues.controller.ts` line 21; accepts `CreateIssueDto` (`title` required; `description?`, `priority?`, `assignee?`)
- `PATCH /api/v1/issues/:id` exists — confirmed: `apps/api/src/issues/issues.controller.ts` line 49; accepts `UpdateIssueDto` (`title?`, `description?`, `priority?`, `assignee?`)
- No `GET /api/v1/projects/:id` endpoint exists — confirmed: `projects.controller.ts` exposes only `GET /projects` (list-all), `POST /projects`, `PATCH /projects/:id`, `POST /projects/:id/archive`. Archived-project detection must use 409 response from create attempt.
- `IssuePriority` enum is `low | medium | high | critical` — confirmed: `create-issue.dto.ts` imports from `issue.entity`
- Angular Material (`@angular/material`) is already installed — confirmed: `MatTableModule`, `MatProgressSpinnerModule`, `MatCardModule`, `MatButtonModule`, `MatInputModule`, `MatFormFieldModule` already imported across existing components; `MatSelectModule` is available without new package install

## Surfaces γ Expects α to Touch

| Surface | File | Change |
|---------|------|--------|
| ApiService | `apps/web/src/app/api/api.service.ts` | Add `createIssue()` and `updateIssue()` methods |
| Project issues component | `apps/web/src/app/projects/project-issues.component.ts` | Add inline create-issue form; archived-project detection (409); client-side title validation; success feedback |
| Issue detail component | `apps/web/src/app/issues/issue-detail.component.ts` | Add edit mode (title, description, priority, assignee); save via PATCH; title validation; success feedback |
| ApiService spec | `apps/web/src/app/api/api.service.spec.ts` | Add specs for `createIssue()` and `updateIssue()` |
| Project issues spec | `apps/web/src/app/projects/project-issues.component.spec.ts` | Extend with create form, validation, archived-block, success tests |
| Issue detail spec | `apps/web/src/app/issues/issue-detail.component.spec.ts` | Extend with edit mode, save, validation, success tests |

## Archived-Project Detection Approach

No `GET /api/v1/projects/:id` endpoint exists. AC3 is satisfied via API response:
- When `createIssue()` returns HTTP 409, set `projectArchived = true`; show "Project is archived — cannot create issues" message; submit button remains disabled.
- `projectArchived` persists for the component lifetime (reloading issues would re-set it to `false` only on a fresh page mount; adequate for v1).

## Priority Field Approach

Use `MatSelectModule` with `<mat-select>` for priority in both create and edit forms. Values: `['low', 'medium', 'high', 'critical']`. Default for create form: `'medium'`. `MatSelectModule` is part of `@angular/material` already installed; add to standalone `imports` array.

## Success Feedback Approach

Inline success message (no `MatSnackBar`): set `successMessage = 'Issue created'` / `'Issue saved'` on success; display with `@if (successMessage)` block; clear on next user action. Avoids adding a service-injected module for a single string.

## AC Oracle Approach

| AC | Oracle | Approach |
|----|--------|---------|
| AC1 — create form on project issues page | Form renders with title, description, priority, assignee fields; title required | TestBed: mount `ProjectIssuesComponent`; flush `getIssues`; `detectChanges()`; assert create-form fields present in DOM |
| AC2 — edit on detail page via PATCH | Edit button toggles edit mode; save calls `updateIssue()` with changed values | TestBed: mount; click edit button; mutate title input; click save; assert `updateIssue` spy called with new value |
| AC3 — archived project block | 409 on create → submit disabled + "archived" message | TestBed: mock `createIssue` returning `throwError(HttpErrorResponse({status: 409}))`; submit form; assert disabled state + message in DOM |
| AC4 — client-side title validation | Submit blocked when title field is empty | TestBed: title input empty (default) → submit button `disabled` attribute set or click does not invoke `createIssue` |
| AC5 — component tests green | `npm run test:web` exits 0 | Run command; observe exit code and suite counts |
| AC6 — success feedback | Success message in DOM after create / after save | TestBed: mock returns success; assert message text present in DOM |

## Cycle 8 MCI Applications

| MCI | Application |
|-----|------------|
| `feat` commit authored as `beta@` (cycle 8 friction item) | α prompt includes explicit `git config user.name Alpha && git config user.email alpha@issue-tracker.cdd.cnos` before first implementation commit |
| β artifacts not pushed to cycle branch before merge | β prompt includes explicit requirement: push `beta-review.md` and `beta-closeout.md` to `cycle/9` before signaling review-readiness |

## Expected Diff Scope

~300–400 lines across 5–6 files. No API files touched. No routing changes. No new npm packages (`MatSelectModule` is part of the already-installed `@angular/material`).

## Blockers

None. All required API endpoints exist. Branch `cycle/9` exists and is checked out.
