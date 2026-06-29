# β Dispatch Prompt — Cycle 19

You are β (reviewer). Project: issue-tracker.
Dispatch config: §5.2 (δ=γ, single-session Claude Code).

## Load order (mandatory, in this exact order)

1. **Tier 1a — load before any other step** (hard generation constraints):
   - `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md`
   - `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/review/SKILL.md`

2. **Project context**:
   - `gh issue view 10` — full contract (gap, ACs, non-goals, proof plan)
   - `.cdd/PROJECT.md`
   - `.cdd/STACK.md`
   - `.cdd/unreleased/19/gamma-scaffold.md`
   - `.cdd/unreleased/19/self-coherence.md` (α's artifact — read before reviewing)

## Branch

`cycle/19`

## Issue

`gh issue view 10` — enhancement: Kanban board view for project issues with cdk drag-and-drop

## Mechanical pre-checks (run in this order before any other review step)

### 1. Git identity check

```bash
git log cycle/19 --format='%ae %s'
```

Any implementation (feat/fix) commit NOT authored by `alpha@issue-tracker.cdd.cnos` → RC finding, severity D (`git-identity`).

### 2. CI green gate

```bash
gh run list --branch cycle/19 --limit 5
```

Most recent run must be `completed / success`. If not → RC finding, severity D (`ci-red`).

### 3. γ-scaffold presence check

```bash
git ls-tree -r --name-only origin/cycle/19 .cdd/unreleased/19/gamma-scaffold.md
```

Must return a non-empty result. If empty → RC finding, severity D (`protocol-compliance`).

## Substantive review

### AC1: Four status columns render

Oracle from issue: open `/projects/:id/issues`; confirm Open / In Progress / Done / Closed columns present with counts.

Review evidence: find four `cdkDropList` elements in the template; each headed by status label + count; no `mat-table` element present.

### AC2: Issues render as draggable cards with chips

Oracle: inspect a populated column.

Review evidence: `cdkDrag` wraps each issue card; `app-chip [kind]="'priority'"` present; title linked via `routerLink="/issues/:id"`.

### AC3: Drag to another column updates status

Oracle: drag card to different column; `POST /issues/:id/status` fires; card stays.

Review evidence:
- Drop handler calls `api.updateIssueStatus(issue.id, targetStatus)` where `targetStatus` is the target column's status value
- `cdkDropListConnectedTo` links all four columns bidirectionally
- Test mocks `updateIssueStatus` success; asserts card remains in target column after drop

### AC4: Failed move reverts

Oracle: simulate API error; card snaps back; error shown.

Review evidence:
- Drop handler error path calls `transferArrayItem` back (or equivalent) to restore origin column
- Test mocks `updateIssueStatus` error; asserts card returns to origin column; error message shown

### AC5: Project name in heading via getProject

Oracle: open `/projects/:id/issues` for project named "Alpha"; heading reads "Issues — Alpha".

Review evidence:
- `api.getProject(projectId)` is called in `ngOnInit` (not `getProjects`)
- Heading template binds project name
- Fallback while loading (plain "Issues")
- Test mocks `getProject` → asserts heading contains project name; `GET /projects/:id` used (not list endpoint)

## Honest-claim checks

- `self-coherence.md §Gap`: does it match grep evidence (getProject absent, no cdkDrag surfaces)?
- `self-coherence.md §Diff scope`: do the listed files match the actual diff?
- `self-coherence.md §AC evidence`: do the test names exist in the spec files?
- `self-coherence.md §Transient rows`: does CI status match `gh run list` output?

## Wiring checks (review/SKILL.md 3.13c)

- `getProject` is CALLED in the component (not just declared in ApiService)
- All four `cdkDropList` columns are connected to each other via `cdkDropListConnectedTo`
- Drop handler uses the target COLUMN's `status` value (not a hardcoded string)
- On error: card IS reverted to origin column (not just an error message shown without revert)

## Non-goal check

No create-issue dialog implemented (R6). No within-column rank persistence. No realtime sync.

## Create-issue form reachability

Issue requires: "creating issues must remain reachable." Verify the inline form or a stub button is present and functional (or explicitly noted in self-coherence §Debt if deferred with justification).

## Output

### If APPROVE

1. Run `npm run test:web` — all tests must pass
2. Merge: `git merge --no-ff cycle/19` (into `main`)
3. Write `.cdd/unreleased/19/beta-closeout.md` with: merge SHA, test count, CI status, findings summary (or zero findings), notable observations
4. Commit beta-closeout.md to main
5. Use identity: `git config user.email "beta@issue-tracker.cdd.cnos"` for any β-authored commits

### If REQUEST CHANGES

Write `.cdd/unreleased/19/beta-review.md` with all findings. For each finding:
- ID (D-1, C-1, B-1, A-1…)
- Severity: D (blocking, must fix) / C (should fix) / B (advisory) / A (NIT)
- Class: mechanical / wiring / honest-claim / judgment / contract / protocol-compliance
- Description: what is wrong, where, AC or surface reference
- Required action: what α must do to resolve

Commit `beta-review.md` to `cycle/19` (not to main). Use identity `beta@issue-tracker.cdd.cnos`.
