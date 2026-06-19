---
cycle: 13
issue: "gh #3 — bug: no root route — app shows blank page at /"
role: γ
artifact: gamma-scaffold
---

# γ Scaffold — Cycle 13

## Issue

**gh #3** — bug: no root route — app shows blank page at /
Mode: design-and-build (small-change)
Priority: P1 — blank page at root URL; first-time user and bookmark/link failure

## Selection

Selected under `cnos.cds/skills/cds/CDS.md` §"Selection function": no P0 override; no
operational-infrastructure override. gh #3 is the only open actionable bug (gh #2 fix
shipped at 1.1.0; any remaining open state is an operator-action artifact, not an
outstanding fix). Decisive clause: P1 bug, maximum-leverage rule — 1-line fix removes a
critical UX gap (root URL blank page) with zero risk to existing routes.

## Peer Enumeration (γ/SKILL.md §2.2a)

**Directories scanned:** `apps/web/src/app/`

```bash
rg "redirectTo|path: ''" apps/web/src/
```

Result: **no matches** — gap confirmed. No empty-path redirect exists in any web source file.

**Current routes in `apps/web/src/app/app.routes.ts`:**
```typescript
{ path: 'projects', component: ProjectsListComponent },
{ path: 'projects/:projectId/issues', component: ProjectIssuesComponent },
{ path: 'issues/:issueId', component: IssueDetailComponent },
```

Empty-path entry absent — additive framing: this cycle adds the missing entry.

## Surfaces α Will Touch

**One file only:** `apps/web/src/app/app.routes.ts`

Change required:
1. Add `{ path: '', redirectTo: 'projects', pathMatch: 'full' }` as the **first** entry in the `routes` array.

**No changes to:**
- Any component file
- Any spec file (no new test required; manual smoke per proof plan Known Gap)
- Any API file, migration, `api.service.ts`, or `app.routes.ts` route entries
- `apps/api/` directory

## AC Oracle Table

| AC | Oracle | Pass condition |
|----|--------|----------------|
| AC1 | Manual smoke: open `http://localhost:4200/` | Final URL = `/projects`; `ProjectsListComponent` renders; blank page absent |

No automated test required per proof plan Known Gap. Optional: Angular router unit test
using `provideRouter(routes)` + `Router.navigate([''])` → assert URL = `/projects`.
If α adds a test, it targets `app.component.spec.ts` or a new `app.routes.spec.ts`; test
count moves from 42 → 43.

## Expected Diff Scope

- Files changed: 1 (`apps/web/src/app/app.routes.ts`)
- Lines added: 1
- New files: 0
- Test count: 42 web (unchanged — no new test required; stays at 42 if α skips optional test)
- CI impact: `npm run test:web` only; `npm run test:api` unaffected

## Dispatch Configuration

§5.2 (δ=γ, single-session Claude Code). Cycle is small-change (1 file, 1 line, 1 AC);
§5.1 escalation criteria not met (< 7 ACs, no new contract surface, ≤ 1 β round expected,
≤ 1 γ judgment call expected).
