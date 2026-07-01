---
cycle: 20
issue: "gh #14 — fix: cdkDropListGroup bracket syntax breaks ng build (NG8002)"
role: γ
artifact: gamma-scaffold
dispatch-config: §5.2 (δ=γ)
base-sha: 89927150875cbed3b94b6fd180d7e1c88a348977
---

# γ Scaffold — Cycle 20

## Selection

**Selected gap:** gh #14 — fix `[cdkDropListGroup]` → `cdkDropListGroup` in `apps/web/src/app/projects/project-issues.component.ts:51`

**Decisive rule clause:** P0 override — `ng build` fails on main with NG8002. Build-breaking defect; no feature cycles may land until resolved.

**Rejected alternatives:**
- gh #11 (create-issue MatDialog) — eligible after P0 fix; deferred
- gh #12 (issue-detail redesign) — eligible after P0 fix; deferred

**Intervention size:** immediate-output / small-change — 2-character template fix in one file, plus `ng build` verification and test pass confirmation.

## Peer enumeration (§2.2a)

Grep confirmed: `[cdkDropListGroup]` appears exactly once in the codebase at `apps/web/src/app/projects/project-issues.component.ts:51`. No other occurrences in templates or TS files.

```
$ grep -rn 'cdkDropListGroup' apps/web/
apps/web/src/app/projects/project-issues.component.ts:51:          <div class="board" [cdkDropListGroup]>
```

Gap framing: `[cdkDropListGroup]` is a property binding on a directive selector, not an input property. Angular AOT compiler (NG8002) rejects it. Jest does not trigger AOT — the defect was undetected until `ng build` post-merge.

## Surfaces α will touch

- `apps/web/src/app/projects/project-issues.component.ts` — line 51: remove brackets from `[cdkDropListGroup]`

**Expected diff scope:** 1 file, ~1 line changed (2-char removal of `[` and `]`).

No new tests required — this is a bug fix for a known NG8002 error. Existing 61 web tests must continue to pass.

## AC oracle approach

- AC1: `cd apps/web && npx ng build --configuration=production` exits 0 with no NG8002 or other diagnostic
- AC2: `npm run test:web` (or `nx test web`) — all 61 existing tests pass, no regressions

## γ = δ collapse declaration

Dispatch config §5.2: parent session is γ (this scaffold) and δ (gate authority). α and β run as separate sub-agents with independent context.
