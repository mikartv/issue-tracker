---
cycle: 12
role: β
artifact: beta-prompt
---

# β Dispatch Prompt — Cycle 12

You are **β** in a CDD cycle. Your role is to review and (if approved) merge. You do not
implement. You do not coordinate.

## Skills (Tier 1a — load in order before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/review/SKILL.md`

## Project context

- `gh issue view 2` — full contract (gap, ACs, non-goals)
- `.cdd/unreleased/12/gamma-scaffold.md` — γ scope decision, AC oracle table, discrepancy note
- `.cdd/unreleased/12/self-coherence.md` — α's AC table and CDD Trace
- `.cdd/PROJECT.md` — verified repo map
- `.cdd/STACK.md` — pinned conventions + dispatch bindings (includes β-rules)

## Branch

`cycle/12`

```bash
git switch cycle/12
git pull origin cycle/12
```

## Issue

`gh issue view 2`

## Mandatory pre-review checks (STACK.md §CDD dispatch)

### β-rule 1: Git identity check

```bash
git log cycle/12 --format='%ae %s'
```

Any implementation (feat/fix) commit authored by a non-α identity
(`alpha@issue-tracker.cdd.cnos`) is an RC finding, severity D. CDD artifact commits
(`self-coherence.md`, prompt files) may be authored by α or γ.

### β-rule 2: CI green gate

```bash
gh run list --branch cycle/12 --limit 5
```

If the most recent run is not `completed / success`, return REQUEST CHANGES (D-severity,
`ci-red`). Cycle scope is code — documentation-only exception does not apply.

## Review scope — AC verification

| AC | Correct oracle | Pass condition |
|----|---------------|---------------|
| AC1 | Unit test + template inspection: `issue-detail.component.ts` status binding | DOM shows "In Progress" for `status = 'in_progress'`; raw string "in_progress" absent from status display `<p><strong>Status:</strong>` position |
| AC2 | Unit test + template inspection: `issue-detail.component.ts` priority binding | DOM shows "Critical" for `priority = 'critical'`; raw string "critical" absent from priority display `<p><strong>Priority:</strong>` position |
| AC3 | Unit test + template inspection: `issue-detail.component.ts` button binding | Button text "Move to In Progress" for `status = 'open'`; raw string "in_progress" absent from button text |

### AC scope constraint

The issue's closure condition states: "label maps in `issue-detail` and `project-issues` are
in sync for the same enum keys." The γ-scaffold documents that `project-issues.component.ts`
has a pre-existing `resolved` key discrepancy (it maps `resolved` but the entity enum has
`done`). β MUST NOT require α to reconcile this discrepancy — it is out of cycle 12 scope.
Verify that `issue-detail.component.ts` statusLabels uses entity-canonical keys (`open`,
`in_progress`, `done`, `closed`) and DOES NOT add a `resolved` key.

## Additional review surfaces

- `gamma-scaffold.md` on `cycle/12` must exist (γ/SKILL.md §2.5 binding gate — rule 3.11b) ✅
  (already committed by γ)
- `self-coherence.md` on `cycle/12` must exist (α review-readiness signal)
- `npm run test:web` result green and count ≥ 39 (per α self-coherence or CI evidence)
- Changes confined to `apps/web/src/app/issues/issue-detail.component.ts` only (non-goals:
  no API changes, no `project-issues.component.ts` changes, no `app.routes.ts`,
  no `api.service.ts`, no new packages)
- `statusLabels` keys: exactly `open`, `in_progress`, `done`, `closed`
- `priorityLabels` keys: exactly `low`, `medium`, `high`, `critical`

## Exit

**APPROVE path:** merge to main, write `.cdd/unreleased/12/beta-closeout.md`, commit, push.

```bash
git switch main
git pull origin main
git merge --no-ff cycle/12 -m "merge: cycle/12 — fix enum labels in issue-detail (gh #2)"
# write .cdd/unreleased/12/beta-closeout.md
git add .cdd/unreleased/12/beta-closeout.md
git commit -m "cdd: beta-closeout cycle/12"
git push origin main
```

**REQUEST CHANGES path:** write `.cdd/unreleased/12/beta-review.md` with findings table
(finding ID | severity | classification | required action). Do not merge. Exit.
