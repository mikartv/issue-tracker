---
cycle: 19
issue: "gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop"
role: α
artifact: alpha-closeout
merge-sha: 0ad9dab87726b87ce1a9b252219e7e1ead47f891
---

# α Closeout — Cycle 19

## §Implementation Summary

### What was built

Three deliverables shipped in cycle 19:

1. **`ApiService.getProject(id)`** — new method in `api.service.ts` calling `GET /projects/:id`, returning `Observable<Project>`. This was the only client-facing API surface added; no changes to `apps/api/`.

2. **Kanban board** (`project-issues.component.ts`) — full rewrite of `ProjectIssuesComponent`: replaced `mat-table` with a four-column `cdkDropList` board (one column per `IssueStatus`: `open`, `in_progress`, `done`, `closed`); issues rendered as `cdkDrag` cards carrying a title link (`[routerLink]`), priority `app-chip`, and assignee when non-null; drop handler with optimistic move + rollback on error; heading "Issues — {name}" loaded via `getProject`; fallback "Issues" while loading; horizontal scroll for narrow viewports; inline create-issue form retained.

3. **Test suite** — `project-issues.component.spec.ts` rewritten (21 tests; AC1–AC5 plus retained create-issue tests); `api.service.spec.ts` extended (+1 test for `getProject`).

### Files changed

| # | File | Change |
|---|------|--------|
| 1 | `apps/web/src/app/api/api.service.ts` | Added `getProject(id: string): Observable<Project>` (+5 lines) |
| 2 | `apps/web/src/app/api/api.service.spec.ts` | Added `getProject(id)` test (+20 lines) |
| 3 | `apps/web/src/app/projects/project-issues.component.ts` | Full rewrite: mat-table → Kanban board; 205 lines added, 40 removed (+165 net) |
| 4 | `apps/web/src/app/projects/project-issues.component.spec.ts` | Rewritten: 309 lines added, 91 removed (+218 net) |
| 5 | `.cdd/unreleased/19/self-coherence.md` | CDD trace artifact (new) |

Files NOT changed: `apps/api/` (no scope), `apps/web/src/app/shared/` (chip unchanged), `apps/web/src/app/issues/`, `apps/web/src/styles.scss`.

### Test count

| Point in time | Web tests |
|---|---|
| Pre-cycle baseline (cycle 18 γ close-out, sourced from γ scaffold) | 47 |
| Post-implementation (cycle/19 HEAD before merge) | 61 |
| Net new | +14 |

Breakdown: +1 in `api.service.spec.ts` (getProject test); +13 in `project-issues.component.spec.ts` (21 new − 8 retained-and-rewritten pre-existing tests removed).

---

## §AC Verification

### AC1: Four status columns render (Open / In Progress / Done / Closed) as cdkDropList

| Test name | Result |
|-----------|--------|
| `AC1: four cdkDropList columns render with correct status labels` | PASS |
| `AC1: each column shows correct issue count badge` | PASS |
| `AC1: no mat-table element in board view` | PASS |

Asserts: 4 `[cdkdroplist]` elements in DOM; text contains "Open", "In Progress", "Done", "Closed"; 4 `.count-badge` elements each showing "1"; `querySelector('table')` returns null (mat-table fully removed).

**Overall: PASS**

### AC2: Issues render as cdkDrag cards with title link, priority chip, assignee

| Test name | Result |
|-----------|--------|
| `AC2: issue cards render with title link pointing to /issues/:id` | PASS |
| `AC2: each card renders a priority app-chip` | PASS |
| `AC2: issue cards are cdkDrag elements` | PASS |
| `AC2: assignee shown on card when non-null` | PASS |
| `AC2: raw priority key not shown (chip shows label)` | PASS |

Asserts: 4 title links with `href="/issues/i1"`; ≥8 `app-chip` elements (4 status headers + 4 priority chips); 4 `.issue-card[cdkdrag]` elements; "alice@example.com" in textContent; text does not contain raw key `in_progress`, contains label "In Progress".

**Overall: PASS**

### AC3: Drag to another column calls updateIssueStatus; card stays in target column

| Test name | Result |
|-----------|--------|
| `AC3: onDrop to different column calls updateIssueStatus with target status` | PASS |
| `AC3: drop within same column does not call updateIssueStatus` | PASS |

Asserts (cross-column drop): spy on `updateIssueStatus` verifies called with `('i1', 'done')`; issue present in `done` column after drop. Asserts (same-column drop): spy not called.

