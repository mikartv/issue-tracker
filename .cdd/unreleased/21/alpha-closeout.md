---
cycle: 21
issue: "gh #11 — enhancement: move create-issue into a MatDialog triggered from a New Issue button"
role: α
artifact: alpha-closeout
---

## §Summary

What shipped in cycle 21:

- **`CreateIssueDialogComponent`** — new standalone Angular component implementing the create-issue dialog. Fields: Title, Description, Priority, Assignee. Handles submit (calls `createIssue`, closes dialog with new issue on success), cancel (`dialogRef.close()` no args), and 409 conflict (`archivedError = true`, dialog stays open).
- **`project-issues.component.ts`** — updated: inline create form removed, `MatDialog` integrated, "New Issue" button added to trigger the dialog, `loadProject()` sets `projectArchived` on the component for downstream use.
- **Specs updated** — `create-issue-dialog.component.spec.ts` added; `project-issues.component.spec.ts` updated. 72 web tests pass.

## §AC outcomes

| AC | Description | Test evidence | Result |
|----|-------------|---------------|--------|
| AC1 | No inline create form; "New Issue" button present in project-issues view | `project-issues.component.spec.ts` — checks absence of inline form, presence of "New Issue" button | PASS |
| AC2 | Clicking "New Issue" calls `MatDialog.open(CreateIssueDialogComponent, ...)` | `project-issues.component.spec.ts` — spies on `MatDialog.open`, verifies call with correct component | PASS |
| AC3 | Submit calls `createIssue`; `dialogRef.close(newIssue)` on success | `create-issue-dialog.component.spec.ts` — verifies service call and dialog close with new issue payload | PASS |
| AC4 | Cancel → `dialogRef.close()` no args; 409 → `archivedError = true`, dialog stays open | `create-issue-dialog.component.spec.ts` — separate test cases for cancel path and 409 conflict response | PASS |

Source: `self-coherence.md §ACs` and `§Transient rows` — all ACs pass at R1.

## §Test metrics

| Suite | Pre-cycle baseline | Post-merge | Delta |
|-------|--------------------|------------|-------|
| web   | 61                 | 72         | +11 net: −5 inline-form tests, +10 dialog tests, +3 AC1/AC2 parent component tests |
| api   | 76                 | 76         | unchanged |

Derived from: `self-coherence.md §Transient rows` and `beta-closeout.md §Test counts`.

## §Review rounds

1 round. β R1: APPROVE. Zero findings.

## §Merge

SHA `90bc91b`, branch `cycle/21` → `main`.

## §ng build

Exits 0. No NG8XXX errors. Bundle size warning pre-existing (not introduced in this cycle).

## §Known debt / open items

- No e2e coverage (unit tests + manual smoke; known gap per issue proof plan).
- Bundle size warning pre-existing (cycle 19 CDK DragDrop).
- CI on branch not available (O1 structural gap, deferred since cycle 17).
- `component['dialog']` private field access in tests (Angular 17 standalone pattern; advisory only per β observation 1).
