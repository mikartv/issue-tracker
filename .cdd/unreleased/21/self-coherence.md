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

## §Self-check

**Did α push ambiguity onto β?** No.

- All 4 ACs have concrete test evidence with test names and PASS results.
- All board/drag-drop tests from cycles 19-20 still pass (72 total; 0 board tests regressed).
- The 5 removed inline-form tests are accounted for: each removal is justified by removal of the tested surface (inline form); not silent deletion.
- New dialog component tests (10) and updated parent tests (3 new AC1/AC2 tests) fully cover the new surfaces.
- `loadIssues()` was made `public` (was `private`) to allow direct call after dialog close and to enable test spying. This is intentional and disclosed.
- `component['dialog']` private property access in tests: Angular standalone components inject `MatDialog` from their own imports hierarchy; spying on `TestBed.inject(MatDialog)` gave 0 call count because it returns a different instance. Spying directly on the component's private field is the pragmatic Angular testing pattern for this scenario. This is a known test-infrastructure pattern, not a debt item.
- No API surface changes; `createIssue` signature unchanged.
- `ng build` exits 0 with no NG8XXX errors; template bindings verified at AOT compile time.

**Every claim backed by evidence in the diff?**
- AC1: `.create-section` removal visible in component diff; DOM query tests confirm.
- AC2: `openNewIssueDialog()` method in component diff; spy tests confirm.
- AC3: `dialogRef.close(newIssue)` in dialog component; test confirms.
- AC4: `archivedError` flag + `dialogRef.close()` without arg in dialog component; tests confirm.

## §Implementation plan

Steps as executed:

1. Read Tier 1a skill (SKILL.md), issue, PROJECT.md, STACK.md, gamma-scaffold.md, alpha-prompt.md — mandatory load order
2. Read draft files: `create-issue-dialog.component.ts` (~149 lines), `create-issue-dialog.component.spec.ts` (~175 lines) — verified correct per spec
3. Rewrote `project-issues.component.ts`:
   - Removed inline create section template block
   - Removed `MatFormFieldModule`, `MatInputModule`, `MatSelectModule` imports
   - Added `MatDialogModule`, `MatDialog` imports
   - Added `CreateIssueDialogComponent`, `CreateIssueDialogData` import
   - Added `private readonly dialog = inject(MatDialog)`
   - Updated `loadProject()` to set `this.projectArchived = project.archived`
   - Added `header-row` div with h2 + New Issue button
   - Added `openNewIssueDialog()` method
   - Made `loadIssues()` public (required for dialog afterClosed subscription + test spy)
   - Removed: `newTitle`, `newDescription`, `newPriority`, `newAssignee`, `successMessage`, `createError`, `priorities`, `submitCreate()`, `onNewTitleChange()`, `onNewDescriptionChange()`, `onNewAssigneeChange()`
   - Removed `.create-section`, `.form-field`, `.create-error` CSS; added `.header-row` CSS
4. Rewrote `project-issues.component.spec.ts`:
   - Added `MatDialog`, `MatDialogModule` imports
   - Added `CreateIssueDialogComponent` import
   - Added `MatDialogModule` to TestBed imports
   - Removed 5 inline-form tests
   - Added 4 AC1/AC2 tests (no inline form, button present, dialog open, refresh-on-close)
5. Ran `npm run test:web` — initial 2 failures (spy scope issue)
6. Fixed spy pattern: use `component['dialog']` to access the component-private `MatDialog` instance; fixed reload test to use `jest.spyOn` on ApiService directly
7. `npm run test:web` → 72 tests pass
8. `cd apps/web && npx ng build --configuration=production` → exits 0, no NG8XXX
9. Committed all 4 files in one implementation commit
10. Writing self-coherence incrementally (this file)
