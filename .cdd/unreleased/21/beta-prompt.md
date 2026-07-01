# β Dispatch Prompt — Cycle 21

You are β (reviewer). Project: issue-tracker.
Dispatch config: §5.2 (δ=γ, single-session Claude Code).

## Load order (mandatory, in this exact order)

1. **Tier 1a — load before any other step** (hard generation constraints):
   - `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md`
   - `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/review/SKILL.md`

2. **Project context**:
   - `gh issue view 11` — full contract (gap, ACs, non-goals, proof plan)
   - `.cdd/PROJECT.md`
   - `.cdd/STACK.md`
   - `.cdd/unreleased/21/gamma-scaffold.md`
   - `.cdd/unreleased/21/self-coherence.md` (α's artifact — read before reviewing)

## Session start (mandatory)

```bash
git fetch origin
git switch cycle/21
git rebase origin/main
```

## Branch

`cycle/21`

## Issue

`gh issue view 11` — enhancement: move create-issue into a MatDialog triggered from a New Issue button

## Mechanical pre-checks (run in this order before any other review step)

### 1. Git identity check (STACK.md §β-rule)

```bash
git log cycle/21 --format='%ae %s'
```

Any implementation (feat/fix) commit NOT authored by `alpha@issue-tracker.cdd.cnos` is an RC finding, severity D (`git-identity`). CDD artifact commits (self-coherence, alpha-prompt, gamma-scaffold) may be authored by `alpha@` or `gamma@` per protocol.

### 2. CI green gate (STACK.md §β-rule)

```bash
gh run list --branch cycle/21 --limit 5
```

Note: per PROJECT.md and α's §Transient rows, CI only triggers on `main` push — `cycle/21` will return no runs. This is the known structural O1 gap (deferred since cycle 17). β should note this in close-out but it is NOT an RC finding. Proceed to local gate below.

### 3. γ-scaffold presence check (review/SKILL.md 3.11b)

```bash
git ls-tree -r --name-only origin/cycle/21 .cdd/unreleased/21/gamma-scaffold.md
```

Must return a non-empty result. If empty → RC finding, severity D (`protocol-compliance`).

### 4. Angular ng build (STACK.md §β-rule — mandatory for template changes)

```bash
cd apps/web && npx ng build --configuration=production
```

Must exit 0 with no NG8XXX errors. Non-zero exit or NG8XXX diagnostic → RC finding, severity D (`aot-build-fail`). The bundle size warning (initial bundle > 500 kB) is pre-existing from CDK drag-and-drop (cycle 19) — not a finding.

### 5. Run test suite

```bash
npm run test:web
```

Expected result: ≥72 web tests pass (α reports 72 — delta from baseline 61: −5 inline-form tests, +16 new dialog/AC tests). All existing board/drag-drop tests must pass.

## Substantive review

### AC1: Create form not rendered inline; "New Issue" button present

**Claim from issue:** Load `/projects/:id/issues`; no Title/Description create fields in DOM; "New Issue" button present.

**Review evidence to verify:**
- `project-issues.component.ts` template: confirm `<div class="create-section">` is absent. Confirm no `mat-form-field` for create in the parent template.
- Confirm `MatFormFieldModule`, `MatInputModule`, `MatSelectModule` are removed from the component's `imports` array (since board template doesn't use them).
- Confirm `<button ... (click)="openNewIssueDialog()">New Issue</button>` is present in the template.
- Tests: `'AC1: no create-form inputs rendered inline after load'` and `'AC1: "New Issue" button is present after load'` exist and pass in `project-issues.component.spec.ts`.

### AC2: "New Issue" opens the dialog

**Claim from issue:** Clicking "New Issue" opens `CreateIssueDialogComponent`.

**Review evidence to verify:**
- `project-issues.component.ts`: `openNewIssueDialog()` method exists; calls `this.dialog.open(CreateIssueDialogComponent, { data: { projectId: this.projectId } })`.
- `MatDialog` injected in the component; `MatDialogModule` in imports.
- `CreateIssueDialogComponent` imported from `./create-issue-dialog.component`.
- `ref.afterClosed().subscribe(result => { if (result) this.loadIssues(); })` — refresh wired.
- Tests: `'AC2: clicking "New Issue" button calls MatDialog.open with CreateIssueDialogComponent'` and `'AC2: after dialog closes with result, loadIssues is called again'` exist in spec.

