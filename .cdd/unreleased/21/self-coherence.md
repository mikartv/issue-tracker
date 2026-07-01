---
cycle: 21
issue: "gh #11 — enhancement: move create-issue into a MatDialog triggered from a New Issue button"
role: α
artifact: self-coherence
---

# Self-Coherence — Cycle 21

## §Gap

**Issue:** gh #11 — enhancement: move create-issue into a MatDialog triggered from a New Issue button

**Pre-cycle state:**
- `rg "MatDialog|CreateIssueDialog|createIssueDialog|dialog" apps/web/src/ --include="*.ts"` → zero matches (confirmed by γ §Selection peer enumeration)
- `ProjectIssuesComponent` had an always-visible inline create-section div containing 4 mat-form-fields (Title / Description / Priority / Assignee), a Create Issue button, and related component properties (`newTitle`, `newDescription`, `newPriority`, `newAssignee`, `successMessage`, `createError`, `projectArchived`)
- No `CreateIssueDialogComponent` existed; no dialog trigger existed

**Gap:** Inline always-visible create form occupies permanent vertical space below the issues board. Users cannot dismiss it. Modern pattern: create surface appears on intent (dialog) and dismisses on completion.

**Version / Mode:** design-and-build (4 ACs, single cycle, no split)

## §Skills

**Tier 1a (hard generation constraints):**
- `cnos.cdd/skills/cdd/alpha/SKILL.md` — α role contract (loaded first)

**Tier 2 (always-applicable):**
- `.cdd/PROJECT.md` — verified repo map (confirmed baseline: 61 web / 76 api tests)
- `.cdd/STACK.md` — pinned conventions (Angular 17, standalone components, OnPush, template-driven forms, jest-preset-angular)

**Tier 3 (issue-specific):**
- `.cdd/unreleased/21/gamma-scaffold.md` — γ decisions, affected surfaces, implementation notes
- `.cdd/unreleased/21/alpha-prompt.md` — detailed implementation specification

**Active constraints applied:**
- Standalone components only (no NgModules for feature code)
- `ChangeDetectionStrategy.OnPush` + `ChangeDetectorRef.markForCheck()`
- Template-driven form binding (`[value]` + `(input)`) consistent with existing forms
- `@angular/material/dialog` v17.3.x (already installed, no new package)
- TypeScript strict mode

## §ACs

Pre-cycle test baseline: 61 web tests, 76 api tests (cycle 20 γ close-out).
Post-cycle: 72 web tests (11 new net), 76 api tests (unchanged).

### AC1: Create form not rendered inline by default

**Claim:** No Title/Description create fields in the DOM on load; a "New Issue" button is present.

**Evidence:**
- Test `'AC1: no create-form inputs rendered inline after load'` — queries `.create-section` (null) and `input[matinput]` elements (0); **PASS**
- Test `'AC1: "New Issue" button is present after load'` — finds button with text "New Issue"; **PASS**
- Implementation: `<div class="create-section">` entirely removed from `project-issues.component.ts` template; `MatFormFieldModule`, `MatInputModule`, `MatSelectModule` removed from component imports
- Caller path: `<button mat-raised-button>New Issue</button>` in `header-row` div calls `openNewIssueDialog()`

### AC2: "New Issue" opens the dialog

**Claim:** Clicking "New Issue" opens `CreateIssueDialogComponent` via `MatDialog.open`.

**Evidence:**
- Test `'AC2: clicking "New Issue" button calls MatDialog.open with CreateIssueDialogComponent'` — spies on `component['dialog'].open`, calls `component.openNewIssueDialog()`, verifies called with `CreateIssueDialogComponent` and `{ data: { projectId: PROJECT_ID } }`; **PASS**
- Test `'AC2: "New Issue" button is enabled and calls openNewIssueDialog on click'` — verifies button exists, is not disabled, triggers one call to `dialog.open`; **PASS**
- Test `'AC2: after dialog closes with result, loadIssues is called again'` — mocks `dialog.open` returning `of(newIssue)`, verifies `getIssues` called twice (init + after close); **PASS**
- Implementation: `openNewIssueDialog()` method calls `this.dialog.open(CreateIssueDialogComponent, { data: { projectId: this.projectId } })`; `ref.afterClosed().subscribe(result => { if (result) this.loadIssues(); })`

### AC3: Submit creates, closes, refreshes

**Claim:** Valid submit calls `createIssue`, closes the dialog, refreshes the board.

**Evidence (dialog component tests):**
- Test `'AC3: submit with valid title calls createIssue'` — sets `component.title`, calls `component.submit()`, verifies `createIssue` called with `(PROJECT_ID, { title: 'My Issue', ... })`; **PASS**
- Test `'AC3: on success, dialogRef.close is called with the new issue'` — verifies `dialogRef.close(newIssue)` called; **PASS**
- Parent refresh: `ref.afterClosed().subscribe(result => { if (result) this.loadIssues(); })` (covered by AC2 reload test)

### AC4: Cancel and archived-project handling

**Claim:** Cancel closes without creating; 409 surfaces archived message and blocks creation.

**Evidence (dialog component tests):**
- Test `'AC4-cancel: Cancel click calls dialogRef.close() without calling createIssue'` — clicks Cancel button; verifies `dialogRef.close()` called, `createIssue` not called; **PASS**
- Test `'AC4-cancel: dialogRef.close called with no argument on cancel'` — calls `component.cancel()`, verifies single `close()` call with no args; **PASS**
- Test `'AC4-archived: 409 response sets archivedError flag'` — mocks 409 error, calls `submit()`, verifies `component.archivedError === true` and DOM contains "archived"; **PASS**
- Test `'AC4-archived: 409 response does NOT close the dialog'` — verifies `dialogRef.close` not called on 409; **PASS**
- Test `'AC4-archived: non-409 error sets submitError, not archivedError'` — 500 error sets `submitError`; **PASS**
- Parent "New Issue" button: `[disabled]="projectArchived"` — set from `loadProject()` which now sets `this.projectArchived = project.archived`
