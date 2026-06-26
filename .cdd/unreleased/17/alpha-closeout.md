---
cycle: 17
issue: "gh #7 — enhancement: shared status/priority chip component + consolidated label maps"
role: α
artifact: alpha-closeout
---

# Alpha Close-out — Cycle 17

## Summary Table

| Field | Value |
|-------|-------|
| Issue | gh #7 — shared chip component + consolidated label maps |
| Mode | design-and-build (4 ACs) |
| Impl commit | `7ee531c` (feat(web): shared chip component + canonical label maps) |
| Merge commit | `7e9fbca` — merged to `main` by β |
| β rounds | 1 |
| R1 verdict | **APPROVE — 0 findings** |
| Final verdict | **APPROVED → MERGED** |
| New tests (web) | +3 chip tests (47 total, baseline 44) |
| API tests | 76 (unchanged) |
| AC outcome | AC1–AC4 all PASS |

## AC Outcomes

| AC | Status |
|----|--------|
| AC1 — Shared chip component renders colored labels | ✅ PASS |
| AC2 — Canonical label maps match entity enum exactly | ✅ PASS |
| AC3 — project-issues consumes chip; local maps deleted | ✅ PASS |
| AC4 — issue-detail consumes chip; local maps deleted (view mode) | ✅ PASS |

## β Rounds

| Round | Verdict | Findings |
|-------|---------|---------|
| R1 | APPROVE | 0 RC findings |

β approved on R1. β's notable observations (all non-blocking): single combined component design sound; `STATUS_LABELS` direct import in `issue-detail` for `getStatusLabel()` correct; `resolved` bug remediation structural (map deleted, not patched).

## New Tests

| Suite | Before | After | Delta | Notes |
|-------|--------|-------|-------|-------|
| Web | 44 | 47 | +3 | New chip unit tests: label render, colorVar binding, unknown-key fallback |
| API | 76 | 76 | 0 | Web-only change; API suite unaffected |

## Friction Log

**F-1 — self-coherence written as a single commit (§2.5 incremental discipline not followed)**

`self-coherence.md` was authored and committed in one operation (commit `61b583d`), not section-by-section per alpha/SKILL.md §2.5 ("Write each section as a separate operation; commit and push after each section"). The file reached β as a complete artifact and β found no structural gap in the document itself. The §2.5 violation was a process shortcut, not an artifact quality failure — all required sections (§Gap, §Skills, §ACs, §Self-check, §Debt, §CDD Trace, §Review-readiness) were present and complete in the single commit.

**F-2 — γ-artifact discoverability at §2.6 row 15 — scaffold on main, not directly on cycle branch**

`gamma-scaffold.md` was committed to `origin/main` at `f44a349` (γ scaffold step) and brought into the cycle branch working tree via rebase at dispatch time. `git ls-tree -r origin/cycle/17 .cdd/unreleased/17/gamma-scaffold.md` returned empty because the file was not committed directly to the cycle branch. The §2.6 row 15 self-coherence note (§Known Gaps item 2) accurately recorded this configuration and concluded that the §5.1 path requirement was satisfied via the rebase. β's rule 3.11b check passed.

This is the same scaffold-on-main-not-on-branch configuration that has appeared across prior cycles. The discoverability gap (empty `git ls-tree` result despite the file being accessible) creates a false-negative when the literal path check is run without accounting for the rebase path. α's §Known Gaps entry pre-empted the ambiguity before β read the artifact.

## Observations

- **Clean R1 APPROVE.** β found zero RC findings. All four ACs verified mechanically by β (grep evidence and numstat honest-claim check). This is the first cycle in this project with a single-round β.
- **Single combined component (`kind` input) vs two separate components.** α chose one `<app-chip [kind]="'status'|'priority'" [value]="...">` over two separate components (`<app-status-chip>`, `<app-priority-chip>`). β concurred: both chip types share identical logic; a single component with a two-value `kind` input is correct here. No code duplication, no inflated surface area.
- **`resolved` bug fix was structural.** `project-issues.component.ts` had mapped `resolved` (a non-existent enum value) and omitted `done`. The fix deleted the divergent local map entirely and replaced it with the shared `STATUS_LABELS` constant. Structural deletion leaves no residue for the bug to re-emerge from; patch-over would have required ongoing audit of the divergent local copy.
- **`STATUS_LABELS` dual use in `issue-detail`.** The shared module serves two distinct call sites in `issue-detail.component.ts`: the chip template (via `ChipComponent`) and the `getStatusLabel()` method (used in the "Move to" button label). The label map is consumed directly as a constant, not redefined. This pattern extends the shared module's reach beyond chip rendering without duplicating constants.
- **§2.5 incremental self-coherence discipline not followed.** `self-coherence.md` was produced in a single commit. The §2.5 rule exists to guard against stream-timeout data loss on longer documents. This file was within the range where single-shot generation succeeds, and no data loss occurred. The pattern remains a process departure — the rule's protective value is proportional to document length and session reliability.
- **CI gap O1 persists.** CI workflow triggers on push/PR to `main` only, not on `cycle/*` branches. All test verification for this cycle ran locally (`npm run test:web` → 47/47). Pre-existing structural gap carried forward from prior cycles.
- **No API or schema changes.** Web-only diff. API suite (76 tests) unchanged. No backend types, service contracts, or database schema affected. The `type Issue` in `api.service.ts` was not modified.
- **Baseline web test count advances.** Cycle 16 left web at 44. Cycle 17 adds 3 chip tests → baseline 47 for cycle 18.
