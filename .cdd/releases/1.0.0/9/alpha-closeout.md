---
cycle: 9
issue: "#9 — Create/edit issue flows"
role: α
artifact: alpha-closeout
verdict: APPROVED (β round 1)
---

# α Close-out — Cycle 9

## Cycle Summary

Issue #9 closed. β approved in round 1 with 1 NIT and 0 RC findings.

- Implementation SHA: `aa088c8`
- Merge commit: `ba7f829` (`feat: create/edit issue flows (closes #9)`)
- Test run at merge: 33 passed, 0 failed, 5 suites

## Artifact Inventory

| Artifact | Path | Author |
|----------|------|--------|
| Implementation (6 files) | `apps/web/src/app/…` | α |
| Self-coherence (8 incremental commits) | `.cdd/unreleased/9/self-coherence.md` | α |
| γ scaffold | `.cdd/unreleased/9/gamma-scaffold.md` | γ |
| β review | `.cdd/unreleased/9/beta-review.md` | β |
| β close-out | `.cdd/unreleased/9/beta-closeout.md` | β |
| α close-out (this file) | `.cdd/unreleased/9/alpha-closeout.md` | α |

## β Finding

| # | Finding | Class | Disposition |
|---|---------|-------|-------------|
| F1 NIT | No test for `cancelEdit()` / cancel-discards-changes sub-requirement of AC2. Implementation correct; test gap only. | NIT | Carried as open debt; non-blocking. |

## Debt Carried Forward

1. **Non-409 create errors replace table view** — `submitCreate()` failure on non-409 sets shared `error`, hiding the table and form. A separate `createError` property would scope the error inline.
2. **Edit success message persists across reloads** — `editSuccessMessage` clears only on next `enterEditMode()` call; route navigation does not reset it.
3. **Template-driven forms** — `[value]` + `(input)` binding used throughout, consistent with existing comment-form pattern. No FormGroup/FormControl.
4. **Cancel test absent** (F1 NIT) — `cancelEdit()` behavior verified by code inspection; no dedicated test case.

## Process Observations

- Self-coherence written in 8 commits across 7 sections, following the §Large-file authoring incremental-write discipline. No stream-timeout loss occurred.
- α git identity (`alpha@issue-tracker.cdd.cnos`) held across all implementation and self-coherence commits. No session-start identity drift.
- γ-scaffold peer enumeration (`§Surfaces γ Expects α to Touch`) provided precise implementation scope; no scope ambiguity at coding time.
- Pre-review gate rows 6, 8, 9 marked N/A (no schema-bearing contract change, no harness audit, no mid-cycle patch). All other rows ✅ at signal time.
- Bounded dispatch path: α exited after review-readiness signal; close-out written on γ-requested re-dispatch per §2.8 standard path.

## Engineering Observations

- `HttpTestingController` used for both `ApiService` and `ProjectIssuesComponent` specs; `jest.fn()` mock used for `IssueDetailComponent` spec. Two distinct test isolation patterns within one cycle, both valid for their layer.
- Template-driven form binding (`[value]` + `(input)`) consistent with the pre-existing comment form in `IssueDetailComponent`. Pattern is present in the component before this cycle; cycle 9 extends it.
- 409-only archived-project detection: the 409 branch sets `projectArchived = true`; non-409 errors fall to the shared `error` branch. The two error states do not overlap at runtime; they use separate template paths.
- `ProjectIssuesComponent` create-form section appended inside the `@else` branch of the loading guard: table and form are co-visible, not in separate structural blocks. No route change required.
