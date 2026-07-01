# α Dispatch Prompt — Cycle 21

You are α (implementer). Project: issue-tracker.
Dispatch config: §5.2 (δ=γ, single-session Claude Code).

## Load order (mandatory, in this exact order)

1. **Tier 1a — load before any other step** (hard generation constraints):
   - `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`

2. **Project context** (read before implementation):
   - `gh issue view 11` — full contract (gap, ACs, non-goals, proof plan)
   - `.cdd/PROJECT.md` — verified repo map
   - `.cdd/STACK.md` — pinned conventions
   - `.cdd/unreleased/21/gamma-scaffold.md` — γ decisions, affected surfaces, scope

## Session start (mandatory — run before anything else)

```bash
git fetch origin
git switch cycle/21
git rebase origin/main
```

This ensures γ-authored artifacts (including scaffold and this prompt) are in your working tree.

## Branch

`cycle/21` (already exists on `origin`)

## Issue

`gh issue view 11` — enhancement: move create-issue into a MatDialog triggered from a New Issue button

## Working tree state

Two draft files already exist as **untracked** files in the working tree from the γ scaffold session. Do NOT discard them — read them, verify they are correct, adjust if needed, and commit them as part of your implementation:

- `apps/web/src/app/projects/create-issue-dialog.component.ts` (~149 lines)
- `apps/web/src/app/projects/create-issue-dialog.component.spec.ts` (~175 lines)

These are mostly complete but have not been tested yet. You must verify they compile and their tests pass (after you update the parent component).

## What to build

### 1. `apps/web/src/app/projects/create-issue-dialog.component.ts` (already drafted — verify + commit)

Standalone `CreateIssueDialogComponent`:
- Exports `CreateIssueDialogData` interface: `{ projectId: string }`
- Imports: `MatDialogModule`, `MatFormFieldModule`, `MatInputModule`, `MatButtonModule`, `MatSelectModule`
- Fields: Title* (required), Description, Priority (select: low/medium/high/critical), Assignee
- Submit: calls `api.createIssue(data.projectId, dto)` → on success `dialogRef.close(newIssue)`; on 409 sets `archivedError = true` (does NOT close); on other error sets `submitError`
- Cancel: `dialogRef.close()` (no arg, no API call)
- `ChangeDetectionStrategy.OnPush`; inject `ApiService`, `MatDialogRef`, `MAT_DIALOG_DATA`, `ChangeDetectorRef`

Read the existing draft file. If it matches this spec, use it as-is. If any adjustment is needed, fix it.

### 2. `apps/web/src/app/projects/create-issue-dialog.component.spec.ts` (already drafted — verify + commit)

Unit tests covering:
- AC1-dialog: all four form fields present (Title, Description, Priority, Assignee)
- AC3: submit calls `createIssue`; on success `dialogRef.close` called with new issue
- AC4-cancel: Cancel calls `dialogRef.close()` without calling `createIssue`
- AC4-archived: 409 response sets `archivedError = true`; dialog does NOT close; non-409 error sets `submitError`

Read the existing draft file. If it matches these requirements, use it as-is.

### 3. `apps/web/src/app/projects/project-issues.component.ts` (rewrite the create section)

