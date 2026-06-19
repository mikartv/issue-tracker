---
cycle: 12
issue: "gh #2 — bug: raw enum values displayed in issue-detail (status, priority, Move to button)"
role: γ
artifact: gamma-scaffold
---

# γ Scaffold — Cycle 12

## Issue

**gh #2** — bug: raw enum values displayed in issue-detail (status, priority, Move to button)
Mode: design-and-build
Priority: P1 — regression from pre-cycle-11

## Selection

Selected under `cnos.cds/skills/cds/CDS.md` §"Selection function": no P0 override;
no operational-infrastructure override. gh #2 is the only open issue — P1 regression.
Decisive clause: P1 bug on the most-visited detail surface; immediate fix warranted.

## Peer Enumeration (γ/SKILL.md §2.2a)

**Directories scanned:** `apps/web/src/app/issues/`, `apps/web/src/app/projects/`

```bash
rg 'statusLabels|priorityLabels' apps/web/src/
```

Results:
- `apps/web/src/app/projects/project-issues.component.ts` L167–179: both maps present ✅
- `apps/web/src/app/issues/issue-detail.component.ts`: **no matches** — gap confirmed

```bash
rg 'nextStatus|NEXT_STATUS' apps/web/src/
```

Results:
- `issue-detail.component.ts` L18: `const NEXT_STATUS = { open: 'in_progress', in_progress: 'done', done: 'closed', closed: null }` (raw keys)
- `issue-detail.component.ts` L58: `Move to {{ nextStatus }}` — raw key in button text ✅ gap confirmed

**Entity enum canonical values** (`apps/api/src/entities/issue.entity.ts`):
- `IssueStatus`: `open`, `in_progress`, `done`, `closed`
- `IssuePriority`: `low`, `medium`, `high`, `critical`

### Discrepancy — entity `done` vs `project-issues.component.ts` `resolved`

`project-issues.component.ts` statusLabels maps `resolved: 'Resolved'` at L171 — but the
entity enum has `done`, not `resolved`. The `NEXT_STATUS` constant in `issue-detail.component.ts`
also uses `done` (not `resolved`). Entity enum and SCOPE.md (`open → in_progress → done → closed`)
are the authoritative truth.

**Impact on cycle 12 scope:**
- The issue body instructs "Add maps matching `ProjectIssuesComponent`" — this means: same
  pattern and type, NOT a literal value copy. α MUST use entity-canonical keys for
  `issue-detail.component.ts`:
  ```typescript
  readonly statusLabels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    done: 'Done',
    closed: 'Closed',
  };
  ```
- The `resolved` key in `project-issues.component.ts` is a pre-existing bug out of scope
  for cycle 12. α MUST NOT fix it in this cycle and MUST NOT add `resolved` to
  `issue-detail.component.ts` statusLabels.

## Surfaces α Will Touch

**One file only:** `apps/web/src/app/issues/issue-detail.component.ts`

Changes required:
1. Add `readonly statusLabels: Record<string, string>` property with keys per entity enum
   (`open`, `in_progress`, `done`, `closed`)
2. Add `readonly priorityLabels: Record<string, string>` property matching
   `project-issues.component.ts` exactly (`low`, `medium`, `high`, `critical`)
3. Template — status field (view-mode branch, `<p><strong>Status:</strong>`):
   `{{ statusLabels[issue.status] ?? issue.status }}`
4. Template — priority field (view-mode branch, `<p><strong>Priority:</strong>`):
   `{{ priorityLabels[issue.priority] ?? issue.priority }}`
5. Template — "Move to" button:
   `Move to {{ statusLabels[nextStatus] ?? nextStatus }}`
6. Tests: 3 new unit-test cases covering AC1–AC3

**No changes to:**
- `project-issues.component.ts` (out of scope)
- Any API file, migration, `api.service.ts`, `app.routes.ts`
- `apps/api/` directory

## AC Oracle Table

| AC | Oracle | Pass condition |
|----|--------|---------------|
| AC1 | Unit test: render with `status = 'in_progress'` | DOM contains "In Progress"; does NOT contain "in_progress" at status display position |
| AC2 | Unit test: render with `priority = 'critical'` | DOM contains "Critical"; does NOT contain "critical" at priority display position |
| AC3 | Unit test: render with `status = 'open'` | Button text = "Move to In Progress"; does NOT contain "in_progress" |

Existing test infrastructure: Jest + jest-preset-angular, 39 web tests passing at cycle 11 merge.
Test patterns: `HttpClientTestingModule`, `NoopAnimationsModule`, `HttpTestingController` per
existing spec files.

## Expected Diff Scope

- Files changed: 1 (`apps/web/src/app/issues/issue-detail.component.ts`)
- Lines added: ~15–20 (2 label map properties + 3 template expression edits + 3 test cases)
- New files: 0
- Test count: 39 → ≥42 (3 new unit tests covering AC1–AC3)
- CI impact: `npm run test:web` only; `npm run test:api` unaffected

## Dispatch Configuration

§5.2 (δ=γ, single-session Claude Code). Cycle is small-change (1 file, 3 ACs); §5.1 escalation
criteria not met.
