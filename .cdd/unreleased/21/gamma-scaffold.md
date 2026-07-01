---
cycle: 21
issue: "gh #11 — enhancement: move create-issue into a MatDialog triggered from a New Issue button"
role: γ
artifact: gamma-scaffold
---

# γ Scaffold — Cycle 21

## Issue

gh #11 — enhancement: move create-issue into a MatDialog triggered from a New Issue button

## Mode

design-and-build (4 ACs, small band — no split required)

## Selection

**Decisive clause:** Assessment-commitment default — cycle 19 γ close-out committed gh #11 as next
feature cycle after the P0 fix. P0 (cycle 20) shipped. Commitment activates.

**Peer enumeration (§2.2a):**

- `rg "MatDialog|CreateIssueDialog|createIssueDialog|dialog" apps/web/src/ --include="*.ts"` → zero matches.
  Assertion "No dialog component, no trigger" is empirically true.
- `ls apps/web/src/app/projects/` → `project-issues.component.ts`, `project-issues.component.spec.ts`,
  `projects-list.component.ts`, `projects-list.component.spec.ts`. No existing dialog file.
- `apps/web/src/app/shared/` → `chip.component.ts`, `chip.component.spec.ts`, `issue-labels.ts`.
  No dialog there either.

## Surfaces α will touch

| Surface | Change |
|---------|--------|
| `apps/web/src/app/projects/project-issues.component.ts` | Remove inline create form; add "New Issue" button; inject `MatDialog`; open `CreateIssueDialogComponent` on click; update `loadProject()` to set `projectArchived` from `project.archived` |
| NEW `apps/web/src/app/projects/create-issue-dialog.component.ts` | Standalone `CreateIssueDialogComponent` containing the create fields (Title / Description / Priority / Assignee), submit and cancel handlers, 409 path |
| NEW `apps/web/src/app/projects/create-issue-dialog.component.spec.ts` | Unit tests for dialog: opens with fields; submit calls createIssue; cancel closes without API call; 409 shows archived message |
| `apps/web/src/app/projects/project-issues.component.spec.ts` | Replace inline form DOM assertions with "New Issue" button AC tests; update 409/error/submit tests to use dialog mock |

## AC oracle approach

- **AC1** (form not rendered inline): DOM query for create field inputs on `project-issues` fixture returns 0 after load; "New Issue" button present.
- **AC2** (button opens dialog): spy `MatDialog.open`; simulate click on "New Issue"; verify `open` called with `CreateIssueDialogComponent`.
- **AC3** (submit creates, closes, refreshes): spy `api.createIssue` + `dialogRef.close`; simulate valid submit; verify API called, dialog closed, `loadIssues` triggered.
- **AC4** (cancel + archived): simulate Cancel click → `close()` without API call; simulate 409 → dialog surfaces archived message.

## Expected diff scope

- `project-issues.component.ts`: ~100 lines removed (create-section template + create* properties + `submitCreate` + input handlers), ~25 lines added (button, dialog inject, open call, archived from project load)
- New `create-issue-dialog.component.ts`: ~150 lines
- New `create-issue-dialog.component.spec.ts`: ~120 lines
- `project-issues.component.spec.ts`: ~50 lines changed (replace 6 inline form tests with 4 dialog AC tests)

Net: ~+150 new lines, ~−75 removed lines across 4 files.

## Implementation notes for α

1. `MatDialog` is in `@angular/material/dialog` (Angular Material 17.3.x — already a dep; no new package install).
2. `CreateIssueDialogComponent` is standalone; it imports `MatDialogModule`, `MatFormFieldModule`, `MatInputModule`, `MatSelectModule`, `MatButtonModule`, and `ReactiveFormsModule` or template-driven binding consistent with existing forms.
3. Data passed into the dialog via `MAT_DIALOG_DATA`: `{ projectId: string }`. Returned via `dialogRef.close(newIssue)` on success, `dialogRef.close()` on cancel.
4. Parent (`ProjectIssuesComponent`) calls `dialogRef.afterClosed().subscribe(result => { if (result) this.loadIssues(); })` to trigger refresh.
5. 409 inside the dialog: catch in the dialog's error handler; set a local `archivedError` flag → show "Project is archived — cannot create issues"; do NOT close the dialog (user sees the error inside).
6. "New Issue" button disabled when `projectArchived === true` (set from `project.archived` in `loadProject()`).
7. `loadProject()` should be updated to also set `this.projectArchived = project.archived` — currently it only sets `this.projectName`.
8. Remove all inline `create-section` template, `newTitle / newDescription / newPriority / newAssignee / successMessage / createError / projectArchived` properties that are now dialog-owned. Keep `projectArchived` on the parent (read-only, from project load) to gate the "New Issue" button.
9. `ng build` must pass (NG8002 check). Add `MatDialogModule` to `ProjectIssuesComponent` imports for the `mat-dialog` directives used in the button/template area; the dialog component itself imports what it needs.
10. Tests: `ProjectIssuesComponent` spec — use `MatDialog` spy via `TestBed.inject(MatDialog)` and `jest.spyOn(dialog, 'open')`. Dialog spec — use `TestBed.configureTestingModule` with `MatDialogRef` and `MAT_DIALOG_DATA` providers.
11. Existing `project-issues.component.spec.ts` tests that assert on the inline create form DOM ("create form fields for title, description, priority, assignee are present in DOM after load", "409 on createIssue shows archived message", "Create Issue button is disabled when title is empty", "non-409 submit failure shows createError inline", "success message appears after successful createIssue") must be replaced — they test the removed inline form. Replace with equivalent dialog-path tests or remove obsolete assertions.

## Dispatch config

§5.2 (δ=γ, single-session Claude Code)