**Remove** (inline create form — no longer needed):
- `<div class="create-section">...</div>` template block entirely
- `.create-section`, `.form-field`, `.create-error` CSS rules
- `MatFormFieldModule`, `MatInputModule`, `MatSelectModule` imports (from the component's `imports` array) — **only if** they are not used elsewhere in the template. Check: these are used in the create form section only; confirm not used in board template. If not used elsewhere, remove them.
- Properties: `newTitle`, `newDescription`, `newPriority`, `newAssignee`, `successMessage`, `createError`, `priorities`
- Methods: `submitCreate()`, `onNewTitleChange()`, `onNewDescriptionChange()`, `onNewAssigneeChange()`

**Add** (dialog integration):
- Import `MatDialog` and `MatDialogModule` from `@angular/material/dialog`
- Import `CreateIssueDialogComponent` and `CreateIssueDialogData` from `./create-issue-dialog.component`
- Add `MatDialogModule` to `imports` array (for mat-dialog-* directives if any; minimally for `MatDialog` injection)
- Add `MatDialog` to inject: `private readonly dialog = inject(MatDialog);`
- **Update `loadProject()`**: add `this.projectArchived = project.archived;` after setting `projectName`. The `projectArchived` property stays on the parent (it gates the "New Issue" button).
- **Add "New Issue" button** to the template, in the heading area (e.g. row with h2 and button side by side), **above** the board:
  ```html
  <div class="header-row">
    <h2>{{ projectName ? 'Issues — ' + projectName : 'Issues' }}</h2>
    <button mat-raised-button color="primary"
            [disabled]="projectArchived"
            (click)="openNewIssueDialog()">New Issue</button>
  </div>
  ```
- **Add `openNewIssueDialog()` method**:
  ```typescript
  openNewIssueDialog(): void {
    const ref = this.dialog.open(CreateIssueDialogComponent, {
      data: { projectId: this.projectId } satisfies CreateIssueDialogData,
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.loadIssues();
      }
    });
  }
  ```
- Add `.header-row` CSS: `display: flex; align-items: center; gap: 16px; margin-bottom: 16px;`

**Keep** (unmodified):
- All board/Kanban template and logic (cdkDropList, cards, drag-drop handler)
- `projectArchived` property (now set from `loadProject()`)
- `loadProject()`, `loadIssues()`, `distributeIssues()`, `otherStatuses()`, `onDrop()`
- All board-related styles

**Note on imports**: After removing `MatFormFieldModule`, `MatInputModule`, `MatSelectModule` from the parent, verify the board template does NOT use mat-form-field, mat-input, or mat-select. The board template uses only: RouterLink, DragDropModule, MatProgressSpinnerModule, MatButtonModule, ChipComponent. So removing those three is safe.

### 4. `apps/web/src/app/projects/project-issues.component.spec.ts` (update tests)

**Remove** these 5 tests that test the now-removed inline form:
1. `'create form fields for title, description, priority, assignee are present in DOM after load'`
2. `'409 on createIssue shows archived message and Create Issue button is disabled'`
3. `'Create Issue button is disabled when title is empty'`
4. `'non-409 submit failure shows createError inline'`
5. `'success message appears after successful createIssue'`

**Add** these AC tests for the dialog path:

**AC1: No inline create form; "New Issue" button present**
```typescript
it('AC1: no create-form inputs rendered inline after load', () => {
  fixture.detectChanges();
  flushLoad();
  const el: HTMLElement = fixture.nativeElement;
  // create-section is gone; no "Create Issue" h3 or create-section div
  expect(el.querySelector('.create-section')).toBeNull();
  // At most board form fields (none) — check title/description inputs absent
  const inputs = Array.from(el.querySelectorAll<HTMLInputElement>('input[matinput]'));
  // No mat-input create fields on parent (dialog owns them)
  expect(inputs.length).toBe(0);
});

it('AC1: "New Issue" button is present after load', () => {
  fixture.detectChanges();
  flushLoad();
  const el: HTMLElement = fixture.nativeElement;
  const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
  const newIssueBtn = buttons.find((b) => b.textContent?.includes('New Issue'));
  expect(newIssueBtn).toBeDefined();
});
```

**AC2: Clicking "New Issue" calls MatDialog.open with CreateIssueDialogComponent**
```typescript
import { MatDialog } from '@angular/material/dialog';
import { CreateIssueDialogComponent } from './create-issue-dialog.component';

it('AC2: clicking "New Issue" button calls MatDialog.open with CreateIssueDialogComponent', () => {
  const dialog = TestBed.inject(MatDialog);
  const openSpy = jest.spyOn(dialog, 'open').mockReturnValue({
    afterClosed: () => of(undefined),
  } as any);

  fixture.detectChanges();
  flushLoad();

  const el: HTMLElement = fixture.nativeElement;
  const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
  const newIssueBtn = buttons.find((b) => b.textContent?.includes('New Issue'));
  newIssueBtn!.click();

  expect(openSpy).toHaveBeenCalledWith(
    CreateIssueDialogComponent,
    expect.objectContaining({ data: expect.objectContaining({ projectId: PROJECT_ID }) }),
  );
});

it('AC2: after dialog closes with result, loadIssues is called', () => {
  const apiService = TestBed.inject(ApiService);
  const dialog = TestBed.inject(MatDialog);
  const newIssue = makeIssue({ id: 'i99', title: 'New' });
  jest.spyOn(dialog, 'open').mockReturnValue({
    afterClosed: () => of(newIssue),
  } as any);
  const getIssuesSpy = jest.spyOn(apiService, 'getIssues').mockReturnValue(of([]));

  fixture.detectChanges();
  flushLoad();

  component.openNewIssueDialog();

  // getIssues called again after dialog close with result
  expect(getIssuesSpy).toHaveBeenCalledTimes(2); // once on init, once on dialog close
});
```

**Note**: You may need to add `MatDialogModule` to the `TestBed.configureTestingModule` imports for these tests to work:
```typescript
import { MatDialogModule } from '@angular/material/dialog';
// add MatDialogModule to the imports array in beforeEach
```

Also add `of` to existing rxjs imports if not already present.

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) |
| CLI integration target | N/A |
| Package scoping | `apps/web/` only — no changes to `apps/api/` |
| Existing-binary disposition | N/A |
| Runtime dependencies | `@angular/material/dialog` (~17.3, already in `apps/web/package.json`) |
| JSON/wire contract preservation | No API changes; `createIssue` signature unchanged |
| Backward-compat invariant | All existing board/drag-drop tests must pass |

