---
cycle: 12
issue: "gh #2 — bug: raw enum values displayed in issue-detail (status, priority, Move to button)"
role: α
artifact: alpha-closeout
---

# α Close-out — Cycle 12

## Summary

Cycle 12 closed gh #2 — P1 regression on the most-visited detail surface. Single-file mechanical fix: `statusLabels` and `priorityLabels` added to `IssueDetailComponent`; three template bindings updated; three new unit tests added (one per AC). β approved in round 1, 0 findings. 42 tests pass (39 pre-cycle + 3 new).

## Implementation

**File changed:** `apps/web/src/app/issues/issue-detail.component.ts`

- Added `readonly statusLabels: Record<string, string>` with entity-canonical keys (`open`, `in_progress`, `done`, `closed`)
- Added `readonly priorityLabels: Record<string, string>` with keys (`low`, `medium`, `high`, `critical`)
- Template L50: `{{ issue.status }}` → `{{ statusLabels[issue.status] ?? issue.status }}`
- Template L51: `{{ issue.priority }}` → `{{ priorityLabels[issue.priority] ?? issue.priority }}`
- Template L58: `Move to {{ nextStatus }}` → `Move to {{ statusLabels[nextStatus!] ?? nextStatus }}`

**Spec changes:** `apps/web/src/app/issues/issue-detail.component.spec.ts`

- Updated 2 pre-existing tests that validated the now-fixed buggy behavior (assertions changed to match corrected output)
- Added 3 new tests: `label-AC1`, `label-AC2`, `label-AC3` — each covering positive (human label present) and negative (raw key absent) assertions

## β Outcome

Round 1 — APPROVED, 0 findings. No RC issued.

## Observations

**Pre-existing discrepancy (D1):** `project-issues.component.ts` L171 maps `resolved: 'Resolved'` but the entity enum has `done`, not `resolved`. This bug pre-dates cycle 12 and was correctly treated as out-of-scope per γ-scaffold and issue non-goals. The discrepancy survives in `project-issues.component.ts`.

**CI scope:** `.github/workflows/ci.yml` triggers on `push: branches: [main]` and `pull_request: branches: [main]` only; no CI runs on cycle branches. Local `npm run test:web` (42/42 pass) served as the equivalent. β confirmed this via `gh run list --branch cycle/12`.

**Duplicate test names:** `issue-detail.component.spec.ts` has pre-existing duplicate test names within the describe block (`AC2a:`, `AC2b:`, `AC4:`, `AC6:` each appear twice). Not introduced by this cycle; the three new tests use unique names (`label-AC1`, `label-AC2`, `label-AC3`).

**Implementation contract adherence:** All 7 axes honored — TypeScript strict, single file (`issue-detail.component.ts`), no new runtime dependencies, no API wire contract changes.

**Cycle pattern:** 1 file changed, 3 ACs, mechanical fix, round-1 approval. Fit for single-session §5.2 dispatch.
