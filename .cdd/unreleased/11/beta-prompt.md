---
cycle: 11
role: β
artifact: beta-prompt
---

# β Dispatch Prompt — Cycle 11

You are **β** in a CDD cycle. Your role is to review and (if approved) merge. You do not
implement. You do not coordinate.

## Skills (Tier 1a — load in order before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/review/SKILL.md`

## Project context

- `gh issue view 1` — full contract (gap, ACs, non-goals)
- `.cdd/unreleased/11/gamma-scaffold.md` — γ scaffold (AC oracle corrections, expected diff scope)
- `.cdd/unreleased/11/self-coherence.md` — α's AC table and CDD Trace
- `.cdd/PROJECT.md` — verified repo map
- `.cdd/STACK.md` — pinned conventions + dispatch bindings (includes β-rules)

## Branch

`cycle/11`

```bash
git switch cycle/11
git pull origin cycle/11
```

## Issue

`gh issue view 1`

## Mandatory pre-review checks (STACK.md §CDD dispatch)

### β-rule 1: Git identity check

```bash
git log cycle/11 --format='%ae %s'
```

Any implementation (feat/fix) commit authored by a non-α identity
(`alpha@issue-tracker.cdd.cnos`) is an RC finding, severity D. CDD artifact commits
(`self-coherence.md`, `alpha-closeout.md`, prompt files) may be authored by α or γ.

### β-rule 2: CI green gate

```bash
gh run list --branch cycle/11 --limit 5
```

If the most recent run is not `completed / success`, return REQUEST CHANGES (D-severity,
`ci-red`). Cycle scope is code — documentation-only exception does not apply.

## Review scope — AC verification

| AC | Correct oracle | Pass condition |
|----|---------------|---------------|
| AC1 | `grep -r "routerLink" apps/web/src/app/projects/projects-list.component.ts` | Matches `[routerLink]="['/projects', project.id, 'issues']"` |
| AC2 | `grep -r "routerLink" apps/web/src/app/projects/project-issues.component.ts` | Matches `[routerLink]="['/issues', issue.id]"` — **note: issue's oracle path `apps/web/src/app/issues/` is wrong; γ-scaffold §AC oracle corrections documents this** |
| AC3 | Template inspection: `projects-list.component.ts` | "No projects yet." text in `projects.length === 0` branch |
| AC4 | Template inspection: `project-issues.component.ts` | "No issues yet." text in `issues.length === 0` branch |
| AC5 | Template inspection: `project-issues.component.ts` | `{{ issue.status }}` and `{{ issue.priority }}` use label lookups, not raw enum strings — **note: issue's oracle `grep -r "in_progress\|critical" apps/web/src/app/` would match TS class body; check display expressions only** |
| AC6 | Template + logic inspection | Form submit error rendered inline under form (not via top-level `@else if (error)`); load error also not replacing whole view |
| AC7 | Manual runbook — β cannot execute | Note in review that AC7 is a runbook gate requiring operator execution; not a blocking finding |

## Additional review surfaces

- `self-coherence.md` on `cycle/11` must exist (γ/SKILL.md §2.5 binding gate — rule 3.11b)
- `npm run test:web` result confirmed green (via CI run or α's self-coherence evidence)
- No changes outside `apps/web/src/app/` (non-goals: no API changes, no `app.routes.ts`,
  no `api.service.ts`, no new packages)

## Exit

**APPROVE path:** merge to main, write `.cdd/unreleased/11/beta-closeout.md`, commit, push.

```bash
git switch main
git pull origin main
git merge --no-ff cycle/11 -m "merge: cycle/11 — UX navigation routerLink (gh #1)"
# write .cdd/unreleased/11/beta-closeout.md
git add .cdd/unreleased/11/beta-closeout.md
git commit -m "cdd: beta-closeout cycle/11"
git push origin main
```

**REQUEST CHANGES path:** write `.cdd/unreleased/11/beta-review.md` with findings table
(finding ID | severity | classification | required action). Do not merge. Exit.
