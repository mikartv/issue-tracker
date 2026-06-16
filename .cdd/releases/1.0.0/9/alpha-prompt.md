# α Dispatch — Cycle 9

Issue: Read `.cdd/issues/9/ISSUE.md` from repo root (full contract: gap, ACs, non-goals).  
Scaffold: Read `.cdd/unreleased/9/gamma-scaffold.md` (surfaces, AC oracle, detection approaches — read before implementing).  
Branch: cycle/9 (already exists — run `git switch cycle/9`; do not create a new branch).

**Identity (binding — cycle 8 MCI):** Before your first commit, run:

```
git config user.name Alpha
git config user.email alpha@issue-tracker.cdd.cnos
```

Verify with `git config user.email` before committing.

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (`strict: true` in both apps) |
| CLI integration target | N/A |
| Package scoping | `apps/web/` only; root workspace scripts (`npm run test:web`) |
| Existing-binary disposition | N/A |
| Runtime dependencies | Angular 17, Angular Material (already installed), `HttpClient` |
| JSON/wire contract preservation | `/api/v1` global prefix; UUID string IDs; existing error shape unchanged; no API files modified |
| Backward-compat invariant | Routes `/projects`, `/projects/:projectId/issues`, `/issues/:issueId` and their existing components must remain functional |

## What to implement

### 1. Extend `ApiService` (`apps/web/src/app/api/api.service.ts`)

Add two methods after the existing `updateIssueStatus`:

```typescript
createIssue(
  projectId: string,
  dto: { title: string; description?: string; priority?: string; assignee?: string },
): Observable<Issue> {
  return this.http.post<Issue>(`${this.base}/projects/${projectId}/issues`, dto);
}

updateIssue(
  issueId: string,
  dto: { title?: string; description?: string; priority?: string; assignee?: string },
): Observable<Issue> {
  return this.http.patch<Issue>(`${this.base}/issues/${issueId}`, dto);
}
```

### 2. Add create-issue form to `ProjectIssuesComponent` (`apps/web/src/app/projects/project-issues.component.ts`)

Add a create-issue section below the issues table. The component must:

**Form fields (AC1):**
- Title: `<input matInput>` inside `<mat-form-field>`; required
- Description: `<textarea matInput>` inside `<mat-form-field>`; optional
- Priority: `<mat-select>` with options `low`, `medium`, `high`, `critical`; default `'medium'`
- Assignee: `<input matInput>` inside `<mat-form-field>`; optional

**Client-side validation (AC4):**
- Submit button `[disabled]="!newTitle.trim()"` (or equivalent) — blocked when title field is empty or whitespace-only
- No other client-side validation; remaining constraints are enforced by the API

**Archived-project detection (AC3):**
- No `GET /api/v1/projects/:id` endpoint exists; detection is via API response
- On `createIssue()` returning HTTP 409: set `projectArchived = true`; show "Project is archived — cannot create issues" message in the UI; submit button remains disabled
- `projectArchived` is component state; persists until page reload

**Submit flow:**
- On submit: call `this.api.createIssue(projectId, { title, description, priority, assignee })` (omit optional fields if empty)
- On success: set `successMessage = 'Issue created'`; clear the form fields; reload the issues list (`this.api.getIssues(projectId)`)
- On 409: set `projectArchived = true`; clear `successMessage`
- On other error: set `error` string

**Success feedback (AC6):**
- `@if (successMessage)` block rendering the success string; clear it on the next submit attempt

**Angular Material imports to add:** `MatFormFieldModule`, `MatInputModule`, `MatButtonModule`, `MatSelectModule` (add to the standalone `imports` array alongside existing `MatProgressSpinnerModule`, `MatTableModule`)

**State additions:**
```typescript
newTitle = '';
newDescription = '';
newPriority = 'medium';
newAssignee = '';
projectArchived = false;
successMessage = '';
```

Keep `ChangeDetectionStrategy.OnPush` + `cdr.markForCheck()` consistent with existing pattern.

### 3. Add inline edit mode to `IssueDetailComponent` (`apps/web/src/app/issues/issue-detail.component.ts`)

Add an edit mode that lets the user edit title, description, priority, and assignee in-place (AC2).

**Edit toggle:**
- Add `editMode = false` property
- In view mode: show an "Edit" button (visible only when `issue` is loaded and `!editMode`)
- Clicking "Edit" sets `editMode = true` and copies current field values into mutable edit state

