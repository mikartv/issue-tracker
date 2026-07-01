---
cycle: 22
issue: "gh #12"
role: alpha
artifact: closeout
---

# Alpha Closeout — Cycle 22 (gh #12)

## §Cycle Summary

- **Issue:** gh #12 (issue-detail redesign)
- **Branch:** cycle/22
- **Merge SHA:** `0263f2fbc3d12c6e9d76ec25b2229804e81ffb4d`
- **AC outcome:**
  - AC1 — Two-area CSS grid layout with metadata sidebar: PASS
  - AC2 — Comments always visible (outside `@if (editMode)`): PASS
  - AC3 — Inline edit preserves context; Save calls `updateIssue`; Cancel no API call: PASS
  - AC4 — Styled comment thread with initials avatar, R1 tokens, no `<ul>/<li>`: PASS
- **Test counts:**
  - 76 web (baseline 72, +4 new AC-covering specs), 76 api (unchanged) = 152 total
  - Note: β recorded 76 web / 35 api unit (41 e2e skipped due to Postgres connectivity); local `test:all` baseline is 148 = 72 web + 76 api
- **ng build:** PASS (exits 0, no NG8XXX errors; pre-existing budget warning unchanged)

## §Implementation Notes

- **Files changed:**
  - `apps/web/src/app/issues/issue-detail.component.ts`
  - `apps/web/src/app/issues/issue-detail.component.spec.ts`
- **Diff scope (origin/main~3..origin/main):**
  - `issue-detail.component.ts`: +174 lines added / -69 lines removed
  - `issue-detail.component.spec.ts`: +104 lines added (net new specs)
- **What shipped:**
  - Two-area CSS grid layout separating main content from metadata sidebar
  - Always-visible comments section (no longer gated behind `editMode`)
  - Inline edit mode preserving comments/context in view
  - Styled comment thread with initials-based avatar, author name, timestamp
  - R1 design-token replacements (removed `#c00`/`#0a0`/`#eee` color literals)

## §Debt / Known gaps

- None introduced in this cycle. The pre-existing `ng build` budget warning (bundle size) was present before cycle/22 and is not attributable to this change.

## §β findings

- **Round 1:** APPROVE, zero findings

## §Review-readiness (retrospective)

- `self-coherence.md` complete? **Yes** — all 4 ACs tabulated with PASS status, diff line counts provided, test delta documented, ng build result recorded, `[review-ready]` declaration present. No gaps identified.
