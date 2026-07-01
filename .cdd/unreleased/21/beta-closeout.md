---
cycle: 21
issue: "gh #11 — enhancement: move create-issue into a MatDialog triggered from a New Issue button"
role: β
artifact: beta-closeout
---

# β Close-Out — Cycle 21

## Merge

- **Merge SHA:** `90bc91b`
- **Branch merged:** `cycle/21` → `main`
- **Merge command:** `git merge --no-ff cycle/21 -m "merge: cycle/21 — gh #11 move create-issue into MatDialog"`
- **origin/main base at review:** `49be9ff`
- **Implementation commit:** `0d3224c` (feat: move create-issue into MatDialog triggered from New Issue button)

## Test counts

| Suite | Count | Status |
|-------|-------|--------|
| Web (jest-preset-angular) | 72 | All pass |
| API (Jest) | 76 | Unchanged (not re-run; no API changes in this cycle) |

**Web test output (verified on cycle/21 before merge):**
```
Test Suites: 7 passed, 7 total
Tests:       72 passed, 72 total
Time:        2.2 s
```

Delta from baseline (cycle 20: 61 web): +11 net (removed 5 inline-form tests, added 10 dialog tests + 3 parent AC1/AC2 tests).

## ng build status

Exit 0. No NG8XXX errors.

```
Application bundle generation complete. [2.538 seconds]
▲ [WARNING] bundle initial exceeded maximum budget. Budget 500.00 kB was not met by 311.18 kB with a total of 811.18 kB.
```

Bundle size warning is pre-existing from CDK DragDrop (cycle 19). Not a finding.

## CI status

CI only triggers on `main` push/PR (O1 gap, deferred since cycle 17). `gh run list --branch cycle/21` returned no results — expected. β will verify CI after push to main.

## Mechanical pre-checks

| Check | Result |
|-------|--------|
| Git identity (α commits) | All implementation commits by `alpha@issue-tracker.cdd.cnos`. All γ artifacts by `gamma@issue-tracker.cdd.cnos`. |
| CI green gate | O1 gap — no CI run on branch (known, deferred). Local gate: 72 tests pass + ng build exits 0. |
| γ-scaffold presence | `.cdd/unreleased/21/gamma-scaffold.md` present on `origin/cycle/21`. |
| ng build | Exit 0, no NG8XXX. |
| Test suite | 72 web tests pass. |

## Review verdict

**APPROVED — Round 1 (single round)**

Zero findings. All AC oracles verified against code.

## Substantive review

### AC1: Create form not rendered inline

- `<div class="create-section">` absent from `project-issues.component.ts` template — verified.
- `MatFormFieldModule`, `MatInputModule`, `MatSelectModule` absent from parent component `imports[]` — verified.
- `<button mat-raised-button ... (click)="openNewIssueDialog()">New Issue</button>` present in header — verified.
- Test `'AC1: no create-form inputs rendered inline after load'` exists and passes.
- Test `'AC1: "New Issue" button is present after load'` exists and passes.

### AC2: "New Issue" opens the dialog

- `openNewIssueDialog()` calls `this.dialog.open(CreateIssueDialogComponent, { data: { projectId: this.projectId } satisfies CreateIssueDialogData })` — verified.
- `MatDialog` injected via `inject(MatDialog)`. `MatDialogModule` in `imports[]`. `CreateIssueDialogComponent` imported from `./create-issue-dialog.component`.
- `ref.afterClosed().subscribe((result) => { if (result) { this.loadIssues(); } })` — `if (result)` guard confirmed; cancel (no result) does NOT trigger reload.
- Tests `'AC2: clicking "New Issue" button calls MatDialog.open with CreateIssueDialogComponent'`, `'AC2: "New Issue" button is enabled and calls openNewIssueDialog on click'`, `'AC2: after dialog closes with result, loadIssues is called again'` — all pass.

