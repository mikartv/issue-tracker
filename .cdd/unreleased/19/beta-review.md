---
cycle: 19
issue: "gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop"
role: β
artifact: beta-review
round: 1
base-sha: 1e37af0be588812c24f361f040b73c2421c245b5
cycle-head-sha: d9f89b33fcdde659e96472aa15f05373dd53b27d
---

# Beta Review — Cycle 19 — Round 1

**Verdict:** REQUEST CHANGES

**Round:** 1
**Branch CI state:** No CI run on cycle/19 (known constraint — ci.yml triggers on push/PR to main only; local `npm run test:web` run: 61/61 PASS, 6 suites)
**Merge instruction (on approval):** `git merge --no-ff cycle/19` into main with `Closes #10`

---

## §2.0.0 Contract Integrity

| Check | Result | Notes |
|---|---|---|
| Status truth preserved | yes | §Status truth accurately describes shipped vs not-shipped surfaces |
| Canonical sources/paths verified | yes | All file paths resolve; getProject, cdkDropList absent on main confirmed by γ scaffold grep |
| Scope/non-goals consistent | yes | Out-of-scope items (R6 dialog, rank persistence, realtime) not implemented |
| Constraint strata consistent | yes | Angular CDK 17 used; TypeScript strict; standalone components |
| Exceptions field-specific/reasoned | yes | `originStatus` unused variable is a NIT; no constraint violations |
| Path resolution base explicit | yes | All files rooted at `apps/web/src/app/` |
| Proof shape adequate | yes | AC1–AC5 each have positive + negative test coverage |
| Cross-surface projections updated | n/a | No schema/API changes |
| No witness theater / false closure | yes | Tests actually verify drop handler behavior, not just stubs |
| PR body matches branch files | n/a | No PR body (§5.2 dispatch; β-prompt is the dispatch artifact) |
| γ artifacts present (gamma-scaffold.md) | yes | `git ls-tree -r --name-only origin/cycle/19 .cdd/unreleased/19/gamma-scaffold.md` → `.cdd/unreleased/19/gamma-scaffold.md` |

---

## §2.0 Issue Contract

### AC Coverage

| # | AC | In diff? | Status | Notes |
|---|----|----------|--------|-------|
| AC1 | Four status columns render | yes | PASS | 4 `cdkDropList` divs; `app-chip [kind]="'status'"` per column; `.count-badge`; `querySelector('table')` returns null |
| AC2 | Issues as draggable cards with chips | yes | PASS | `cdkDrag [cdkDragData]="issue"` per card; `app-chip [kind]="'priority'"`; `routerLink=['/issues', issue.id]` |
| AC3 | Drag to another column updates status | yes | PASS | `onDrop($event, status)` passes column's own status value as `targetStatus`; `updateIssueStatus(issue.id, targetStatus)` called; `cdkDropListConnectedTo="otherStatuses(status)"` links all four columns bidirectionally |
| AC4 | Failed move reverts | yes | PASS | Error path runs `transferArrayItem(event.container.data, event.previousContainer.data, …)` reverting the optimistic move; `dropError` set; `.drop-error` element in DOM |
| AC5 | Project name in heading via getProject | yes | PASS | `loadProject()` calls `this.api.getProject(this.projectId)` in `ngOnInit`; heading uses `projectName ? 'Issues — ' + projectName : 'Issues'`; test confirms `GET /projects/:id` used, not `/projects$` |

### Named Doc Updates

| Doc / File | In diff? | Status | Notes |
|------------|----------|--------|-------|
| `apps/web/src/app/api/api.service.ts` | yes | present | `getProject(id: string): Observable<Project>` added at line 44 |
| `apps/web/src/app/projects/project-issues.component.ts` | yes | present | Full rewrite: Kanban board replaces mat-table |
| `apps/web/src/app/projects/project-issues.component.spec.ts` | yes | present | Rewritten with 23 tests (13 new + retained create-form tests) |
| `apps/web/src/app/api/api.service.spec.ts` | yes | present | +1 test for `getProject(id)` |

### CDD Artifact Contract

| Artifact | Required? | Present? | Notes |
|----------|-----------|----------|-------|
| `.cdd/unreleased/19/gamma-scaffold.md` | yes | yes | Present on origin/cycle/19 |
| `.cdd/unreleased/19/self-coherence.md` | yes | yes | Present; CDD Trace through step 7 |
| `.cdd/unreleased/19/beta-review.md` | yes (this file) | in progress | Written this round |

### Active Skill Consistency

| Skill | Required by | Loaded? | Applied? | Notes |
|-------|-------------|---------|----------|-------|
| beta/SKILL.md | dispatch | yes | yes | Git identity check, CI gate, γ artifact gate all verified |
| review/SKILL.md | beta/SKILL.md | yes | yes | Three-phase review applied |

---

## §2.1 Implementation Review

### Mechanical Pre-Checks

**1. Git identity check**

```
git log cycle/19 --format='%ae %s'
```

All implementation commits on cycle/19 authored by `alpha@issue-tracker.cdd.cnos`:
- `alpha@issue-tracker.cdd.cnos feat(web): Kanban board with cdk drag-drop for project issues (gh #10)`
- All `cdd: self-coherence …` commits also `alpha@issue-tracker.cdd.cnos`
- `gamma@issue-tracker.cdd.cnos cdd: cycle/19 scaffold + prompts — gh #10 Kanban board` (γ role, correct)

PASS — no non-α identity on implementation commits.

**2. CI green gate**

No CI run triggered on cycle/19 (ci.yml triggers on push/PR to main only — known constraint, O1 gap). Local substitute: `npm run test:web` → 61/61 PASS (6 suites). Noted as provisional; β will verify CI on merge to main.

