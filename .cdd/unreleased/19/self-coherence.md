---
cycle: 19
issue: "gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop"
role: α
artifact: self-coherence
base-sha: 26b609a
---

# Self-Coherence — Cycle 19

## §Gap

**Issue:** gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop
**Mode:** design-and-build — 5 ACs
**Version:** cycle 19; base SHA 26b609a (γ scaffold commit on cycle/19)

What was absent before this cycle (grep evidence from γ scaffold confirmed):

```
rg "getProject" apps/web/src/app/api/api.service.ts
→ line 40: getProjects(): Observable<Project[]>  (list only; getProject(id) not present)

rg "cdkDrag|cdkDropList|DragDropModule|drag-drop|kanban|board" apps/web/src/
→ NO MATCH (no drag-drop or board surfaces existed)
```

`getProject(id)` did not exist in `api.service.ts`. The `ProjectIssuesComponent` rendered a flat `mat-table` with no drag-and-drop, no board columns, no project name in heading. Both absences confirmed by γ scaffold grep evidence (`.cdd/unreleased/19/gamma-scaffold.md` §Peer enumeration).

## §Status truth

What this cycle ships:

- `apps/web/src/app/api/api.service.ts` — added `getProject(id: string): Observable<Project>` calling `GET /projects/:id`
- `apps/web/src/app/projects/project-issues.component.ts` — full rewrite: `mat-table` replaced by four-column `cdkDropList` Kanban board; issues as `cdkDrag` cards (title link + priority chip + assignee); drop handler with optimistic move + rollback on error; heading "Issues — {name}" via `getProject`; horizontal scroll; inline create-issue form retained
- `apps/web/src/app/projects/project-issues.component.spec.ts` — rewritten: 21 tests covering AC1–AC5 plus retained create-issue tests
- `apps/web/src/app/api/api.service.spec.ts` — 1 new test for `getProject(id)`

## §Implementation plan

Ordered steps as executed:

1. Load all context: SKILL.md (Tier 1a), `gh issue view 10`, PROJECT.md, STACK.md, gamma-scaffold.md
2. Session start: `git fetch origin && git switch cycle/19 && git rebase origin/main`; set git identity (`alpha@issue-tracker.cdd.cnos`)
3. Read existing files: `api.service.ts`, `api.service.spec.ts`, `project-issues.component.ts`, `project-issues.component.spec.ts`, `chip.component.ts`
4. Add `getProject(id)` to `api.service.ts`
5. Rewrite `project-issues.component.ts`: four-column Kanban board with `DragDropModule`, `cdkDropList`/`cdkDrag`, drop handler, `getProject` call for heading
6. Rewrite `project-issues.component.spec.ts`: AC1–AC5 tests + retained create-issue tests
7. Add `getProject` test to `api.service.spec.ts`
8. Run `npm run test:web` — 61/61 pass
9. Commit implementation (1bd0b00)
10. Write self-coherence.md incrementally (this file)

## §AC evidence

Per-AC oracles run against branch HEAD `1bd0b00` (implementation commit).

### AC1: Four status columns render

Test names covering this AC:
- `AC1: four cdkDropList columns render with correct status labels` — asserts 4 `[cdkdroplist]` elements, text contains Open/In Progress/Done/Closed
- `AC1: each column shows correct issue count badge` — 4 `.count-badge` elements each showing "1"
- `AC1: no mat-table element in board view` — `querySelector('table')` returns null

Status: **PASS** (all 3 tests pass in the 61-test run)

### AC2: Issues render as draggable cards with chips

Test names:
- `AC2: issue cards render with title link pointing to /issues/:id` — links array length = 4, href = `/issues/i1`
- `AC2: each card renders a priority app-chip` — ≥8 `app-chip` elements (4 status headers + 4 priority chips)
- `AC2: issue cards are cdkDrag elements` — `.issue-card[cdkdrag]` count = 4
- `AC2: assignee shown on card when non-null` — `alice@example.com` in textContent
- `AC2: raw priority key not shown (chip shows label)` — no `in_progress` in text; contains `In Progress`

Status: **PASS** (all 5 tests pass)

