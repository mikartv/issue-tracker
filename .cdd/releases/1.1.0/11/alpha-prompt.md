---
cycle: 11
role: α
artifact: alpha-prompt
---

# α Dispatch Prompt — Cycle 11

You are **α** in a CDD cycle. Your role is to implement. You do not review. You do not
coordinate. You produce matter and exit after signaling review-readiness.

## Skills (Tier 1a — load in order before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`

## Project context

- `gh issue view 1` — full contract (gap, ACs, non-goals)
- `.cdd/PROJECT.md` — verified repo map
- `.cdd/STACK.md` — pinned conventions + dispatch bindings (includes α-rules)
- `.cdd/releases/1.0.0/10/gamma-closeout.md` — last closed cycle
- `.cdd/SCOPE.md` — product boundary
- `.cdd/unreleased/11/gamma-scaffold.md` — γ scaffold (AC oracle corrections, expected diff scope)

## Branch

`cycle/11` (exists on origin)

```bash
git switch cycle/11
git pull origin cycle/11
```

## Issue

`gh issue view 1`

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript strict |
| Surfaces | `apps/web/src/app/` only — no API changes, no `app.routes.ts` changes, no `api.service.ts` changes |
| Runtime deps | Angular 17 `RouterLink` (already available, no new packages) |
| Wire contract | unchanged — no API changes |
| Backward compat | N/A |
| Branch | `cycle/11` |
| Test target | `npm run test:web` must pass; `npm run test:api` must remain green |

## AC oracle corrections (read before self-assessing)

Two AC oracles in the issue body need correction. Use the corrected forms below:

**AC2:** The issue states confirmation via `grep -r "routerLink" apps/web/src/app/issues/`.
`ProjectIssuesComponent` lives at `apps/web/src/app/projects/project-issues.component.ts`.
Use the correct oracle:
```bash
grep -r "routerLink" apps/web/src/app/projects/project-issues.component.ts
```

**AC5:** The issue states `grep -r "in_progress\|critical" apps/web/src/app/` returning zero
results. This would also match the `priorities` array in the TypeScript class body. AC5 requires
zero raw enum strings in **template display expressions** only — i.e., `{{ issue.status }}` and
`{{ issue.priority }}` must use label map lookups, not raw enum strings. The `priorities` array
for the select form field may retain raw values as internal keys.

## Implementation notes

These are orientation notes only. α determines the implementation approach; these notes avoid
predictable ambiguities.

**RouterLink** — Angular 17 standalone directive. Import `RouterLink` from `@angular/router`
and add it to the component's `imports` array. Both `ProjectsListComponent` and
`ProjectIssuesComponent` are standalone components; add `RouterLink` to each one's `imports`.

**Empty states** — Add inside the `@else` branch (after data loads). The ACs specify exact text:
"No projects yet." for AC3 and "No issues yet." for AC4.

**Label maps for AC5** — Add `statusLabels` and `priorityLabels` maps to the component class.
Replace the two raw-enum display bindings in `project-issues.component.ts` with label lookups.

**Inline errors for AC6** — Two distinct error patterns to fix:
1. Load error: `@else if (error)` currently replaces the entire view. Keep the error visible but
   alongside (or above) the table/form rather than as a full-view replacement. Show the error
   inside the `@else` branch so the form remains usable.
2. Submit error in `ProjectIssuesComponent`: `submitCreate()` currently sets `this.error` on
   failure, which feeds the top-level `@else if (error)` (replacing the whole view). Add a
   separate `createError: string | null = null` property for the create form. Show `createError`
   inline under the Create Issue button. Do not set `this.error` on submit failure.

**Tests** — Use the existing spec patterns (`HttpClientTestingModule`, `NoopAnimationsModule`,
`HttpTestingController`). For RouterLink testing in standalone components with Angular 17,
import `RouterTestingModule` from `@angular/router/testing` or provide `RouterLink` with a stub.
Add test cases for: routerLink attribute present, empty-state text, label values, inline create
error visible (not replacing whole view).

## Self-coherence

Write `.cdd/unreleased/11/self-coherence.md` when implementation is complete. Include:
- AC table with pass/fail per AC (use corrected oracle paths for AC2 and AC5)
- Note on AC7: "Manual runbook gate — not executable by α; deferred to operator"
- CDD Trace entries for each lifecycle step completed
- Any debt items

## Exit signal

When all ACs AC1–AC6 pass and `npm run test:web` is green:

1. Commit `self-coherence.md` to `cycle/11`
2. Push to `origin/cycle/11`
3. Signal review-readiness with commit message: `cdd: self-coherence review-ready (cycle 11)`

Do not merge. Do not push to main. Exit after pushing the review-ready signal.
