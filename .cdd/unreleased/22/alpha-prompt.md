# α Dispatch Prompt — Cycle 22

You are α (implementer). Project: issue-tracker.
Dispatch config: §5.2 — sub-agent, fresh context.

## Skills (Tier 1a — load before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`

## Skill to load for this cycle (Tier 3)

- Angular Material layout — `MatCardModule` for sidebar card, existing Angular Material imports in component
- R1 tokens — `apps/web/src/styles.scss` (CSS custom properties `--it-space-*`, `--it-radius-*`, `--it-shadow-*`, `--it-surface`, `--it-background`, `--it-status-*`, `--it-priority-*`)
- R3 chip — `apps/web/src/app/shared/chip.component.ts` (`ChipComponent` with `STATUS_LABELS`/`PRIORITY_LABELS`)

## Issue

```
gh issue view 12 --json title,body,state
```

## Branch

`cycle/22` — already created from `origin/main`. Switch to it before starting.

```bash
git switch cycle/22
```

## Baseline

- **Pre-cycle tests:** 72 web + 76 api = 148 total (source: cycle 21 γ close-out)
- **Pre-cycle web tests in issue-detail spec:** 13 tests

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) |
| CLI integration target | N/A |
| Package scoping | `apps/web/` only |
| Existing-binary disposition | N/A |
| Runtime dependencies | Angular 17, Angular Material 17 (all already installed) |
| JSON/wire contract preservation | No API changes; `ApiService` methods unchanged |
| Backward-compat invariant | N/A (v1 in progress) |

## Scaffold

Read `.cdd/unreleased/22/gamma-scaffold.md` on `origin/cycle/22` for the full implementation
guidance including: layout approach, template draft, token usage, new `getInitials` method, and
test oracle approach.

## Key constraints

1. **Two-area layout:** `.detail-layout` CSS grid (1fr + 280px sidebar). Mobile: single column.
2. **Comments always visible:** comment `<section>` is outside any `@if (editMode)` block.
3. **Inline edit:** only title/description fields toggle view↔edit; sidebar retains status chip and
   shows priority/assignee as edit fields in edit mode. Title and status are always visible
   (status chip stays in sidebar regardless of edit mode).
4. **Save/Cancel behavior unchanged:** `saveEdit()` calls `api.updateIssue()`; `cancelEdit()`
   makes no API call. Both methods already exist — do not change their logic.
5. **R1 tokens:** replace `#c00`/`#0a0`/`#eee` literals. Use `--it-priority-critical` for error
   red, `--it-status-done` for success green, `rgba(0,0,0,0.08)` for comment divider.
6. **No new modules or files.** `MatCardModule` is already imported; `ChipComponent` is already
   imported. All needed Angular Material modules are already present.
7. **`getInitials(author: string): string`** — new method. Returns first character uppercased from
   the part before `@` (e.g. `'alice@example.com'` → `'A'`).

## §2.5 reminder

After committing your changes, re-read `alpha/SKILL.md §2.5` (review-readiness signal) before
signaling review-readiness. Ensure `self-coherence.md` is complete, diff-scope counts are from
`git diff` at final committed state (not estimates), and the `ng build` check is recorded.

## Self-coherence

Write `.cdd/unreleased/22/self-coherence.md` on `cycle/22` before signaling review-readiness.
Include: gap, mode, ACs, implementation notes, diff scope (from `git diff origin/main`), ng build
result, test results (`npm run test:web`), review-readiness.

## Rebase note

If `origin/main` has advanced since branch creation, rebase before your first commit:
```bash
git fetch origin && git rebase origin/main
```

## Exit condition

When done: commit all changes to `cycle/22`, push, write `self-coherence.md`, push again.
Signal review-readiness by appending a comment to `self-coherence.md` or by a final commit
message containing `[review-ready]`.
