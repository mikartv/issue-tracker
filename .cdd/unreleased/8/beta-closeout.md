---
cycle: 8
issue: "#8 — Issue detail + comments UI"
role: β
artifact: beta-closeout
date: 2026-06-14
rounds: 1
verdict: APPROVED
---

# β Closeout — Cycle 8

## Cycle Summary

Issue #8 adds the issue-detail view with status-change control, comment thread, and add-comment form to the Angular web app. One round of review; no RC findings; APPROVED on round 1.

## AC Evidence

| AC | Verdict | Key Evidence |
|----|---------|-------------|
| AC1 | PASS | `issue-detail.component.ts:44-51` — title, description, status, priority, assignee, project link (`[routerLink]` to `/projects/:projectId/issues`) |
| AC2 | PASS | `NEXT_STATUS` map (lines 17-22); `@if (nextStatus)` absent when closed; `moveToNextStatus()` calls `updateIssueStatus()` |
| AC3 | PASS | `@for` loop preserves API ASC order; `submitComment()` calls `addComment()` then re-fetches comments |
| AC4 | PASS | `localStorage.getItem('userEmail')` in `ngOnInit`; `userEmail \|\| undefined` omits header when empty; `ApiService.addComment` sets `X-User-Email` header when truthy |
| AC5 | PASS | 5 suites, 23 tests, 0 failures (`npm run test:web`) |
| AC6 | PASS | `err.status === 404` → `notFound = true` → `<p class="error">Issue not found</p>` |

## Test Counts on Merged Tree

```
Test Suites: 5 passed, 5 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        1.368 s
```

## Open NITs (carried as debt)

- **NIT-1**: `loadComments()` has no error handler; silent failure on comment fetch. Low priority; add in a future cycle.
- **NIT-2**: `self-coherence.md` test-count table arithmetic is off (reports 8 tests in api.service.spec.ts; actual is 9). Documentation-only issue; no code impact.
