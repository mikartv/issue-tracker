---
cycle: 10
role: β
artifact: beta-prompt
---

# β Dispatch Prompt — Cycle 10

Role: β ONLY. Fresh session.

Branch: cycle/10
Issue: Read `.cdd/issues/10/ISSUE.md` from repo root (full contract: gap, AC, non-goals).
Scaffold: Read `.cdd/unreleased/10/gamma-scaffold.md` (surface map, AC oracle, expected diff scope).
Self-coherence: Read `.cdd/unreleased/10/self-coherence.md` (α's implementation record, debt, review-readiness signal).
Stack: Read `.cdd/STACK.md` (pinned versions; governs decorator conventions, script names).
Scope: Read `.cdd/SCOPE.md` (Definition of Done; the authority for AC1–AC3 and AC5).

## Task

Review α's implementation of issue #10 on branch `cycle/10`.

For each AC, run an **independent oracle pass** — do not take α's self-coherence claims at face value; verify against code and artifacts directly.

**AC1 — README prerequisites and scripts**
Read `README.md`. Confirm the following are explicitly documented: Node 20, Docker, `npm run dev:db`, `npm run dev:api`, `npm run dev:web`, `npm run test:all`. All 6 items present → pass. Note any that are missing, ambiguous, or incorrect.

**AC2 — `npm run test:all` passes**
Confirm `npm run test:all` can be invoked from repo root with all suites passing. Verify α recorded actual test counts in `self-coherence.md`. If counts differ from prior cycle records, note whether the delta is explained.

**AC3 — Smoke script or checklist**
Read `docs/SMOKE.md`. Confirm it covers the full path: create project → create issue on project → add comment → advance status through `open → in_progress → done → closed`. Every step must be operator-runnable without chat context. If a supertest spec was chosen instead, confirm it covers the same path end-to-end. Gap in path coverage or a step that assumes prior context → RC finding.

**AC4 — Swagger covers all v1 endpoints**
Grep `@ApiTags` and `@ApiResponse` across controller files (`health`, `projects`, `issues`, `comments`). Cross-check against the route count per module. Confirm no existing v1 route is undocumented. Decorator present on every route → pass.

**AC5 — No open contradictions**
Read `.cdd/SCOPE.md` and `.cdd/STACK.md`; read current code. Verify that α's contradiction list in `self-coherence.md` is complete and every item is either resolved or explicitly documented with reason. Contradictions α missed → RC finding.

**AC6 — PROJECT.md claims verified**
Read `.cdd/PROJECT.md`. Verify: test counts match `npm run test:all` output, web component map includes all files under `apps/web/src/app/`, Angular routes match `app.routes.ts`, cycle 6–9 decisions are recorded. Any `✅ verified` claim that does not match current code → RC finding.

**Protocol gate**
Verify `gamma-scaffold.md` exists on `cycle/10` at `.cdd/unreleased/10/gamma-scaffold.md` (rule 3.11b). Absent and no `## Protocol exemption` in the issue body → D-severity finding.

## Output

Write `.cdd/unreleased/10/beta-review.md` to branch `cycle/10` as `Beta <beta@issue-tracker.cdd.cnos>`.

Use the standard format:
- Verdict: APPROVED or REQUEST CHANGES
- Findings table (finding ID, severity, AC, description, evidence, resolution)
- AC table (AC1–AC6: pass / fail / partial, evidence, notes)

If REQUEST CHANGES: state exactly what α must fix before re-review. Do not merge.
If APPROVED: state so explicitly and confirm all 6 ACs pass.
