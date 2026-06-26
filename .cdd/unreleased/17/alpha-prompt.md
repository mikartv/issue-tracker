# α Dispatch Prompt — Cycle 17

You are α (implementer) for CDD cycle 17.

## Skills (Tier 1a — load in order before any other step)

Load these files verbatim before taking any action:

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/issue/SKILL.md`
4. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md`
5. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md`

## Step 1 — Rebase onto origin/main (mandatory, before any other step)

```bash
git fetch origin
git switch cycle/17
git rebase origin/main
```

This brings in γ scaffold and all artifacts committed to main after the branch was created.
Do not skip this step — `gamma-scaffold.md` lives on main and must be present on your branch
before you begin implementation.

## Project context (read before implementing)

```
gh issue view 7                                         # full contract: gap, ACs, non-goals
.cdd/PROJECT.md                                         # verified repo map
.cdd/STACK.md                                           # pinned conventions + dispatch bindings
.cdd/SCOPE.md                                           # product boundary
.cdd/unreleased/17/gamma-scaffold.md                    # γ selection, peer enumeration, oracle approach
.cdd/iterations/INDEX.md                                # prior protocol findings
.cdd/releases/1.4.0/16/gamma-closeout.md                # last closed cycle
```

## Cycle

- **Issue:** gh #7 — enhancement: shared status/priority chip component + consolidated label maps
- **Branch:** `cycle/17`
- **Mode:** design-and-build (4 ACs)
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

## Git identity

Before any commit on `cycle/17`:

```bash
git config user.name "Alpha"
git config user.email "alpha@issue-tracker.cdd.cnos"
```

Verify identity before first commit:

```bash
git log -1 --format='%ae' HEAD
```

Must equal `alpha@issue-tracker.cdd.cnos`.

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) — standalone Angular components; inline component CSS (no new global SCSS) |
| CLI integration target | N/A (standalone Angular SPA) |
| Package scoping | `apps/web/src/app/shared/` (new dir: chip component + constants + spec); `apps/web/src/app/projects/project-issues.component.ts` + spec; `apps/web/src/app/issues/issue-detail.component.ts` + spec |
| Existing-binary disposition | N/A |
| Runtime dependencies | `@angular/material ~17.3.0` (already installed; `MatChipsModule` optionally available — check `apps/web/package.json`); no new npm deps; no API changes |
| JSON/wire contract preservation | API contract unchanged; no backend changes; existing `/api/v1` routes untouched |
| Backward-compat invariant | All 120 tests (76 api + 44 web) must pass with 0 regressions; existing status/priority display behavior preserved (same human labels, same fallback to raw key for unknowns) |

## Work

Implement all 4 ACs in gh #7 on branch `cycle/17`.

### AC1 — Shared chip component renders colored labels

Create a standalone Angular chip component under `apps/web/src/app/shared/`.

Design choice (α decides): one combined component `<app-chip [kind]="'status'" [value]="issue.status">` OR two separate `<app-status-chip [status]>` / `<app-priority-chip [priority]>`. Either is valid — choose whichever produces cleaner component code.

Requirements:
- Component is standalone (`standalone: true`)
- Input: the status or priority string value
- Output: the human label (from shared constants), displayed as chip text
- Color: chip background (or border/text) bound to the appropriate R1 CSS var
  - Status tokens: `var(--it-status-open)`, `var(--it-status-in-progress)`, `var(--it-status-done)`, `var(--it-status-closed)`
  - Priority tokens: `var(--it-priority-low)`, `var(--it-priority-medium)`, `var(--it-priority-high)`, `var(--it-priority-critical)`
- Fallback: if the value is not in the label map, display the raw key with neutral styling (no error)
- Do NOT use `MatChipsModule` if it adds more complexity than it solves — a plain `<span>` with inline component CSS is fine

### AC2 — Canonical label maps match the entity enum exactly

Create a shared constants file (e.g. `apps/web/src/app/shared/issue-labels.ts`) exporting:

```typescript
export const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
  closed: 'Closed',
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};
```

Requirements:
- Enum values match `apps/api/src/entities/issue.entity.ts` exactly
- `done` present (NOT `resolved`)
- `resolved` absent
- All four status values and all four priority values covered

### AC3 — project-issues consumes the shared chip; local maps deleted

In `apps/web/src/app/projects/project-issues.component.ts`:
- Import the shared chip component into the `imports` array
- Replace `{{ statusLabels[issue.status] ?? issue.status }}` template bindings with the chip component selector
- Replace `{{ priorityLabels[issue.priority] ?? issue.priority }}` bindings similarly
- Delete the local `statusLabels` and `priorityLabels` property definitions (L167–179)

After this change, `grep -n "statusLabels\|priorityLabels" project-issues.component.ts` must return nothing.

### AC4 — issue-detail consumes the shared chip; local maps deleted (view mode only)

In `apps/web/src/app/issues/issue-detail.component.ts`:
- Import the shared chip component
- Replace status/priority display in **view mode only** (the `@if (!editing)` branch or equivalent)
  - Status `<p>` and priority `<p>` display → chip component
  - "Move to" button label: may continue using `statusLabels` from shared constants or keep existing inline logic — only the local property definition must be removed; the shared constants import is the replacement
- Delete the local `statusLabels` and `priorityLabels` property definitions (L149–161)

After this change, `grep -n "statusLabels\|priorityLabels" issue-detail.component.ts` must return nothing.

## Tests

- Add ≥3 tests in the new chip component spec covering:
  1. Renders the human label (not the raw key) for a known status value
  2. Applies the correct CSS var for color (check `style` or CSS binding)
  3. Falls back to the raw key for an unknown value without throwing
- Update `project-issues.component.spec.ts` to replace assertions that reference the old label-map behavior (e.g. `statusLabels['open']`) with assertions on the chip component's rendered text
- Update `issue-detail.component.spec.ts` similarly
- `npm run test:web` must pass with ≥47 tests (baseline 44 + ≥3 new chip tests) and 0 failures

## Pre-review gate

Apply `alpha/SKILL.md §2.6` transient-row doctrine. Before signaling review-readiness:

1. **Re-verify all transient rows** in `self-coherence.md §Review-readiness` as observed state, not written intent:
   - Row 1: run `git ls-tree -r --name-only origin/cycle/17 .cdd/unreleased/17/gamma-scaffold.md` — confirm non-empty (rebase from Step 1 should have brought this in)
   - Row 3: paste the actual last line of `npm run test:web` output into `self-coherence.md §Tests at signal`
   - Row 4: run `git show <impl-commit> --numstat` and verify every `§Diff scope` row matches exactly

2. **Intra-document consistency check** (`alpha/SKILL.md §2.3`): §Review-readiness rows must not contradict §Debt items. If §Debt notes the scaffold might be missing, and Row 1 says it's present — one of them must be wrong. Fix both to match observed state before signaling.

3. **Diff scope counts verified** via runner output: Run `git show <impl-commit> --numstat` (the SHA of the last implementation commit, NOT the readiness-signal commit) and verify insertions/deletions in every `§Diff scope` row match the numstat output exactly. Do not use estimated or preliminary counts.

## Self-coherence

Write `.cdd/unreleased/17/self-coherence.md` on `cycle/17` before signaling review-readiness.

Required sections:
- Gap covered
- Mode: design-and-build (4 ACs)
- Component design decision (which chip shape α chose, and why)
- AC outcomes: AC1–AC4, each with PASS/FAIL + brief evidence
- Diff scope (files changed, insertions, deletions — from `git show <impl-commit> --numstat`)
- Tests at signal (api + web counts from `npm run test:web` runner output — paste the exact last line)
- Known Gaps (WCAG contrast not validated; deferred per issue non-goals)
- CDD Trace (steps 1–7)
- Review-readiness section (round 1, base SHA, branch CI status, transient rows re-verified)

## Signal

After all ACs pass, pre-review gate passes, and self-coherence is committed to `cycle/17`:

```
REVIEW READY
Branch: cycle/17
ACs: AC1 ✓ AC2 ✓ AC3 ✓ AC4 ✓
Tests: 76 api + N web = N+76 total
```

Do not merge. Do not push to main. β will review.
