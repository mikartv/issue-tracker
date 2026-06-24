---
cycle: 15
issue: "gh #5 — enhancement: redesign Projects screen — card grid, empty + loading states"
role: α
artifact: alpha-closeout
---

# Alpha Close-out — Cycle 15

## Summary Table

| Field | Value |
|-------|-------|
| Issue | gh #5 — redesign Projects screen |
| Mode | enhancement |
| Impl commits | `757a528` (implementation), `1afb6eb` (self-coherence diff-count fix, F-1) |
| Merge commit | `adf8071` — merged to `main` by β |
| β rounds | 2 |
| R1 verdict | REQUEST CHANGES — F-1 (B, honest-claim) |
| R2 verdict | APPROVE — 0 findings |
| Final verdict | **APPROVED → MERGED** |
| New tests | +1 web (43 total, baseline 42) |
| AC outcome | AC1–AC4 all PASS |

## AC Outcomes

| AC | Status |
|----|--------|
| AC1 — Responsive card grid | ✅ PASS |
| AC2 — Designed empty state | ✅ PASS |
| AC3 — Loading state retained | ✅ PASS |
| AC4 — Card actions preserved + token cleanup | ✅ PASS |

## β Rounds

| Round | Verdict | Finding |
|-------|---------|---------|
| R1 | REQUEST CHANGES | F-1 (B, honest-claim): §Diff scope in `self-coherence.md` stated `+93/−46` for `projects-list.component.ts` and `+17/−11` for `.spec.ts`; actual (`git show 757a528 --numstat`) was `+78/−44` and `+15/−2`; total claimed `+110/−57`, actual `+93/−46` |
| R2 | APPROVE | 0 findings — F-1 resolved via `1afb6eb`; all honest-claim checks pass |

## New Tests

| Suite | Before | After | Delta | Notes |
|-------|--------|-------|-------|-------|
| Web | 42 | 43 | +1 | Added `AC1: renders mat-card elements and no mat-table`; replaced stale AC3 empty-state assertion with `AC2: shows designed empty state with icon and CTA` |
| API | 76 | 76 | 0 | Web-only change; API suite unaffected |

## Friction Log

**F-1 — B — honest-claim — §Diff scope mismatch (R1 → resolved R2)**

Self-coherence `§Diff scope` table copied preliminary diff estimates rather than running `git show --numstat` against the final commit. Both files had mismatched counts; the spec file discrepancy was largest (`+17/−11` claimed vs `+15/−2` actual). Fix was documentation-only — no code change required. Added one β round.

*Root cause:* Diff counts were written before the commit was finalized; not re-verified at review-readiness gate.

## Observations

- **F-1 is a repeating class.** Diff-count mismatch in self-coherence `§Diff scope` has now appeared in multiple cycles. The fix is mechanical: run `git show <impl-commit> --numstat` and paste the output immediately before marking review-ready. A pre-review checklist item would close this permanently.
- **Scaffold accuracy was high.** γ enumerated all 3 hardcoded color literals (`#c00`, `#ccc`) and accurately predicted the surfaces α would touch. Peer enumeration required no corrections.
- **Token coverage exceeded minimum.** 10 `var(--it-*)` applications against a requirement of ≥2. All color literals replaced.
- **CI gap O1 persists.** CI does not trigger on feature branches (`cycle/15`); tests were verified locally only. Established as a structural gap in cycle 14 and carried forward. Does not block per standing exception.
- **No backend impact.** Change is web-only; API suite unchanged; no schema, type, or contract changes.
