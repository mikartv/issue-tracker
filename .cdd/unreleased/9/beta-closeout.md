---
cycle: 9
issue: "#9 — Create/edit issue flows"
role: β
artifact: beta-closeout
round: 1
verdict: APPROVED
---

# β Close-out — Cycle 9

## Review Summary

Round 1, APPROVED. Zero RC findings. One NIT (no cancel-without-API-call test, implementation correct).

- Review base: `main` HEAD `75b080e`
- Cycle branch HEAD at review: `8e6b410` (self-coherence §Review-readiness)
- Implementation SHA: `aa088c8`
- Test run: 33 passed, 0 failed, 5 suites (Time: 1.653 s)

## AC Evidence

| AC | Verdict | Code evidence |
|----|---------|--------------|
| AC1 — Create form (title, description, priority, assignee) on `/projects/:projectId/issues` | PASS | `project-issues.component.ts` lines 61–80; 4 `mat-form-field` blocks; spec `AC1: create form fields…present` passes |
| AC2 — Edit mode (PATCH) on `/issues/:issueId` with all four fields | PASS | `issue-detail.component.ts` `enterEditMode()` L197, `saveEdit()` L213, `cancelEdit()` L208; specs `AC2a` edit-toggle and `AC2b` save-call pass |
| AC3 — Block create when project archived (409 → message + disabled button) | PASS | `project-issues.component.ts` L185–187: 409 sets `projectArchived = true`; template L81–83 shows message; button `[disabled]="!newTitle.trim() \|\| projectArchived"` L90; spec passes |
| AC4 — Client-side title validation (create + edit) | PASS | Create: `[disabled]="!newTitle.trim() \|\| projectArchived"` (L90); save: `[disabled]="!editTitle.trim()"` (`issue-detail.component.ts` L87); both specs pass |
| AC5 — Component tests green | PASS | `npm run test:web` → 33 passed, 0 failed, 5 suites; 10 new tests across 3 spec files |
| AC6 — Success feedback (create + edit) | PASS | Create: `successMessage = 'Issue created'` (L176); edit: `editSuccessMessage = 'Issue saved'` (L223); both specs pass |

## Technical Review

**ApiService** (`apps/web/src/app/api/api.service.ts`): two clean additions — `createIssue()` (POST `/projects/:projectId/issues`, +14 lines) and `updateIssue()` (PATCH `/issues/:issueId`, +6 lines). Both strongly typed; no runtime dependencies added.

**ProjectIssuesComponent** (`apps/web/src/app/projects/project-issues.component.ts`): create-form section appended inside the `@else` branch of the loading guard, so the table and form are co-visible after load. Form reset on success and `loadIssues()` re-invoked. 409-only archived detection per γ-scaffold approach. Existing `mat-table` unchanged.

**IssueDetailComponent** (`apps/web/src/app/issues/issue-detail.component.ts`): `@if (!editMode)` / `@else` toggle cleanly separates view and edit renders. Success message positioned in view-mode block after save. Comments section and `moveToNextStatus()` untouched. `cancelEdit()` correctly discards without API call.

**Spec files**: `api.service.spec.ts` uses `HttpTestingController` for both new methods (correct method + body verification). `project-issues.component.spec.ts` uses `HttpTestingController` throughout. `issue-detail.component.spec.ts` uses manual `ApiService` mock with `jest.fn()` — appropriate for component logic tests.

## Process Observations

- α identity discipline correct: all implementation commits authored as `alpha@issue-tracker.cdd.cnos`.
- Self-coherence incremental write (8 commits) followed the §Large-file authoring rule.
- γ-scaffold peer enumeration accurate: all gaps confirmed in diff.
- Artifact push discipline (cycle 8 MCI): `beta-review.md` and `beta-closeout.md` committed to `cycle/9` before merge per binding requirement.

## Open NITs (carried as debt)

- **F1 NIT:** No test for `cancelEdit()` / cancel-discards-changes sub-requirement of AC2. Implementation is correct; test gap is cosmetic. Candidate for cycle 10 or debt sweep.

## Release Notes

**Issue #9 — Create/edit issue flows** (cycle 9)

Added UI for creating and editing issues directly from the web app:

- **Create issue form** on `/projects/:projectId/issues`: title (required), description, priority, and assignee fields. Client-side title validation; archived-project block on 409.
- **Inline edit mode** on `/issues/:issueId`: edit title, description, priority, and assignee via PATCH. Cancel discards changes; success feedback shown on save.
- **Success feedback** inline after create and after save.
- **33 tests** pass (5 suites); 10 new test cases.