**Overall: PASS**

### AC4: Failed move reverts card to origin column; error surfaced

| Test name | Result |
|-----------|--------|
| `AC4: on updateIssueStatus error, card reverts to origin column` | PASS |
| `AC4: on updateIssueStatus error, dropError message is shown` | PASS |

Asserts: `updateIssueStatus` mocked to `throwError`; issue back in `open` column, not in `done`; `component.dropError` is truthy; `.drop-error` element present in DOM.

**Overall: PASS**

### AC5: getProject called with correct id; heading shows project name

| Test name | Result |
|-----------|--------|
| `AC5: getProject called with correct project id` | PASS |
| `AC5: heading shows "Issues — <project name>" after getProject resolves` | PASS |
| `AC5: heading shows "Issues" fallback while loading` | PASS |
| `AC5: getProject uses GET /projects/:id (single project endpoint, not list)` | PASS |

Asserts: spy called with `PROJECT_ID`; h2 textContent = "Issues — Alpha" after data resolves; h2 = "Issues" in initial state before load; URL contains `/projects/proj-1` and does not match `/projects$`.

**Overall: PASS**

---

## §Friction Log

### Normal implementation friction

- **DragDropModule import:** Angular CDK 17's `DragDropModule` was already listed in `apps/web/package.json`; wiring it into the component module was straightforward. The `cdkDropListGroup` directive is re-exported by `DragDropModule` and required no separate import.
- **Drop event simulation in tests:** `CdkDragDrop` events are not constructable via `new`; tests required building a plain object matching the interface shape (`previousContainer`, `container`, `item`, `previousIndex`, `currentIndex`). This is a known Angular CDK testing pattern; no discovery work was required.

### Diff-count discrepancy (B-1 / B-2) — 2 additional fix rounds

The most significant friction was a self-inflicted honest-claim error that required two β review rounds to fully resolve:

**R1 → R2 (findings A-1 and B-1):**
- **A-1 (unused variable):** `const originStatus = issue.status as IssueStatus;` was declared in `onDrop()` but never read. The error-path revert uses `event.container.data` / `event.previousContainer.data` directly. Variable was removed in the R2 commit.
- **B-1 (wrong net-line counts in §Diff scope):** `self-coherence.md` initially reported "+280 lines net" for `project-issues.component.ts` and "+233 lines net" for `project-issues.component.spec.ts`. Actual figures verified via `git diff origin/main | grep -c "^[+-]"` were +166 net (component) and +218 net (spec). The inflated figures were produced by a manual estimation error during self-coherence authoring rather than from the diff tool.

**R2 → R3 (finding B-2):**
- **B-2 (off-by-one introduced by R2 fix itself):** The R2 commit that removed `originStatus` (1 line) reduced the component's added-line count from 206 to 205, making the corrected net +165, not +166. The R2 self-coherence update had been written before the variable removal was applied. β caught the residual off-by-one. R3 corrected §Diff scope to "205 added − 40 removed (+165 net)"; no source code changed in R3.

**Root cause:** Both B-1 and B-2 stem from authoring §Diff scope figures manually (or before finalizing source edits) rather than running `git diff` at commit time and copying the exact output. The self-coherence protocol requires figures to be sourced from the final diff, not estimated during drafting.

---

## §Debt

### Explicit non-goals honored

- **Within-column card ordering / rank persistence:** not implemented (non-goal per issue §Non-goals).
- **Realtime sync / websockets:** not implemented (non-goal).
- **Create-issue dialog (R6):** not implemented (non-goal; inline form retained as required by issue §Backward-compat invariant).
- **Column configuration / custom statuses:** not implemented (non-goal).

### Gaps discovered (carried forward)

- **`app.routes.spec.ts` navigation test:** pre-existing debt declared in `PROJECT.md §Known unknowns`; not introduced by this cycle.
- **Angular Material 18 upgrade (M3 `mat.define-theme`):** pre-existing debt from cycle 14; unaffected by this cycle.
- **CI on cycle branch:** `.github/workflows/ci.yml` triggers on push/PR to main only; cycle branch pushes do not trigger CI. Pre-existing repo configuration. β deferred CI gate to post-merge main run (confirmed 61/61 on merge tree).
- **Optimistic-move rollback granularity:** The current revert restores the issue to its origin column but does not animate the rollback. Acceptable per the issue spec ("revert card to origin column; surface error message"), but a polished UX would animate the revert.