**Note on spy pattern:** α reports using `component['dialog']` (private field access) to spy on `MatDialog.open`, because `TestBed.inject(MatDialog)` returns a different instance for standalone components. Evaluate whether this constitutes a test-wiring finding. The pattern is pragmatic but non-standard; assess severity. If `openNewIssueDialog()` is publicly callable and `loadIssues()` was made public, consider whether the tests could use a cleaner approach.

### AC3: Submit creates, closes, refreshes

**Claim from issue:** Valid submit → `createIssue` → dialog closes with result → parent refreshes.

**Review evidence to verify (dialog component):**
- `create-issue-dialog.component.ts`: `submit()` calls `this.api.createIssue(this.data.projectId, dto)`.
- On success: `this.dialogRef.close(newIssue)` — closes with the new issue as result.
- Tests: `'AC3: submit with valid title calls createIssue'` and `'AC3: on success, dialogRef.close is called with the new issue'` pass.

### AC4: Cancel and archived-project handling

**Claim from issue:** Cancel closes without creating; 409 response shows archived message; dialog stays open on 409.

**Review evidence to verify (dialog component):**
- `cancel()` method: `this.dialogRef.close()` with no argument; no API call.
- `submit()` error path: on 409 → `this.archivedError = true`; `dialogRef.close()` NOT called.
- Template: `@if (archivedError) { <p ...>Project is archived — cannot create issues</p> }` shown in dialog.
- "New Issue" button on parent: `[disabled]="projectArchived"` — set via `loadProject()` which now sets `this.projectArchived = project.archived`.
- Tests: AC4-cancel (2) and AC4-archived (3) pass.

## Honest-claim checks

- `self-coherence.md §Gap`: asserts "rg returns zero matches pre-cycle" — verify grep evidence is cited, not assumed.
- `self-coherence.md §Diff scope`: table shows `+150/-0` for dialog component (new), `+176/-0` for dialog spec (new), `+26/-114` for project-issues, `+52/-54` for project-issues spec. Do these match the actual diff?
- `self-coherence.md §AC evidence`: test names listed — verify they exist in the spec files.
- `self-coherence.md §Transient rows`: "72 tests passed, 72 total" — verify against `npm run test:web`.

## Wiring checks

- `openNewIssueDialog()` is CALLED from the template (not just declared) — check button `(click)` binding.
- `CreateIssueDialogComponent` is in the component's `imports` array (standalone) — check.
- `afterClosed()` subscription: result is checked with `if (result)` before calling `loadIssues()` — cancel (no result) must NOT trigger reload.
- `loadProject()` now sets `this.projectArchived = project.archived` — verify this line is present.
- `MAT_DIALOG_DATA` provides `{ projectId }` to the dialog — verify the data shape matches `CreateIssueDialogData`.

## Non-goal check (do not flag these as findings)

- No field/validation changes inside dialog
- No edit-via-dialog implementation
- No create-project dialog
- No toast notifications
- No `ng build` CI step

## Output

### If APPROVE

1. Run `npm run test:web` — all tests must pass.
2. Merge: `git merge --no-ff cycle/21` (into `main`) from the `main` branch.
3. Write `.cdd/unreleased/21/beta-closeout.md` with: merge SHA, test count (web + api), CI status, ng build status, findings summary (or zero findings), notable observations.
4. Commit `beta-closeout.md` to `main`.
5. Use git identity: `git config user.email "beta@issue-tracker.cdd.cnos"` for β-authored commits.
6. Close gh #11: `gh issue close 11`.

### If REQUEST CHANGES

Write `.cdd/unreleased/21/beta-review.md` with all findings. For each finding:
- ID (D-1, C-1, B-1, A-1…)
- Severity: D (blocking, must fix) / C (should fix) / B (advisory) / A (NIT)
- Class: mechanical / wiring / honest-claim / judgment / contract / protocol-compliance
- Description: what is wrong, where, AC or surface reference
- Required action: what α must do to resolve

Commit `beta-review.md` to `cycle/21` (not to `main`). Use identity `beta@issue-tracker.cdd.cnos`.
