---
cycle: 19
issue: "gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop"
role: β
artifact: beta-closeout
merge-sha: 0ad9dab87726b87ce1a9b252219e7e1ead47f891
---

# β Close-out — Cycle 19

## Merge

- **Branch:** `cycle/19` merged into `main` via `git merge --no-ff`
- **Merge SHA:** `0ad9dab87726b87ce1a9b252219e7e1ead47f891`
- **Closes:** gh #10

## Test Count

- **Web:** 61/61 pass (confirmed local run on cycle/19 HEAD before merge, and merge tree is source-only — no test-affecting changes in main since branch base)
- **API:** 76/76 (untouched; no api scope changes this cycle)
- **CI status:** CI triggers on main push — pending push; local suite green

## Review Summary

- **Rounds:** 3 (R1 REQUEST CHANGES, R2 REQUEST CHANGES, R3 APPROVE)
- **Findings:**
  - **B-1** (honest-claim, B-severity) — `self-coherence.md §Diff scope` reported "+280 lines net" for `project-issues.component.ts` and "+233 lines net" for `project-issues.component.spec.ts`; actual figures were +166/+218. Resolved R2 in commit `fix(web): remove unused originStatus var; correct self-coherence diff counts`.
  - **A-1** (mechanical, A-severity) — unused `const originStatus` variable in `project-issues.component.ts` `onDrop()`. Resolved R2 in same commit.
  - **B-2** (honest-claim, B-severity) — R2 fix corrected component net to "+166 lines net: 206 added − 40 removed" but the R2 fix itself removed one line (the unused variable), making the correct count 205 added / +165 net. Self-coherence still claimed 206/+166 after the R2 commit. Resolved R3 in commit `fix(cdd): correct component diff count 206→205 in self-coherence (gh #10 R3)`.

## AC Coverage

| AC | Description | Status |
|----|-------------|--------|
| AC1 | Four status columns render (Open/In Progress/Done/Closed) as cdkDropList | PASS |
| AC2 | Issues render as cdkDrag cards with title link, priority chip, assignee | PASS |
| AC3 | Drag to another column calls updateIssueStatus; card stays in target | PASS |
| AC4 | Failed move reverts card to origin column; error surfaced | PASS |
| AC5 | getProject called with correct id; heading shows "Issues — {name}" | PASS |

All 5 ACs confirmed PASS (R1 verification; no AC-affecting changes in R2/R3).

## Notable Observations

- The R3 finding (B-2) was an off-by-one introduced by the R2 fix itself: removing a source line reduced the added-line count from 206 to 205, but the R2 self-coherence update was authored before the variable removal reduced the count. The fix was purely a CDD artifact edit (no source changes), confirming clean isolation of honest-claim correction from implementation.
- CI is configured to trigger on push/PR to main only; cycle branch pushes do not trigger CI. This is pre-existing repo configuration (declared in self-coherence §Transient rows and §Review-readiness). β CI gate deferred to post-push main run.
- No API scope changes; api test suite (76 tests) untouched and unaffected.
