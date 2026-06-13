---
cycle: 8
issue: "#8 — Issue detail + comments UI"
role: γ
artifact: gamma-scaffold
date: 2026-06-13
mode: design-and-build
work_shape: substantial
---

# γ Scaffold — Cycle 8

## Selection

Selected: Issue #8 — Issue detail + comments UI  
Decisive clause: CDS §Selection function → Assessment-commitment default — cycle 7 `gamma-closeout.md` named #8 as next MCA under "Next MCA" section.  
No alternatives displaced: no P0 override; no operational-infrastructure override; no cross-repo proposals pending.

## Mode

`design-and-build` — `IssueDetailComponent` exists as a placeholder stub (22-line component, no implementation). The comment thread + status-change control design is fully bounded by issue ACs; no separate design staging cycle is required.

## Work Shape

Substantial (6 ACs). Five-factor check:

| Factor | Reading | Splitting signal? |
|--------|---------|-------------------|
| (a) New code surface | No new modules; one existing stub component replaced; ApiService extended | No |
| (b) Cross-module breadth | Two files touched non-trivially: `issue-detail.component.ts`, `api.service.ts` | No |
| (c) Lifecycle span | Code + component tests only; no infra change | No |
| (d) MCA preconditions | Design fully embedded in issue ACs; no prior unstable design doc | No |
| (e) Independent shippability | All 6 ACs combine into one coherent feature; no subset ships independently | No |

Decision: keep whole. No split indicator fires.

## Surfaces γ Expects α to Touch

| Surface | File | Change |
|---------|------|--------|
| Issue detail component | `apps/web/src/app/issues/issue-detail.component.ts` | Replace placeholder with full implementation |
| ApiService | `apps/web/src/app/api/api.service.ts` | Add `Comment` interface; add `getComments()`, `addComment()`, `updateIssueStatus()` |
| Issue detail spec | `apps/web/src/app/issues/issue-detail.component.spec.ts` | New file — TestBed specs covering AC1–AC4, AC6 |
| ApiService spec | `apps/web/src/app/api/api.service.spec.ts` | Extend for three new ApiService methods |

## Peer Enumeration (binding, §2.2a)

All assertions below are empirically grounded:

- `IssueDetailComponent` exists as placeholder — confirmed: `apps/web/src/app/issues/issue-detail.component.ts` (22 lines, skeleton only; `loading = true`, `error = null`, no real logic).
- Route `/issues/:issueId` registered — confirmed: `apps/web/src/app/app.routes.ts` line 9.
- `getIssue()` exists in `ApiService` — confirmed: `apps/web/src/app/api/api.service.ts` lines 48–50.
- `getComments`, `addComment`, `updateIssueStatus` absent — confirmed: `grep -r "getComments\|addComment\|updateIssueStatus" apps/web/src/` returns no output.
- `X-User-Email` / `userEmail` absent from `apps/web/src/` — confirmed: same grep returns no output.
- Angular Material already in the project — confirmed: `project-issues.component.ts` imports `MatTableModule`, `MatProgressSpinnerModule`; Material bootstrapped in cycle 7.
- API endpoints for issue detail, comments (list + create), and status transition all exist from cycles 4–5 — confirmed by reading `apps/api/src/issues/issues.controller.ts` and `apps/api/src/comments/comments.controller.ts`.

## Status Transition Logic (client-side mirror of backend)

From `apps/api/src/issues/issues.service.ts` `TRANSITIONS` constant:

| Current status | Legal next status |
|----------------|-------------------|
| `open` | `in_progress` |
| `in_progress` | `done` |
| `done` | `closed` |
| `closed` | — (terminal; control disabled) |

The UI reflects this: a single "Move to [next_status]" button, absent or disabled when current status is `closed`.

## X-User-Email Pattern

Simple dev text field in the add-comment form area. Value persisted to `localStorage` under key `userEmail`. `addComment()` in `ApiService` reads the caller-supplied email and sets it as the `X-User-Email` request header when non-empty. If absent or empty, header is omitted (API defaults author to `"anonymous"`).

## AC Oracle Approach

| AC | Oracle | Approach |
|----|--------|---------|
| AC1 — field display | DOM contains rendered field values | TestBed: inject mock ApiService returning fixture issue; verify title, status, priority, assignee, project_id-based link after `detectChanges()` |
| AC2 — status control | Button present with correct label when legal next exists; absent/disabled when `closed` | TestBed: mount with `status: 'open'` → button labeled "Move to in_progress"; mount with `status: 'closed'` → button absent or disabled |
| AC3 — comment thread + post | List renders N comments; submit triggers `addComment` call | TestBed: mock `getComments` returning 2-element array; verify list length; submit form; verify `addComment` called once |
| AC4 — X-User-Email header | Header present on `addComment` HTTP request when email is non-empty | `HttpTestingController.expectOne()` matching URL; assert `request.headers.get('X-User-Email')` equals stored email |
| AC5 — tests pass | `npm run test:web` exits 0 | Run the command; observe exit code and suite counts |
| AC6 — 404 view | "Issue not found" message rendered, no crash | TestBed: mock `getIssue` returning `HttpErrorResponse({ status: 404 })`; verify error state in DOM |

## Expected Diff Scope

~200–300 lines across 3–4 files. No API files touched. No routing changes. No new Angular modules beyond cycle 7 existing imports. One new spec file.

## Blockers

None. All required API endpoints exist. Branch `cycle/8` exists and is checked out.
