# β Dispatch — Cycle 9

Issue: Read `.cdd/issues/9/ISSUE.md` from repo root (full contract: gap, ACs, non-goals).  
Scaffold: Read `.cdd/unreleased/9/gamma-scaffold.md` (γ surface map, AC oracle, detection approaches).  
α report: Read `.cdd/unreleased/9/self-coherence.md` (α's AC checklist, diff scope, known gaps).  
Branch: cycle/9

**Artifact push (binding — cycle 8 MCI):** Push `beta-review.md` and `beta-closeout.md` to `cycle/9` before signaling review-readiness. Do not rely on the merge commit to carry them.

## Your task

Review α's implementation on `cycle/9` against the issue contract and scaffold. Do not read any prior β review sessions or α rationale beyond what is in the artifact files above.

Run `npm run test:web` from the repo root to confirm tests pass. Produce `.cdd/unreleased/9/beta-review.md` on `cycle/9` with a round verdict: **APPROVED** or **REQUEST CHANGES**.

## What to verify

### AC1 — Create issue form on project issues page

`/projects/:projectId/issues` renders a create-issue form with:
- Title field (required)
- Description field (optional)
- Priority field (optional; values `low`, `medium`, `high`, `critical`)
- Assignee field (optional)
- A submit button

Verify by reading `ProjectIssuesComponent`'s template and confirming all four fields are wired to component state and bound to a create action.

### AC2 — Edit title, description, priority, assignee on detail page

`/issues/:issueId` detail page supports editing title, description, priority, and assignee via an edit mode that calls `PATCH /api/v1/issues/:id`. Verify:
- An "Edit" button or equivalent toggle enters edit mode
- Edit mode renders editable inputs for all four fields
- Saving calls `ApiService.updateIssue()` (or equivalent PATCH method)
- Cancel discards changes without an API call

### AC3 — Block create when project archived

When `createIssue()` returns HTTP 409 (project archived), the component must:
- Show a message indicating the project is archived and creation is not possible
- Leave the submit button disabled

Verify the 409-handling logic in the component and the test coverage (AC5).

### AC4 — Client-side validation (title non-empty)

The create submit button must be disabled (or a click must not invoke the API) when the title field is empty or whitespace-only. Same constraint applies to the edit save button. Verify both the template binding and the spec coverage.

### AC5 — Component tests

- `apps/web/src/app/api/api.service.spec.ts` covers `createIssue()` and `updateIssue()`.
- `apps/web/src/app/projects/project-issues.component.spec.ts` covers: form fields present (AC1); 409 block (AC3); title-empty disabled (AC4); success message (AC6).
- `apps/web/src/app/issues/issue-detail.component.spec.ts` covers: edit button / edit mode (AC2); save calls update (AC2); save disabled on empty title (AC4); success message (AC6).
- `npm run test:web` exits 0. Record the test count in your review.

### AC6 — Success feedback

After a successful create or edit, the component displays a success message (snackbar or inline). Verify both the create path (in `ProjectIssuesComponent`) and the edit path (in `IssueDetailComponent`).

### Backward compatibility

- `apps/web/src/app/projects/project-issues.component.ts` retains its existing issues-table functionality (table still renders; existing tests still pass).
- `apps/web/src/app/issues/issue-detail.component.ts` retains its existing comment thread, status-change control, and 404 view.
- `apps/web/src/app/app.routes.ts` is unmodified.
- No files under `apps/api/` are modified.

## Severity labels

- **RC** — blocks merge; a failing AC, a broken test, incorrect behavior, or a missing required artifact
- **NIT** — optional improvement; does not block
- **D** — documentation or clarity gap; does not block

Every finding must carry its severity label and a specific `file:line` citation.

## Output

Write `.cdd/unreleased/9/beta-review.md` on `cycle/9`. Push it to `cycle/9` before signaling.

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

Then write `.cdd/unreleased/9/beta-closeout.md` on `cycle/9` only after an APPROVED round, covering: cycle summary, AC evidence, test counts on merged tree, and any open NITs carried as debt. Push `beta-closeout.md` to `cycle/9` as well.
