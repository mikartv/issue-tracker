---
cycle: 8
issue: "#8 — Issue detail + comments UI"
role: β
artifact: beta-review
date: 2026-06-14
round: 1
verdict: APPROVED
---

# β Review — Cycle 8, Round 1

## Verdict: APPROVED

No RC findings. All 6 ACs pass. Tests green.

---

## AC Results

### AC1 — Issue field display: PASS

`issue-detail.component.ts:44-51` renders title, description, status, priority, and assignee. Project link uses `[routerLink]="['/projects', issue.project_id, 'issues']"` (line 51), which resolves to `/projects/:projectId/issues`. Spec `AC1` test confirms title/status text and queries for an anchor containing the project ID.

### AC2 — Status change control: PASS

`NEXT_STATUS` map (lines 17-22) encodes the full forward-only workflow. The `get nextStatus()` getter (line 107) returns `null` for `'closed'`. Template uses `@if (nextStatus)` (line 54) so the button is absent — not merely disabled — when the issue is closed. Button label is `"Move to {{ nextStatus }}"` (line 55). Click invokes `moveToNextStatus()` (line 145) which calls `ApiService.updateIssueStatus()` (line 149). Spec tests AC2a (`status: 'open'` → button with `'in_progress'`) and AC2b (`status: 'closed'` → button absent).

### AC3 — Comment thread and add-comment form: PASS

Comments are rendered via `@for (comment of comments; track comment.id)` (line 60) with no client-side sort; API ordering (ASC by `created_at`) is preserved. Add-comment form has a textarea (line 77). `submitComment()` (line 154) calls `ApiService.addComment()` then `loadComments()` to refresh the list (line 161). Spec AC3 test verifies two `li.comment-item` elements and one `addComment` call.

### AC4 — X-User-Email header: PASS

`ngOnInit` reads `localStorage.getItem('userEmail')` (line 111). `onEmailChange` persists on each input event (line 170). `submitComment()` passes `this.userEmail || undefined` (line 158), converting an empty string to `undefined` so the header is omitted. `ApiService.addComment` (api.service.ts:64-68) sets `X-User-Email` via `HttpHeaders` only when the `userEmail` argument is truthy; passes an empty options object otherwise. `api.service.spec.ts` tests both header-present (line 149) and header-absent (lines 125, 169) cases via `HttpTestingController`. Component spec AC4 test asserts the email is forwarded as the third argument.

### AC5 — Component tests: PASS

- `apps/web/src/app/issues/issue-detail.component.spec.ts` exists and covers: AC1 (title, status, project link), AC2a (status `open` → button), AC2b (status `closed` → button absent), AC3 (comment list + submit), AC4 (localStorage email forwarding), AC6 (404 error message).
- `apps/web/src/app/api/api.service.spec.ts` covers `getComments()`, `addComment()` (3 cases: basic, with email header, without email header), and `updateIssueStatus()`.
- `npm run test:web` output: **5 suites, 23 tests, 0 failures** (1.368 s).

### AC6 — 404 view: PASS

`loadIssue()` error handler (lines 124-132) checks `err.status === 404` and sets `notFound = true`. Template renders `<p class="error">Issue not found</p>` in the `@else if (notFound)` branch (line 39-40). No unhandled exception path. Spec AC6 test confirms the DOM text.

### Backward Compatibility: PASS

`git diff main --name-only` confirms only these web files changed: `api.service.ts`, `api.service.spec.ts`, `issue-detail.component.ts`, `issue-detail.component.spec.ts`. No files under `apps/api/`, `app.routes.ts`, `projects-list.component.ts`, or `project-issues.component.ts` were modified.

---

## NIT Findings (non-blocking)

**NIT-1** `apps/web/src/app/issues/issue-detail.component.ts:136-143`  
`loadComments()` has no error handler. A failed comment-list fetch silently leaves `comments = []` with no user-facing message. Acceptable for this cycle; consider adding an error state in a future cycle.

**NIT-2** `.cdd/unreleased/8/self-coherence.md:38-44`  
The test-count table has an arithmetic error: it claims api.service.spec.ts went 3→8 and issue-detail went 0→6, but those alone sum to 29 + pre-existing 14 = no coherent 23. The actual file contains 9 tests in api.service.spec.ts (not 8). The discrepancy is in the documentation only — the actual run shows 23/23 and is correct.
