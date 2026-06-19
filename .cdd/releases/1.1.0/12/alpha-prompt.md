---
cycle: 12
role: α
artifact: alpha-prompt
---

# α Dispatch Prompt — Cycle 12

You are **α** in a CDD cycle. Your role is to implement. You do not review. You do not
coordinate. You produce matter and exit after signaling review-readiness.

## Skills (Tier 1a — load in order before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`

## Project context

- `gh issue view 2` — full contract (gap, ACs, non-goals)
- `.cdd/PROJECT.md` — verified repo map
- `.cdd/STACK.md` — pinned conventions + dispatch bindings (includes α-rules)
- `.cdd/unreleased/12/gamma-scaffold.md` — γ scope decision, oracle table, discrepancy note
- `.cdd/SCOPE.md` — product boundary

## Branch

`cycle/12` (exists on origin)

```bash
git switch cycle/12
git pull origin cycle/12
```

## Issue

`gh issue view 2`

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript strict |
| CLI integration target | N/A |
| Package scoping | `apps/web/src/app/issues/issue-detail.component.ts` only |
| Existing-binary disposition | N/A |
| Runtime dependencies | Angular 17, Angular Material (already imported — no new packages) |
| JSON/wire contract preservation | No API changes; template-only fix |
| Backward-compat invariant | All 39 existing web tests must pass; `npm run test:api` unaffected |

## Critical constraint (read γ-scaffold §"Discrepancy" before implementing)

`project-issues.component.ts` statusLabels maps `resolved: 'Resolved'` — but the entity
enum (`apps/api/src/entities/issue.entity.ts`) has `done`, not `resolved`. The `NEXT_STATUS`
constant in `issue-detail.component.ts` also uses `done`. Use entity-canonical keys:

```typescript
readonly statusLabels: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
  closed: 'Closed',
};
```

Do NOT add a `resolved` key. Do NOT touch `project-issues.component.ts` — its discrepancy
is out of scope for cycle 12.

## Implementation notes

These are orientation notes only. α determines the implementation approach.

**What exists today in `issue-detail.component.ts`:**
- L18: `const NEXT_STATUS = { open: 'in_progress', in_progress: 'done', done: 'closed', closed: null }`
- L50: `<p><strong>Status:</strong> {{ issue.status }}</p>` — raw key, needs label lookup
- L51: `<p><strong>Priority:</strong> {{ issue.priority }}</p>` — raw key, needs label lookup
- L58: `<button ...>Move to {{ nextStatus }}</button>` — raw key, needs label lookup
- L149–150: `get nextStatus()` returns raw key string or null

**Template binding pattern (follow existing `project-issues.component.ts`):**
```html
{{ statusLabels[issue.status] ?? issue.status }}
{{ priorityLabels[issue.priority] ?? issue.priority }}
Move to {{ statusLabels[nextStatus] ?? nextStatus }}
```

Note: `nextStatus` getter returns `string | null`; the `@if (nextStatus)` guard before
the button ensures it is non-null when the button renders.

**Tests** — Use the existing spec patterns in
`apps/web/src/app/issues/issue-detail.component.spec.ts`. Add test cases that:
- Set `issue.status = 'in_progress'` and assert "In Progress" appears (AC1)
- Set `issue.priority = 'critical'` and assert "Critical" appears (AC2)
- Set `issue.status = 'open'` and assert button text "Move to In Progress" (AC3)

## Self-coherence

Write `.cdd/unreleased/12/self-coherence.md` when implementation is complete. Include:
- AC table with pass/fail per AC
- CDD Trace entries for each lifecycle step completed
- Any debt items (e.g. pre-existing `resolved` discrepancy in `project-issues.component.ts`)

## Exit signal

When all ACs AC1–AC3 pass and `npm run test:web` is green (≥39 tests, including 3 new):

1. Commit `self-coherence.md` to `cycle/12`
2. Push to `origin/cycle/12`
3. Commit message: `cdd: self-coherence review-ready (cycle 12)`

Do not merge. Do not push to main. Exit after pushing the review-ready signal.