**Edit state:**
```typescript
editMode = false;
editTitle = '';
editDescription = '';
editPriority = '';
editAssignee = '';
editSuccessMessage = '';
```

On entering edit mode:
```typescript
this.editTitle = this.issue.title;
this.editDescription = this.issue.description ?? '';
this.editPriority = this.issue.priority;
this.editAssignee = this.issue.assignee ?? '';
```

**Edit form (AC2):**
- Title: `<input matInput [(value)]="editTitle" (input)="editTitle = $event.target.value">` inside `<mat-form-field>`; required
- Description: `<textarea matInput>` inside `<mat-form-field>`; optional
- Priority: `<mat-select>` with options `low`, `medium`, `high`, `critical`
- Assignee: `<input matInput>` inside `<mat-form-field>`; optional
- "Save" button: `[disabled]="!editTitle.trim()"` (AC4)
- "Cancel" button: sets `editMode = false`; discards edit state (no API call)

**Save flow:**
- Call `this.api.updateIssue(issue.id, { title: editTitle, description: editDescription || undefined, priority: editPriority, assignee: editAssignee || undefined })`
- On success: set `editSuccessMessage = 'Issue saved'`; exit edit mode (`editMode = false`); reload the issue (`this.loadIssue(issue.id)`)
- On error: set `error` string

**Success feedback (AC6):**
- `@if (editSuccessMessage)` block in the view section (not inside edit mode); cleared when edit mode opens again

**Angular Material imports to add:** `MatSelectModule` (alongside existing Material imports)

### 4. Extend `apps/web/src/app/api/api.service.spec.ts`

Add specs for the two new methods following the existing `HttpTestingController` pattern:
- `createIssue()` — verify `POST .../projects/:projectId/issues` with correct body; returns `Issue`
- `updateIssue()` — verify `PATCH .../issues/:id` with correct body; returns `Issue`

### 5. Extend `apps/web/src/app/projects/project-issues.component.spec.ts`

Add specs covering:
- **AC1**: after flushing `getIssues`, form fields for title, description, priority, assignee are present in DOM
- **AC3**: mock `createIssue` returns `throwError(new HttpErrorResponse({ status: 409 }))` → "archived" message appears, submit disabled
- **AC4**: title field empty by default → submit button is disabled
- **AC6**: mock `createIssue` returns success → success message appears in DOM

Use the existing `HttpTestingController` setup in that spec file; mock `ApiService.createIssue` via a spy or override the provider when needed.

### 6. Extend `apps/web/src/app/issues/issue-detail.component.spec.ts`

Add specs covering:
- **AC2a**: edit button present in view mode; clicking it renders edit form fields
- **AC2b**: fill title input, click save → `updateIssue` spy called with correct values
- **AC4**: save button disabled when edit title is empty
- **AC6**: mock `updateIssue` returns success → success message appears in DOM

## Constraints (binding)

- Do NOT edit any file under `apps/api/`.
- Do NOT modify `apps/web/src/app/app.routes.ts`.
- Do NOT introduce NgModules; standalone components only.
- Do NOT remove or change `ProjectsListComponent`, `ProjectIssuesComponent`'s existing issues-table functionality, or `IssueDetailComponent`'s existing comment/status functionality.
- `npm run test:web` must exit 0 before signaling review-readiness. Run it and confirm.

## Self-coherence report

When implementation is complete and tests pass, write `.cdd/unreleased/9/self-coherence.md` on `cycle/9` covering:

- **§ Gap addressed and mode**: one paragraph
- **§ ACs met**: numbered checklist — yes/no per AC with one-line evidence
- **§ Files changed**: each file with approximate line-count delta
- **§ Skills loaded**: list skills read at session start
- **§ Test counts**: web suite before → after (`npm run test:web` output)
- **§ Known gaps or deferred items**: honest disclosure
- **§ Self-check**: confirm `git config user.email` == `alpha@issue-tracker.cdd.cnos`
- **§ CDD Trace**: brief trace of key decisions vs ACs
- **§ Pre-review gate**: table — each AC row with pass/fail

Commit implementation + specs + `self-coherence.md` to `cycle/9` before signaling done. Use separate commits per logical unit (ApiService changes, ProjectIssuesComponent changes, IssueDetailComponent changes, self-coherence) rather than one monolithic commit.
