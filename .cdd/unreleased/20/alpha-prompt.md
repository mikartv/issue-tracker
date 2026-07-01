# α Dispatch Prompt — Cycle 20

You are α (implementer). Project: issue-tracker.

## Skills (Tier 1a — load in order before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`

## Issue

```
gh issue view 14 --json title,body,state
```

## Project context (read before implementing)

```
.cdd/PROJECT.md
.cdd/STACK.md
.cdd/unreleased/20/gamma-scaffold.md
```

## Cycle

- **Issue:** gh #14
- **Cycle:** 20
- **Branch:** `cycle/20`

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) |
| CLI integration target | N/A |
| Package scoping | `apps/web/` only |
| Existing-binary disposition | N/A |
| Runtime dependencies | Angular 17, @angular/cdk |
| JSON/wire contract preservation | No API changes |
| Backward-compat invariant | 61 existing web tests must pass |

## Task

Fix the NG8002 build error: `[cdkDropListGroup]` is a directive selector, not an input property. Remove the brackets.

**File:** `apps/web/src/app/projects/project-issues.component.ts`
**Line 51:** change `[cdkDropListGroup]` → `cdkDropListGroup`

## Acceptance criteria

1. `ng build --configuration=production` exits 0 with no NG8002 error (run from `apps/web/`)
2. All existing 61 web tests pass: `npm run test:web` (run from repo root)

## Self-coherence

Write `.cdd/unreleased/20/self-coherence.md` on `cycle/20` per `alpha/SKILL.md`. §Diff scope: derive line counts from `git diff origin/main -- apps/web/src/app/projects/project-issues.component.ts | grep -c '^[+-]'` AFTER the source edit is committed (per STACK.md §α-rule: self-coherence diff counts). Never estimate; run the command.

Signal review-readiness by committing `self-coherence.md` to `cycle/20`.

## Non-goals

- No new tests (this is a 2-char fix for a known defect; existing tests cover the board)
- No changes to API, styles, other components, or other templates
- No `ng build` CI step (deferred to δ; separate issue)

## Notes

- Dispatch config §5.2: β will review in a separate sub-agent session
- Per STACK.md §β-rule: Angular ng build — β will run `ng build` as part of review; your local `ng build` pass is required before signaling review-readiness
- Source baseline test count: 61 web (from cycle 19 γ close-out)
