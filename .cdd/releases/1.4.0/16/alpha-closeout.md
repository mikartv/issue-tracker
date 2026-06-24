---
cycle: 16
issue: "gh #6 — enhancement: modern app shell — toolbar, brand, responsive content layout"
role: α
artifact: alpha-closeout
---

# Alpha Close-out — Cycle 16

## Summary Table

| Field | Value |
|-------|-------|
| Issue | gh #6 — modern app shell |
| Mode | design-and-build (3 ACs, small-change) |
| Impl commits | `988a9d4` (implementation) |
| Merge commit | `9a3aed7` — merged to `main` by β |
| β rounds | 2 |
| R1 verdict | REQUEST CHANGES — F-1 (D, protocol-compliance), F-2 (B, honest-claim) |
| R2 verdict | APPROVE — 0 findings |
| Final verdict | **APPROVED → MERGED** |
| New tests | +1 web (44 total, baseline 43) |
| AC outcome | AC1–AC3 all PASS |

## AC Outcomes

| AC | Status |
|----|--------|
| AC1 — Toolbar present and unconditional on all routes | ✅ PASS |
| AC2 — Brand links home via router | ✅ PASS |
| AC3 — Responsive content frame | ✅ PASS |

## β Rounds

| Round | Verdict | Finding |
|-------|---------|---------|
| R1 | REQUEST CHANGES | F-1 (D, protocol-compliance): `gamma-scaffold.md` absent from `origin/cycle/16`; rule 3.11b gate fired. Branch was created from `f5f01ff` before γ committed scaffold to main at `aab3c95`; no rebase occurred before review-readiness signal. F-2 (B, honest-claim): §Review-readiness Row 1 falsely claimed `aab3c95` was ancestor of cycle/16; §Debt item 2 in the same document correctly acknowledged scaffold was absent — an intra-document contradiction. |
| R2 | APPROVE | 0 findings — F-1 resolved by rebasing cycle/16 onto `aab3c95`; F-2 resolved by updating Row 1 to accurately record the post-rebase state. |

## New Tests

| Suite | Before | After | Delta | Notes |
|-------|--------|-------|-------|-------|
| Web | 43 | 44 | +1 | Added `should render mat-toolbar (AC1)` assertion in `app.component.spec.ts` |
| API | 76 | 76 | 0 | Web-only change; API suite unaffected |

## Friction Log

**F-1 (D) + F-2 (B) — shared root cause — branch not rebased before review-readiness signal (R1 → resolved R2)**

γ committed the scaffold to `origin/main` at `aab3c95` after the cycle branch was created. Pre-review gate row 1 requires α to verify cycle/16 is rebased onto current `origin/main` before signaling. The row was not accurately verified: Row 1 recorded the rebase as complete when it was not. §Debt item 2 (in the same file) correctly flagged the scaffold absence, but this contradiction was not caught before signaling.

Fix was a single rebase (`git rebase origin/main && git push --force-with-lease origin cycle/16`) that resolved both findings simultaneously. No code change required; the implementation itself was not affected.

*Root cause:* Row 1 verification was written in intent rather than observed state. The rebase check must be executed and its output recorded, not inferred from the dispatch timeline.

## Observations

- **F-1/F-2 share one root cause.** Both findings dissolved after one rebase. The 2-round count is the minimum for this failure class per β's closeout note. The failure class is: pre-review gate row 1 not verified at signal time.
- **Pre-review gate row 1 is a transient row.** Per alpha/SKILL.md §2.6, transient rows (row 1: cycle branch rebased; row 10: branch CI green) describe external state that can change between write time and β read time. Row 1 must be validated immediately before signaling, not at self-coherence authoring time. This cycle's Row 1 was written at authoring time without re-validation at signal.
- **Intra-document contradiction (F-2).** Same document held Row 1 asserting the rebase was done and §Debt item 2 acknowledging it was not. §2.3's intra-doc repetition rule applies: before signaling, grep the document for every claim about the rebase state and verify consistency. Two occurrences this cycle.
- **Implementation quality was clean.** β noted no substantive findings. Single-file change, no new npm dependencies, R1 tokens applied correctly. AC3 responsive rationale (box-sizing + token padding at 375px) was structurally sound.
- **CI gap O1 persists.** CI does not trigger on `cycle/*` branches. Tests verified locally only. Pre-existing structural gap carried forward from cycles 14–15.
- **No backend impact.** Web-only change. API suite unchanged. No schema, type, or contract changes.