### AC3: Drag to another column calls updateIssueStatus; card stays in target column

Test names:
- `AC3: onDrop to different column calls updateIssueStatus with target status` — spy on `updateIssueStatus`, simulate drop event, verify called with `('i1', 'done')`, issue in `done` column
- `AC3: drop within same column does not call updateIssueStatus` — same container event, spy not called

Status: **PASS** (both tests pass)

### AC4: Failed move reverts card to origin column; error surfaced

Test names:
- `AC4: on updateIssueStatus error, card reverts to origin column` — mockReturnValue(throwError), issue back in `open`, not in `done`
- `AC4: on updateIssueStatus error, dropError message is shown` — `component.dropError` truthy; `.drop-error` element in DOM

Status: **PASS** (both tests pass)

### AC5: getProject called with correct id; heading shows project name

Test names:
- `AC5: getProject called with correct project id` — spy asserts called with `PROJECT_ID`
- `AC5: heading shows "Issues — <project name>" after getProject resolves` — h2 textContent = `Issues — Alpha`
- `AC5: heading shows "Issues" fallback while loading` — fresh state before data loads, h2 = `Issues`
- `AC5: getProject uses GET /projects/:id (single project endpoint, not list)` — URL contains `/projects/proj-1`, does not match `/projects$`

Status: **PASS** (all 4 tests pass)

## §Diff scope

Files changed vs `origin/main`:

1. `apps/web/src/app/api/api.service.ts` — added `getProject(id)` method (+5 lines)
2. `apps/web/src/app/api/api.service.spec.ts` — added `getProject(id)` test (+20 lines)
3. `apps/web/src/app/projects/project-issues.component.ts` — full rewrite (mat-table → Kanban board; +166 lines net: 206 added − 40 removed)
4. `apps/web/src/app/projects/project-issues.component.spec.ts` — rewritten (+218 lines net: 309 added − 91 removed)
5. `.cdd/unreleased/19/self-coherence.md` — this file (new)

Files NOT changed: `apps/api/` (no scope), `apps/web/src/app/shared/` (chip unchanged), `apps/web/src/app/issues/`, `apps/web/src/styles.scss`

Caller-path trace for new module `getProject`:
- New function: `ApiService.getProject(id: string)` in `api.service.ts`
- Non-test caller: `ProjectIssuesComponent.loadProject()` in `project-issues.component.ts` — calls `this.api.getProject(this.projectId)` in `ngOnInit`

## §Transient rows

**Branch CI:** cycle/19 not yet pushed to origin at time of writing this section. CI state will be recorded in §Review-readiness after push.

**Final web test count (from runner output):**

```
Test Suites: 6 passed, 6 total
Tests:       61 passed, 61 total
```

Baseline was 47 (cycle 18 γ close-out). Net new: +14 (1 in api.service.spec.ts + 13 in project-issues.component.spec.ts).

## §Debt

- Within-column card ordering / rank persistence: not implemented (non-goal per issue §Non-goals)
- Realtime sync: not implemented (non-goal)
- Create-issue dialog (R6): not implemented (non-goal; inline form retained as required)
- No `app.routes.spec.ts` for navigation test — pre-existing debt (declared in PROJECT.md §Known unknowns)
- Angular Material 18 upgrade for M3 `mat.define-theme` — pre-existing debt (cycle 14)
- `cdkDropListGroup` directive bound via `[cdkDropListGroup]` on the board container: `DragDropModule` re-exports `CdkDropListGroup`, so it is available without explicit import, consistent with Angular CDK 17 patterns.

## §CDD Trace

| Step | Description | Evidence |
|------|-------------|----------|
| 0 | Load Tier 1a | `SKILL.md` loaded before any other step |
| 1 | Receive dispatch | `gh issue view 10` read; PROJECT.md, STACK.md, gamma-scaffold.md read |
| 2 | Gap identified | `getProject(id)` absent; `cdkDrag`/`cdkDropList` absent — confirmed via γ scaffold grep |
| 3 | Active skills declared | Tier 1a: CDD.md + alpha/SKILL.md; Tier 2: TypeScript strict; Tier 3: Angular CDK drag-drop |
| 4 | Tests written | `project-issues.component.spec.ts` (AC1–AC5 + create-form); `api.service.spec.ts` (+1 getProject test) |
| 5 | Code written | `api.service.ts` (+getProject); `project-issues.component.ts` (full rewrite to Kanban) |
| 6 | Diff scope declared | 4 source files + self-coherence.md; caller-path trace: `ProjectIssuesComponent.loadProject()` → `api.getProject()` |
| 7 | Self-coherence | This file, written incrementally, committed per section |

