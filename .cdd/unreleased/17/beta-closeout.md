---
cycle: 17
issue: "gh #7 — enhancement: shared status/priority chip component + consolidated label maps"
role: β
artifact: beta-closeout
branch: cycle/17 → merged to main
---

# Beta Close-Out — Cycle 17

## Merge

- **Merge SHA:** `7e9fbca` (`feat: shared chip component + enum-aligned label maps (gh #7, cycle/17)`)
- **Merged into:** `main`
- **Merge strategy:** `--no-ff`
- **origin/main base SHA at review:** `f44a349`

## CI Status

- **CI on `cycle/17` HEAD:** No run — pre-existing structural gap O1 (CI workflow triggers on push/PR to `main` only, not on `cycle/{N}` branches). Noted explicitly per dispatch.
- **Local verification:** `npm run test:web` on cycle branch → 47 passed, 47 total. `npm run test:web` on merge commit (`7e9fbca`) → 47 passed, 47 total. ✓

## Review Rounds

**1 round** — APPROVE on R1. Zero RC findings.

## AC Outcome Table

| AC | Verdict | Evidence |
|----|---------|---------|
| AC1 — Chip renders colored labels | **PASS** | `chip.component.ts` standalone; `@Input() kind`, `@Input() value`; `colorVar` getter binds `var(--it-status-*)` / `var(--it-priority-*)`; `label` getter uses shared maps with raw-key fallback; 3 spec tests (label render, colorVar, unknown fallback) all pass |
| AC2 — Canonical label maps match entity enum | **PASS** | `issue-labels.ts`: STATUS_LABELS `{open/in_progress/done/closed}` exactly matches `IssueStatus` enum; `resolved` absent; PRIORITY_LABELS `{low/medium/high/critical}` exactly matches `IssuePriority` enum. Cross-checked against `apps/api/src/entities/issue.entity.ts` |
| AC3 — project-issues consumes chip; local maps deleted | **PASS** | `grep "statusLabels\|priorityLabels" project-issues.component.ts` → no output; `ChipComponent` in `imports` array; template uses `<app-chip [kind]="'status'" ...>` and `<app-chip [kind]="'priority'" ...>` |
| AC4 — issue-detail consumes chip; local maps deleted (view mode) | **PASS** | `grep "statusLabels\|priorityLabels" issue-detail.component.ts` → no output; `ChipComponent` in `imports` array; view-mode template uses `<app-chip>`; edit-mode `<mat-select>` unchanged (correct per non-goals); `getStatusLabel()` method uses `STATUS_LABELS[key] ?? key` for "Move to" button |

## Mechanical Pre-Checks

| Check | Result |
|-------|--------|
| Git identity — implementation commits authored by `alpha@issue-tracker.cdd.cnos` | ✓ PASS — `feat(web)` commit `7ee531c` and self-coherence commit both authored by `alpha@`; γ artifact commit by `gamma@` (permitted) |
| CI green gate | O1 gap — no run on `cycle/17`; local `npm run test:web` → 47/47 ✓ |
| γ scaffold present on `origin/cycle/17` | ✓ PASS — `git ls-tree` returns `.cdd/unreleased/17/gamma-scaffold.md` |
| Non-goal check — no `apps/api/`, `styles.scss`, `package.json` changes | ✓ PASS — all three diffs empty |

## Honest-Claim Check

`git show 7ee531c --numstat` vs `self-coherence.md §Diff scope`:

| File | SC claims (ins/del) | Numstat (ins/del) | Match |
|------|--------------------|--------------------|-------|
| `issues/issue-detail.component.spec.ts` | 4 / 2 | 4 / 2 | ✓ |
| `issues/issue-detail.component.ts` | 9 / 16 | 9 / 16 | ✓ |
| `projects/project-issues.component.spec.ts` | 4 / 1 | 4 / 1 | ✓ |
| `projects/project-issues.component.ts` | 4 / 16 | 4 / 16 | ✓ |
| `shared/chip.component.spec.ts` | 49 / 0 | 49 / 0 | ✓ |
| `shared/chip.component.ts` | 40 / 0 | 40 / 0 | ✓ |
| `shared/issue-labels.ts` | 13 / 0 | 13 / 0 | ✓ |

All 7 rows match exactly. **Honest-claim: PASS.**

Test count claimed: "47 passed, 47 total" — local verification confirmed "47 passed, 47 total". ✓  
Web test count ≥ 47 (baseline 44 + ≥3 chip tests): 47 = 44 + 3. ✓

## Notable Observations

**Design quality — single combined component:** α chose a single `<app-chip [kind]="'status'|'priority'" [value]="...">` over two separate components. The choice is sound: both chip types share identical logic (label lookup + CSS variable construction from the same key). No code duplication, no inflated surface area. The `kind` input is minimal branching, not complexity.

**`STATUS_LABELS` direct import in `issue-detail`:** In addition to using `ChipComponent`, `issue-detail.component.ts` directly imports `STATUS_LABELS` from the shared module for the `getStatusLabel()` method (used in "Move to" button text). This is appropriate — the constant comes from the shared source, is not re-defined, and the method is needed because the button is not a chip context. The AC4 oracle (`grep statusLabels|priorityLabels`) correctly excludes this import (it looks for the old local `readonly statusLabels` property, which is gone).

**`resolved` bug remediation:** The broken `project-issues` label map (which mapped `resolved` — a non-enum value — and was missing `done`) is now eliminated by deleting the entire local map and replacing with the shared correct constants. The fix is structural, not patched-over.

**Pre-merge gate row 3 (merge-test):** Branch was rebased on current `origin/main` (`f44a349`) at α dispatch time. Diff is purely Angular/TypeScript (no skill frontmatter, no API contract, no new external surfaces). Zero-conflict merge confirmed by `git merge --no-ff` output (no conflict messages). Tests on merge commit confirm 47/47. ✓
