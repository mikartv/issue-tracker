---
cycle: 8
issue: "#8 — Issue detail + comments UI"
role: α
artifact: self-coherence
date: 2026-06-13
---

# Self-Coherence Report — Cycle 8

## Gap Addressed

**Issue #8 — Issue detail + comments UI** (design-and-build mode).  
Gap: only list views existed; no way to view or interact with a single issue in the UI.

## AC Checklist

| AC | Met | Evidence |
|----|-----|---------|
| AC1 | ✅ | `IssueDetailComponent` renders title, description, status, priority, assignee, and `[routerLink]` project link. AC1 spec verifies title/status text and project-link `href`. |
| AC2 | ✅ | `NEXT_STATUS` map drives a single "Move to [next]" button; button is absent when `nextStatus` is `null` (status `closed`). AC2a/AC2b specs verified. |
| AC3 | ✅ | Comments rendered in `@for` loop (API returns ASC order); `submitComment()` calls `addComment`, re-fetches comments, clears textarea. AC3 spec verifies two comment items and one `addComment` call. |
| AC4 | ✅ | `ngOnInit` reads `localStorage.getItem('userEmail')`; `onEmailChange` persists on each keystroke; `submitComment` passes email as third argument to `addComment`. `ApiService.addComment` sets `X-User-Email` header when email is non-empty. AC4 spec asserts the email argument; ApiService spec asserts the HTTP header directly via `HttpTestingController`. |
| AC5 | ✅ | `npm run test:web` exits 0. 23 tests pass across 5 suites. |
| AC6 | ✅ | `HttpErrorResponse` with `status === 404` sets `notFound = true`; template renders `<p class="error">Issue not found</p>`. AC6 spec verifies DOM text. |

## Files Changed

| File | Change | ~Lines |
|------|--------|--------|
| `apps/web/src/app/api/api.service.ts` | Added `Comment` interface; added `getComments`, `addComment`, `updateIssueStatus`; imported `HttpHeaders` | +25 |
| `apps/web/src/app/issues/issue-detail.component.ts` | Full replacement of 22-line stub with complete implementation | +145 |
| `apps/web/src/app/issues/issue-detail.component.spec.ts` | New file — 6 specs covering AC1–AC4, AC6 | +145 |
| `apps/web/src/app/api/api.service.spec.ts` | Added specs for `getComments`, `addComment` (×2 header cases), `updateIssueStatus` | +80 |

## Test Counts

| Suite | Before | After |
|-------|--------|-------|
| `api.service.spec.ts` | 3 | 8 |
| `issue-detail.component.spec.ts` | 0 (file absent) | 6 |
| Other suites (unchanged) | 14 | 14 |
| **Total** | **17** | **23** |

## Known Gaps / Deferred Items

- No end-to-end / manual smoke test against the running API (deferred to manual closure step per issue spec).
- `formatDate` uses `toLocaleString()` which is locale-dependent; could use a stable format in a future cycle.
- Comment body textarea is cleared via `[value]=""` + `markForCheck()` — browser manages DOM value between Angular renders; works correctly but is less idiomatic than `ReactiveFormsModule`.

## Review-Readiness Declaration

Implementation complete. All 6 ACs met. `npm run test:web` exits 0 (23/23 tests pass). No API files modified. Routes and existing components untouched. Ready for β review.
