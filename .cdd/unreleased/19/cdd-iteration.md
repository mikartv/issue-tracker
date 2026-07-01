---
cycle: 19
issue: "gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop"
role: γ
artifact: cdd-iteration
protocol_gap_count: 3
---

# CDD Iteration — Cycle 19

## Summary

| # | Finding | Gap type | Severity | Disposition |
|---|---------|----------|----------|-------------|
| F1 | β review protocol silent on `ng build` for Angular template changes | cdd-skill-gap | D | Patch landed — STACK.md §β-rule: Angular ng build |
| F2 | CI does not include `ng build` step for web job | cdd-tooling-gap | C | Deferred — δ action required (edit `.github/workflows/ci.yml`) |
| F3 | α §Diff scope authored from estimates, not from `git diff` at final committed state | cdd-skill-gap | B | Patch landed — STACK.md §α-rule: self-coherence diff counts |

---

## F1 — β review protocol silent on `ng build` (cdd-skill-gap, D)

**Gap:** STACK.md §β-rule: CI green gate requires β to verify Jest CI status (`gh run list --branch cycle/N`). The rule is silent on `ng build` for Angular component changes. β applied the rule correctly; the rule itself was incomplete.

**Evidence:** `[cdkDropListGroup]` (property binding on directive selector) in `project-issues.component.ts` template line 51 causes NG8002 at AOT compile. Jest tests do not invoke the Angular compiler; CI does not run `ng build`. The error was undetected until δ post-merge check.

**Impact:** `ng build` fails on main post-cycle-19 merge. Deploying the web app requires fixing the template before the next production build. Tests still pass; no functional regression in test-covered paths.

**Patch:** STACK.md §β-rule: Angular ng build (added this session):
> β MUST run `ng build --configuration=production` and verify it exits 0 for any cycle that modifies Angular component templates (`.html` or inline template in `.component.ts`). `ng build` failure is an RC finding, D-severity, `aot-build-fail`. Exception: documentation-only cycles with zero template changes.

**Next MCA linked:** cycle/20 — fix `[cdkDropListGroup]` → `cdkDropListGroup` in `project-issues.component.ts`.

---

## F2 — CI does not include `ng build` step (cdd-tooling-gap, C)

**Gap:** `.github/workflows/ci.yml` web job runs `npm run test:web` (Jest). It does not run `ng build`. AOT compilation errors are class of template mistakes that Jest cannot catch but `ng build` reliably surfaces.

**Evidence:** CI was green on post-merge main commits (`6e5f87b`, `8992715`) despite `ng build` failing with NG8002.

**Impact:** The CI green signal is misleading for Angular template correctness — it confirms unit test pass but not build pass. Any Angular template syntax error escapes to main.

**Patch:** Deferred — requires δ to add `npx ng build --configuration=production` step to the web CI job in `.github/workflows/ci.yml`. First AC: web CI job fails when `ng build` produces NG8XXX errors.

---

## F3 — α §Diff scope estimated rather than derived (cdd-skill-gap, B)

**Gap:** α authored §Diff scope figures in `self-coherence.md` from manual estimates during implementation, before source edits were finalized. This caused:
- B-1: estimate (+280 net) vs actual (+166 net) — off by factor of 1.7
- B-2: after R2 fix, measurement was still from pre-fix state — off by 1

Both findings required RC rounds that consumed 2 extra review cycles for a documentation-only correction.

**Evidence:** α-closeout §Friction Log documents the root cause: "Both B-1 and B-2 stem from authoring §Diff scope figures manually (or before finalizing source edits) rather than running `git diff` at commit time and copying the exact output."

**Impact:** 3 review rounds (target ≤2 for code cycles) for a cycle where all AC implementations were correct at R1. The extra rounds were purely documentation accuracy overhead.

**Patch:** STACK.md §α-rule: self-coherence diff counts (added this session):
> Derive §Diff scope line counts from `git diff origin/main -- <file> | grep -c '^[+-]'` run AFTER all source edits are committed. Never estimate; never copy from a draft measurement. If a source edit is made after §Diff scope is written, recount before committing self-coherence.
