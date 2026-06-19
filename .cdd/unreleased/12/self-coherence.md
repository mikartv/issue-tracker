---
cycle: 12
issue: "gh #2 — bug: raw enum values displayed in issue-detail (status, priority, Move to button)"
role: α
artifact: self-coherence
---

<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills, ACs]
-->

## §Gap

**Issue:** gh #2 — bug: raw enum values displayed in issue-detail (status, priority, Move to button)
**Mode:** design-and-build
**Version:** cycle/12

The gap is the absence of `statusLabels` and `priorityLabels` maps in `IssueDetailComponent`. The component renders `{{ issue.status }}`, `{{ issue.priority }}`, and `Move to {{ nextStatus }}` — all raw enum keys from the database (`in_progress`, `critical`). `ProjectIssuesComponent` already ships the correct label maps (since cycle 7); `IssueDetailComponent` regressed when it was added in cycle 8. This cycle closes the regression.

## §Skills

**Tier 1a:**
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md` — kernel + lifecycle
- `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md` — α role surface

**Tier 2:** Angular 17 + TypeScript strict conventions (from `.cdd/STACK.md`)

**Tier 3:** None — single-component template fix; no schema-bearing parser or new module.

## §ACs

Per-AC oracles run against branch `cycle/12`, implementation SHA `4518cd9`.

| AC | Oracle | Result | Evidence |
|----|--------|--------|----------|
| AC1 | Unit test `label-AC1`: render with `status = 'in_progress'`; assert `<p>` containing "Status:" shows "In Progress", not "in_progress" | **PASS** | `label-AC1` test passes; DOM text `Status: In Progress` confirmed in runner output |
| AC2 | Unit test `label-AC2`: render with `priority = 'critical'`; assert `<p>` containing "Priority:" shows "Critical", not "critical" | **PASS** | `label-AC2` test passes; DOM text `Priority: Critical` confirmed |
| AC3 | Unit test `label-AC3`: render with `status = 'open'`; assert button text = "Move to In Progress", not "in_progress" | **PASS** | `label-AC3` test passes; button text `Move to In Progress` confirmed |

**Test runner output (42 tests, 5 suites):**
```
Tests:       42 passed, 42 total
Test Suites: 5 passed, 5 total
```

**Negative checks (per AC oracles):**
- `in_progress` absent from Status display position: confirmed — Status paragraph shows "Open" for `open`, "In Progress" for `in_progress`
- `critical` absent from Priority display position: confirmed — Priority paragraph shows "Critical" for `critical`
- `in_progress` absent from button text: confirmed — button shows "Move to In Progress"

**Invariant check:** `statusLabels` covers all 4 entity-canonical status values (`open`, `in_progress`, `done`, `closed`). `priorityLabels` covers all 4 priority values (`low`, `medium`, `high`, `critical`). Both match entity enum in `apps/api/src/entities/issue.entity.ts`.

## §Self-check

**Did α's work push ambiguity onto β?** No.

- Three ACs have direct test evidence. Negative assertions are present for each (raw key absent from display position).
- The one pre-existing test that checked the buggy behavior (`AC2a: shows "Move to in_progress" button...`) was updated to assert the new correct label — this is the correct disposition for a test that validated a bug.
- The existing test `AC1: displays title, status, and project link` checked `toContain(mockIssue.status)` where `mockIssue.status = 'open'`. After fix, "open" renders as "Open" — test updated to `toContain('Open')`. No ambiguity left for β.
- Peer enumeration: only `IssueDetailComponent` is in-scope. `ProjectIssuesComponent` has label maps already and is explicitly out-of-scope per γ-scaffold and issue. No other components render issue status/priority.
- Harness audit: N/A — no schema-bearing contract changed; API wire format unchanged.
- Implementation contract: language (TypeScript strict), package scoping (`issue-detail.component.ts` only), no new runtime dependencies — all axes honored.
