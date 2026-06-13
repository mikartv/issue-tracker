# β Dispatch — Cycle 8

Issue: Read `.cdd/issues/8/ISSUE.md` from repo root (full contract: gap, ACs, non-goals).  
Scaffold: Read `.cdd/unreleased/8/gamma-scaffold.md` (γ surface map, AC oracle, transition logic).  
α report: Read `.cdd/unreleased/8/self-coherence.md` (α's AC checklist, diff scope, known gaps).  
Branch: cycle/8

## Your task

Review α's implementation on `cycle/8` against the issue contract and scaffold. Do not read any prior β review sessions or α rationale beyond what is in the artifact files above.

Run `npm run test:web` from the repo root to confirm tests pass. Produce `.cdd/unreleased/8/beta-review.md` on `cycle/8` with a round verdict: **APPROVED** or **REQUEST CHANGES**.

## What to verify

### AC1 — Issue field display

`/issues/:issueId` route renders: title, description, status, priority, assignee, and a project link. The project link must navigate to `/projects/:projectId/issues` (using the issue's `project_id`). Verify by reading the component template and confirming `[routerLink]` or equivalent is wired to the correct route.

### AC2 — Status change control

The forward-only workflow (`open→in_progress→done→closed`) is mirrored client-side. Verify:
- A status button or control is rendered when a legal next state exists.
- The button is absent or disabled when status is `closed`.
- The button label correctly names the next status.
- The button calls `updateIssueStatus()` (check both the template binding and the ApiService method).

### AC3 — Comment thread and add-comment form

- Comment list renders chronologically (the API returns `ASC` by `created_at`; the component must not re-sort).
- Add-comment form has a textarea for body and submits to `POST /api/v1/issues/:issueId/comments` via `ApiService.addComment()`.
- Comment list refreshes after a successful post.

### AC4 — X-User-Email header

When a non-empty email is stored (localStorage key `userEmail` or equivalent component field), the `addComment()` call sets the `X-User-Email` request header. Verify the header-injection logic in `ApiService` and that the component reads and passes the stored email. When the field is empty, the header should be omitted (not sent as an empty string).

### AC5 — Component tests

- `apps/web/src/app/issues/issue-detail.component.spec.ts` exists and covers AC1, AC2 (both states), AC3, AC4, AC6.
- `apps/web/src/app/api/api.service.spec.ts` covers the three new methods.
- `npm run test:web` exits 0. Record the test count in your review.

### AC6 — 404 view

When `getIssue()` returns an HTTP 404 error, the component renders a clear "Issue not found" message (or equivalent). No unhandled exception. No blank screen.

### Backward compatibility

- `apps/web/src/app/projects/projects-list.component.ts` and `project-issues.component.ts` are unmodified.
- `apps/web/src/app/app.routes.ts` is unmodified.
- No files under `apps/api/` are modified.

## Severity labels

- **RC** — blocks merge; a failing AC, a broken test, incorrect behavior, or a missing required artifact
- **NIT** — optional improvement; does not block
- **D** — documentation or clarity gap; does not block

Every finding must carry its severity label and a specific `file:line` citation.

## Output

Write `.cdd/unreleased/8/beta-review.md` on `cycle/8`.

**If APPROVED:**
- State APPROVED.
- List each AC with pass/fail confirmation.
- Record `npm run test:web` output (suite count, test count).
- Note any NITs or D findings separately (they do not block).

**If REQUEST CHANGES:**
- State REQUEST CHANGES.
- List each RC finding with: severity, description, `file:line`, and required fix.
- List any NITs separately.
- α must address all RC findings before the next round.

Then write `.cdd/unreleased/8/beta-closeout.md` only after an APPROVED round, covering: cycle summary, AC evidence, test counts on merged tree, and any open NITs carried as debt.
