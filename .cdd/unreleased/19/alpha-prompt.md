# α Dispatch Prompt — Cycle 19

You are α (implementer). Project: issue-tracker.
Dispatch config: §5.2 (δ=γ, single-session Claude Code).

## Load order (mandatory, in this exact order)

1. **Tier 1a — load before any other step** (hard generation constraints):
   - `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`

2. **Project context** (read before implementation):
   - `gh issue view 10` — full contract (gap, ACs, non-goals, proof plan)
   - `.cdd/PROJECT.md` — verified repo map
   - `.cdd/STACK.md` — pinned conventions
   - `.cdd/unreleased/19/gamma-scaffold.md` — γ decisions, affected surfaces, scope

## Session start (mandatory — run before anything else)

```bash
git fetch origin
git switch cycle/19
git rebase origin/main
```

This ensures γ-authored artifacts (including this scaffold) are in your working tree.

## Branch

`cycle/19` (already exists on `origin`)

## Issue

`gh issue view 10` — enhancement: Kanban board view for project issues with cdk drag-and-drop

## What to build

Full specification is in the issue body. Summary:

**1. `apps/web/src/app/api/api.service.ts`**

Add method:
```typescript
getProject(id: string): Observable<Project> {
  return this.http.get<Project>(`${this.base}/projects/${id}`);
}
```

**2. `apps/web/src/app/projects/project-issues.component.ts`**

Replace the `mat-table` with a four-column Kanban board:
- One `cdkDropList` per `IssueStatus` value (`open` | `in_progress` | `done` | `closed`)
- Columns connected via `cdkDropListConnectedTo`
- Column header: status label via `app-chip` (kind='status') + count badge
- Issues as `cdkDrag` cards:
  - Title as `<a [routerLink]="['/issues', issue.id]">` link
  - Priority chip via `<app-chip [kind]="'priority'" [value]="issue.priority">`
  - Assignee (show if non-null)
- Drop handler logic:
  - Call `api.updateIssueStatus(issue.id, targetStatus)` immediately (optimistic)
  - On success: leave card in target column
  - On non-2xx error: revert card to origin column; surface error message (inline message acceptable; R8 toast if available but not required)
- Heading: `"Issues — {{ projectName }}"` loaded via `getProject`; show `"Issues"` fallback while loading
- Horizontal scroll on narrow viewports: board columns scroll horizontally; no body overflow
- The inline create-issue form must remain accessible (keep or replace with a button stub)

**3. `apps/web/src/app/projects/project-issues.component.spec.ts`**

Write tests covering:
- AC1: four column headings render (one per `IssueStatus`)
- AC2: issue cards contain title link + priority chip
- AC3: drop to different column calls `updateIssueStatus`; card stays in target column
- AC4: on `updateIssueStatus` error, card reverts to origin column
- AC5: `getProject` called with correct id; heading shows project name

**4. `apps/web/src/app/api/api.service.spec.ts`**

Add test: `getProject(id)` calls `GET /projects/:id` and returns `Project`.

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript strict |
| CLI integration target | N/A |
| Package scoping | `apps/web/` only — no changes to `apps/api/` |
| Existing-binary disposition | N/A |
| Runtime dependencies | `@angular/cdk ~17.3.0` (already in `apps/web/package.json`) |
| JSON/wire contract preservation | `POST /issues/:id/status` shape unchanged; `GET /projects/:id` is a new client call only (no API changes) |
| Backward-compat invariant | createIssue form must remain reachable from `/projects/:id/issues` |

## Non-goals (do not implement)

- Create-issue dialog (that is R6 — keep inline form or add a button stub, but do not implement the dialog)
- Within-column card ordering / rank persistence
- Realtime sync, websockets
- Column configuration / custom statuses

## Self-coherence

Write `.cdd/unreleased/19/self-coherence.md` on `cycle/19`. Required sections:

- **§Gap** — what was absent before this cycle (cite grep evidence from scaffold: `getProject` not in api.service.ts; cdkDrag/cdkDropList not in apps/web/src/)
- **§Status truth** — what ships (board, getProject, updated tests)
- **§Implementation plan** — ordered steps as executed
- **§AC evidence** — for each AC1–AC5: test name(s) that cover it; pass/fail
- **§Diff scope** — list of files changed
- **§Transient rows** — CI status on `cycle/19` at time of review-readiness signal
- **§Debt** — any known gaps

Source the **pre-cycle test baseline** from this scaffold: **47 web tests** (confirmed in cycle 18 γ close-out).

## Pre-review gate

```bash
npm run test:web
```

All web tests must pass before signaling review-readiness. Document the final count in self-coherence.md §Transient rows.

## Git identity

```bash
git config user.email "alpha@issue-tracker.cdd.cnos"
git config user.name "alpha"
```

Set before any commits.

## Completion signal

Commit self-coherence.md and push `cycle/19`. That push is the review-readiness signal.
