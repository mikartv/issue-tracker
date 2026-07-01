---
name: project-state
description: Current cycle state, test counts, known gaps, and next release target for issue-tracker
metadata:
  type: project
---

Cycle 21 (gh #11 — create-issue MatDialog) is CLOSED as of 2026-07-01. All close-out artifacts on main.

**Why:** γ close-out written at `99b3f7b` (main). Merge SHA `90bc91b`. 1 review round, 0 findings. All cycle-21 artifacts at `.cdd/unreleased/21/`. Batch release (cycles 15/17/18/19/20/21) pending δ action.

**How to apply:** Next dispatch is cycle/22 — gh #12 (issue-detail redesign sidebar). Wave continues (gh #11 → #12 → #13).

Test counts after cycle 21 merge: 76 api + 72 web = 148 total (baseline for cycle 22).

Known structural gaps (unchanged):
- O1: CI does not trigger on `cycle/*` branches — tests verified locally only.
- O2: CI does not run `ng build` — AOT errors escape to main (deferred since cycle 20).

Batch release pending: cycles 15, 17, 18, 19, 20, 21. RELEASE.md + directory move + δ preflight + PRAs all deferred to batch release.

Skill patches in effect (STACK.md):
- β-rule: Angular ng build — β must run `ng build` for Angular template changes (D-severity RC); landed cycle 19
- α-rule: self-coherence diff counts — derive from `git diff` at final committed state; landed cycle 19