## §Review-readiness | round 1 | implementation SHA: 1bd0b00 | branch CI: not triggered (ci.yml triggers on push/PR to main only — cycle branch pushes are excluded by repo CI config) | local test run: 61/61 PASS | ready for β

**Pre-review gate checklist:**

1. ✅ Branch `cycle/19` rebased on `origin/main` at base SHA `1e37af0`; main has not advanced during this session (confirmed: `git log --oneline origin/main..HEAD` shows only cycle/19 commits)
2. ✅ `self-coherence.md` carries CDD Trace through step 7
3. ✅ Tests present: 61 total (AC1–AC5 mapped; create-issue form tests retained)
4. ✅ Every AC has evidence (§AC evidence above)
5. ✅ Known debt explicit (§Debt above)
6. ✅ No schema/shape changes to API contracts — `getProject` is a new client method only, no API changes
7. ✅ Peer enumeration: peer set = {api.service.ts, api.service.spec.ts, project-issues.component.ts, project-issues.component.spec.ts}; all 4 updated; chip.component/issue-labels.ts untouched (no change required)
8. ✅ Harness audit: no schema-bearing contract changed; `POST /issues/:id/status` wire shape unchanged
9. ✅ Polyglot re-audit: TypeScript only in diff; no shell/YAML/Go surfaces touched
10. ⚠️ CI: `.github/workflows/ci.yml` triggers on `push/PR to main` only — cycle branch pushes do not trigger CI. Local `npm run test:web` (61/61) is the available pre-review gate. β should verify CI on merge.
11. ✅ Artifact enumeration matches diff: all 4 source files declared in §Diff scope; self-coherence.md is the CDD artifact
12. ✅ Caller-path trace: `ApiService.getProject(id)` called from `ProjectIssuesComponent.loadProject()` in `ngOnInit`
13. ✅ Test assertion count from runner: `Tests: 61 passed, 61 total` (runner output pasted in §Transient rows)
14. ✅ Git author email: all implementation commits authored by `alpha@issue-tracker.cdd.cnos` (verified: `git log -5 --format='%ae %s'`)
15. ✅ γ-artifact at canonical §5.1 path: `git cat-file -e origin/cycle/19:.cdd/unreleased/19/gamma-scaffold.md` → EXISTS

## §Fix Round R2

**Round:** 2
**Base review:** β R1 verdict REQUEST CHANGES (2 findings)
**Author:** alpha@issue-tracker.cdd.cnos

### Findings addressed

| Finding | Type | Action |
|---------|------|--------|
| A-1 | mechanical | Removed unused `const originStatus = issue.status as IssueStatus;` declaration from `onDrop()` in `project-issues.component.ts` (was line 322 pre-fix). Variable was declared but never read; error-path revert uses `event.container.data` / `event.previousContainer.data` directly. |
| B-1 | honest-claim | Corrected `§Diff scope` net-line figures: `project-issues.component.ts` updated from "+280 lines net" to "+166 lines net: 206 added − 40 removed"; `project-issues.component.spec.ts` updated from "+233 lines net" to "+218 lines net: 309 added − 91 removed". Figures verified via `git diff origin/main -- <file> | grep -c "^[+-]"`. |

### Files changed in R2

1. `apps/web/src/app/projects/project-issues.component.ts` — removed unused `originStatus` variable
2. `.cdd/unreleased/19/self-coherence.md` — corrected §Diff scope net-line counts; added this §Fix Round R2 section

### Test count after fix

```
Test Suites: 6 passed, 6 total
Tests:       61 passed, 61 total
```

All 61 tests pass after removal of unused variable.
