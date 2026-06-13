# β Dispatch Prompt — Cycle 7

Activate as cn-sigma. Role: β ONLY.  
Hub (skill source): ../cn-sigma  
Working directory: /home/mihail/Projects/usurobor/issue-tracker  
Branch: cycle/7

Issue: Read `.cdd/issues/7/ISSUE.md` from repo root (full contract: gap, ACs, non-goals).  
Scaffold: Read `.cdd/unreleased/7/gamma-scaffold.md` — surfaces, oracle, expected diff scope.  
Self-coherence: Read `.cdd/unreleased/7/self-coherence.md` — α's AC-to-evidence map, gap declaration, pre-review gate rows.  
Project map: Read `.cdd/PROJECT.md`.  
Stack: Read `.cdd/STACK.md`.

---

## Implementation contract to verify

| Axis | Pinned value |
|------|--------------|
| Language | TypeScript strict |
| CLI integration target | N/A |
| Package scoping | `apps/web/` only; no `apps/api/` changes |
| Existing-binary disposition | Additive; placeholders replaced; no existing routes removed |
| Runtime dependencies | `@angular/material ~17.x`, `@angular/cdk ~17.x` added; Angular 17 preserved |
| JSON/wire contract preservation | `Project` and `Issue` interfaces in `ApiService` unchanged |
| Backward-compat invariant | `app.routes.ts` unchanged; existing components outside `apps/web/src/app/projects/` untouched |

---

## Instructions

1. Load β/SKILL.md and review/SKILL.md from the hub before acting.
2. Read the issue, scaffold, self-coherence, PROJECT.md, and STACK.md as listed above.
3. Verify each AC against the diff. Use `self-coherence.md` as the AC-to-evidence map.
4. Verify the γ scaffold is present on the branch (`gamma-scaffold.md` exists) — rule 3.11b.
5. Verify the implementation contract (all 7 axes) against the diff.
6. Run `npm run test:web` and `npm run test:all`; report exit codes.
7. Confirm no non-goals were implemented (no issue-detail changes, no create-issue form, no dark theme).
8. Confirm Angular Material was added correctly: `@angular/material` and `@angular/cdk` in `apps/web/package.json`; theme wired; no Material imports outside `apps/web/src/app/projects/`.
9. Confirm archived-project visual treatment is consistent and present.
10. Confirm 409 handling on archive-again: no crash, error message shown.
11. Produce `.cdd/unreleased/7/beta-review.md` with your verdict (APPROVED / REQUEST CHANGES) and findings table.
