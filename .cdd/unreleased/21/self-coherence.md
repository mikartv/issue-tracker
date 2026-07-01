---
cycle: 21
issue: "gh #11 — enhancement: move create-issue into a MatDialog triggered from a New Issue button"
role: α
artifact: self-coherence
---

# Self-Coherence — Cycle 21

## §Gap

**Issue:** gh #11 — enhancement: move create-issue into a MatDialog triggered from a New Issue button

**Pre-cycle state:**
- `rg "MatDialog|CreateIssueDialog|createIssueDialog|dialog" apps/web/src/ --include="*.ts"` → zero matches (confirmed by γ §Selection peer enumeration)
- `ProjectIssuesComponent` had an always-visible inline create-section div containing 4 mat-form-fields (Title / Description / Priority / Assignee), a Create Issue button, and related component properties (`newTitle`, `newDescription`, `newPriority`, `newAssignee`, `successMessage`, `createError`, `projectArchived`)
- No `CreateIssueDialogComponent` existed; no dialog trigger existed

**Gap:** Inline always-visible create form occupies permanent vertical space below the issues board. Users cannot dismiss it. Modern pattern: create surface appears on intent (dialog) and dismisses on completion.

**Version / Mode:** design-and-build (4 ACs, single cycle, no split)