**Spy pattern note:** α uses `component['dialog']` private field access in tests because `TestBed.inject(MatDialog)` returns a different instance for standalone components in Angular 17. This is the pragmatic Angular standalone testing pattern for this scenario. β assessed this as NIT/advisory, not blocking — the tests correctly exercise the behavior (dialog.open called with correct args; afterClosed triggers loadIssues). The pattern is disclosed in `self-coherence.md §Self-check` and `§Debt`.

### AC3: Submit creates, closes, refreshes

- `submit()` calls `this.api.createIssue(this.data.projectId, dto)` — verified at line 131.
- On success: `this.dialogRef.close(newIssue)` — verified at line 133.
- Parent refresh wired via `if (result) this.loadIssues()` — confirmed.
- Tests `'AC3: submit with valid title calls createIssue'` and `'AC3: on success, dialogRef.close is called with the new issue'` — both pass.

### AC4: Cancel and archived-project handling

- `cancel()` calls `this.dialogRef.close()` with no argument — verified at line 147.
- `submit()` 409 path: `this.archivedError = true`, does NOT call `dialogRef.close()` — verified.
- Template: `@if (archivedError) { <p class="archived-error">Project is archived — cannot create issues</p> }` — present.
- `loadProject()` sets `this.projectArchived = project.archived` at line 217 — verified.
- "New Issue" button: `[disabled]="projectArchived"` at line 40 — verified.
- AC4-cancel tests (2) and AC4-archived tests (3) — all pass.

### Wiring checks

| Claim | Status |
|-------|--------|
| `openNewIssueDialog()` called from button `(click)` | Verified — line 41 |
| `CreateIssueDialogComponent` imported | Verified — line 17 (programmatic open, not in template; not required in `imports[]`) |
| `afterClosed()` with `if (result)` guard | Verified — lines 303–306 |
| `loadProject()` sets `projectArchived` | Verified — line 217 |
| `MAT_DIALOG_DATA` provides `{ projectId }` | Verified — data shape `{ projectId: this.projectId }` matching `CreateIssueDialogData` |

### Honest-claim checks

| Claim | Status |
|-------|--------|
| §Gap: "rg returns zero matches pre-cycle" | γ scaffold §Selection peer enumeration provides empirical basis. |
| §Diff scope: +150/−0 dialog component | Verified. (`grep -c '^+'` = 150 includes `+++` header; methodology consistent with STACK.md §α-rule.) |
| §Diff scope: +176/−0 dialog spec | Verified. Same methodology. |
| §Diff scope: +26/−114 project-issues.ts | Verified exactly. |
| §Diff scope: +52/−54 project-issues.spec.ts | Verified exactly. |
| "72 tests passed, 72 total" | Verified — reproduced locally, matches test runner output. |

### Implementation contract (7 axes)

| Axis | Claim | Verified |
|------|-------|---------|
| Language | TypeScript strict | Yes — all new files TypeScript, `strict: true` |
| CLI integration | N/A (web app) | N/A |
| Package scoping | `apps/web/src/app/projects/` | Yes — both new files at correct path |
| Existing-binary disposition | N/A (greenfield) | N/A |
| Runtime dependencies | Angular 17, `@angular/material/dialog` (already installed) | Yes — no new packages |
| JSON/wire contract preservation | `createIssue` signature unchanged | Yes |
| Backward-compat invariant | N/A until v1 ships | N/A |

## Findings

Zero findings.

## Observations

1. **`component['dialog']` test spy pattern** — Angular 17 standalone injection creates a separate `MatDialog` instance per component hierarchy vs `TestBed.inject(MatDialog)`. α's solution of spying on `component['dialog']` is pragmatic and correctly tests the behavior. TypeScript strict mode permits private field access in test files. Assessed as NIT/informational only; no fix required.

2. **`CreateIssueDialogComponent` not in `imports[]`** — Correct Angular behavior. `MatDialog.open()` accepts the component class reference directly; the component does not need to appear in the host component's `imports[]` array for programmatic dialog opening. ng build confirms no NG8002.

3. **`loadIssues()` made public** — Required for `afterClosed()` subscription wiring and test spying. Reasonable disclosure; no encapsulation concern in this context.