## Non-goals (do not implement)

- Field or validation changes inside the dialog
- Edit-via-dialog (issue-detail edit stays as-is)
- Create-project dialog
- Toast notifications (that is a future cycle)
- `ng build` CI step (deferred to δ)

## Self-coherence

Write `.cdd/unreleased/21/self-coherence.md` on `cycle/21`. Required sections:

- **§Gap** — what was absent before this cycle (cite: `rg "MatDialog|CreateIssueDialog" apps/web/src/` returning zero matches pre-cycle; inline always-visible form; no dialog component)
- **§Mode** — design-and-build
- **§Status truth** — what ships (dialog component, parent updated, inline form removed)
- **§Implementation plan** — ordered steps as executed
- **§AC evidence** — for each AC1–AC4: test name(s) that cover it; pass/fail
- **§Diff scope** — list of files changed with `+`/`-` line counts derived from `git diff origin/main` AFTER all source edits are committed (per STACK.md §α-rule: self-coherence diff counts — run the git diff command; never estimate)
- **§Transient rows** — CI status on `cycle/21` at time of review-readiness signal (`gh run list --branch cycle/21 --limit 5`)
- **§Debt** — any known gaps (e.g. no e2e, bundle size warning pre-existing)

Source the **pre-cycle test baseline** from cycle 20 γ close-out: **61 web tests, 76 api tests**.

## Pre-review gate

```bash
npm run test:web
```

All web tests must pass before signaling review-readiness. Document the final count in `self-coherence.md §Transient rows`. The count will differ from the baseline (inline form tests removed, dialog tests added) — document the delta explicitly.

Also run:

```bash
cd apps/web && npx ng build --configuration=production
```

`ng build` must exit 0 with no NG8XXX errors. Document the result in `self-coherence.md §Transient rows`.

## Git identity

```bash
git config user.email "alpha@issue-tracker.cdd.cnos"
git config user.name "alpha"
```

Set before any commits.

## Completion signal

Commit `self-coherence.md` to `cycle/21` and push. That push is the review-readiness signal.