**3. γ scaffold presence**

`git ls-tree -r --name-only origin/cycle/19 .cdd/unreleased/19/gamma-scaffold.md` → `.cdd/unreleased/19/gamma-scaffold.md` — present. PASS.

### Wiring Checks

All four wiring checks pass:

- **`getProject` is CALLED**: `loadProject()` at line 270 calls `this.api.getProject(this.projectId).subscribe(…)` from `ngOnInit()` at line 265. Confirmed by grep.
- **All four `cdkDropList` columns connected**: Each column div uses `[cdkDropListConnectedTo]="otherStatuses(status)"` (line 63); `otherStatuses(current)` at line 312 returns `this.statuses.filter((s) => s !== current)` — three other statuses. Container also wrapped in `[cdkDropListGroup]` (line 51), which is the recommended CDK pattern for a mutually-connected group. Full connectivity confirmed.
- **Drop handler uses target COLUMN's `status` value**: Template calls `onDrop($event, status)` where `status` is the column's own `IssueStatus` value (loop variable); `onDrop(event, targetStatus)` uses `targetStatus` directly in `updateIssueStatus(issue.id, targetStatus)` — not hardcoded. Confirmed.
- **On error: card IS reverted**: Error callback at lines 341–346 calls `transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex, event.previousIndex)` moving the card back from target to origin. Confirmed.

### Non-goal Check

- Create-issue dialog (R6): not implemented ✓
- Within-column rank persistence: not implemented ✓
- Realtime sync: not implemented ✓

### Create-issue form reachability

`<div class="create-section">` retained at lines 86–125, inside the `@else` (not-loading) block at the same level as the board. Inline form is accessible when data has loaded. Issue non-goal satisfied: creating issues remains reachable.

---

## Honest-Claim Checks (review/SKILL.md §3.13)

### §3.13(c) Wiring claims

- `self-coherence.md §CDD Trace step 6`: "Caller-path trace: `ApiService.getProject(id)` called from `ProjectIssuesComponent.loadProject()` in `ngOnInit`" — grep-verified: `loadProject()` at line 269 calls `this.api.getProject(…)`, and `ngOnInit()` at line 263 calls `this.loadProject()`. PASS.
- `self-coherence.md §Status truth`: Claims `cdkDrag` cards, drop handler, and `getProject` heading shipped — all confirmed by code inspection.

### §3.13(a) Reproducibility — diff line counts

`self-coherence.md §Diff scope` states: "project-issues.component.ts: full rewrite (mat-table → Kanban board; +280 lines net)".

Actual from `git diff main..cycle/19`: +206 lines added, −40 removed = **+166 lines net**. The claim (+280) is 69% higher than the actual (+166). This is a quoted measurement not reproducible from the artifacts.

`self-coherence.md §Diff scope` states: "project-issues.component.spec.ts: rewritten (+233 lines net)".

Actual: +309 added, −91 removed = **+218 lines net**. Claim (+233) is 7% higher — close but not equal.

The component net-line claim is the material discrepancy: +280 claimed vs +166 actual.

### §3.13(d) Gap claims

`self-coherence.md §Gap` cites γ scaffold grep evidence verbatim — confirmed matches the actual pre-cycle state. PASS.

---

## Findings

| # | Finding | Evidence | Severity | Type |
|---|---------|----------|----------|------|
| B-1 | `self-coherence.md §Diff scope`: component net-line count claims "+280 lines net"; actual is +166 lines net (git diff main..cycle/19 adds 206, removes 40). The spec count ("+233 net") is also slightly off (actual +218), but within rounding. The component figure is the material discrepancy. | `git diff main..cycle/19 -- apps/web/src/app/projects/project-issues.component.ts \| grep "^+" \| wc -l` → 206; `grep "^-"` → 40; 206−40=166 | B | honest-claim |
| A-1 | `project-issues.component.ts` line 322: `const originStatus = issue.status as IssueStatus;` is declared but never read. The error-path revert correctly uses `event.container.data` / `event.previousContainer.data` directly. The variable is dead code. | `grep -n "originStatus" apps/web/src/app/projects/project-issues.component.ts` → only line 322 (declaration); no subsequent reads | A | mechanical |

---

## Notes

- Tests: 61/61 PASS, 6 suites. Net +14 tests (1 in api.service.spec.ts + 13 in project-issues.component.spec.ts) verified against baseline of 47 (cycle 18 γ close-out). ✓
- All AC test names in `self-coherence.md §AC evidence` match actual test names in spec file verbatim. ✓
- `originStatus` unused variable does not cause TypeScript errors because `noUnusedLocals` is not set in `tsconfig.json`. The omission of that flag is pre-existing debt unrelated to this cycle.
- `moveItemInArray` was predicted as an import in `gamma-scaffold.md §Expected diff scope` but is correctly absent from the implementation; only `transferArrayItem` is needed for cross-column moves. The omission is correct — not a finding.
- origin/main SHA at review time: `1e37af0be588812c24f361f040b73c2421c245b5` (up to date; `git fetch --verbose origin main` confirmed no advancement).

## Required Actions for α (Round 1 → Round 2)

**B-1 (required fix):** Update `self-coherence.md §Diff scope` line for `project-issues.component.ts` net line count from "+280 lines net" to the accurate figure (+166 net: 206 added − 40 removed). Update the spec figure if desired for consistency (+218 net: 309 added − 91 removed). Commit the correction on cycle/19.

**A-1 (required fix):** Remove the unused `const originStatus = issue.status as IssueStatus;` declaration at line 322 of `project-issues.component.ts`. Commit on cycle/19.
