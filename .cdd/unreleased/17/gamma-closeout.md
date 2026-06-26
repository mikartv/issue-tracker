---
cycle: 17
issue: "gh #7 — enhancement: shared status/priority chip component + consolidated label maps"
role: γ
artifact: gamma-closeout
merge-sha: 7e9fbca
---

<!-- section-manifest
  [x] §Cycle Summary
  [ ] §Post-Merge Verification
  [ ] §Close-out Triage Table
  [ ] §Independent γ Process-Gap Check
  [ ] §Cycle Iteration Triggers
  [ ] §Immediate Outputs
  [ ] §Deferred Outputs
  [ ] §Next MCA
  [ ] §Hub Memory
-->

# γ Close-Out — Cycle 17

## Cycle Summary

- **Issue:** gh #7 — shared status/priority chip component + consolidated label maps
- **Mode:** design-and-build (4 ACs)
- **Review rounds:** 1 (R1: APPROVE — 0 RC findings)
- **Findings:** 0 RC findings; 2 non-blocking observations (F-1, F-2 from α friction log)
- **AC outcome:** AC1–AC4 PASS
- **Tests at merge:** 123 (76 api + 47 web, +3 chip tests vs 120 baseline)
- **Merge commit:** `7e9fbca` (main)
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

**What shipped:** Shared `<app-chip [kind] [value]>` component in `apps/web/src/app/shared/`
with canonical `STATUS_LABELS` / `PRIORITY_LABELS` constants. Both chip types share
identical logic (label lookup + CSS variable binding from R1 design tokens). Chip adopted
in `project-issues.component.ts` and `issue-detail.component.ts` (view mode); local
divergent label maps deleted from both components. Fixed latent `resolved`/`done` label
bug in `project-issues` by structural deletion of the broken map. gh #7 closed.
