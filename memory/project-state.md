---
name: project-state
description: Current cycle state, test counts, known gaps, and next release target for issue-tracker
metadata:
  type: project
---

Cycle 23 (gh #13 — global feedback: NotificationService toasts + empty/error states) is CLOSED as of 2026-07-02. All close-out artifacts on main.

**Why:** γ close-out written at `475c504` (main). Merge SHA `5ef5197`. 1 review round, 0 findings. All cycle-23 artifacts at `.cdd/unreleased/23/`. Batch release (cycles 15/17/18/19/20/21/22/23) pending δ action.

**How to apply:** Next dispatch is cycle/24 — gh #8 (Kanban board tracking for project issues). Design wave (gh #11 → #12 → #13) complete; #8 is the next open P2 enhancement.

Test counts after cycle 23 merge: 76 api + 84 web = 160 total (baseline for cycle 24).

Notable cycle 23 pattern: α mid-session stop required γ resumption re-dispatch before β. Resumption protocol (alpha/SKILL.md §4 section-manifest) handled correctly. No implementation changes during resumption.

Known structural gaps (unchanged):
- O1: CI does not trigger on `cycle/*` branches — tests verified locally only. Third consecutive deferral — elevated priority.
- O2: CI does not run `ng build` — AOT errors escape to main (deferred since cycle 20).

Batch release pending: cycles 15, 17, 18, 19, 20, 21, 22, 23. RELEASE.md + directory move + δ preflight + PRAs all deferred to batch release.

Open issues: gh #8 (Kanban board tracking — selected next MCA), gh #6 (modern app shell — investigate open state; cycle 16 delivered it).

Skill patches in effect (STACK.md):
- β-rule: Angular ng build — β must run `ng build` for Angular template changes (D-severity RC); landed cycle 19
- α-rule: self-coherence diff counts — derive from `git diff` at final committed state; landed cycle 19
