---
cycle: 19
issue: "gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop"
role: α
artifact: self-coherence
base-sha: 26b609a
---

# Self-Coherence — Cycle 19

## §Gap

**Issue:** gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop
**Mode:** design-and-build — 5 ACs
**Version:** cycle 19; base SHA 26b609a (γ scaffold commit on cycle/19)

What was absent before this cycle (grep evidence from γ scaffold confirmed):

```
rg "getProject" apps/web/src/app/api/api.service.ts
→ line 40: getProjects(): Observable<Project[]>  (list only; getProject(id) not present)

rg "cdkDrag|cdkDropList|DragDropModule|drag-drop|kanban|board" apps/web/src/
→ NO MATCH (no drag-drop or board surfaces existed)
```

`getProject(id)` did not exist in `api.service.ts`. The `ProjectIssuesComponent` rendered a flat `mat-table` with no drag-and-drop, no board columns, no project name in heading. Both absences confirmed by γ scaffold grep evidence (`.cdd/unreleased/19/gamma-scaffold.md` §Peer enumeration).

## §Status truth

What this cycle ships:

- `apps/web/src/app/api/api.service.ts` — added `getProject(id: string): Observable<Project>` calling `GET /projects/:id`
- `apps/web/src/app/projects/project-issues.component.ts` — full rewrite: `mat-table` replaced by four-column `cdkDropList` Kanban board; issues as `cdkDrag` cards (title link + priority chip + assignee); drop handler with optimistic move + rollback on error; heading "Issues — {name}" via `getProject`; horizontal scroll; inline create-issue form retained
- `apps/web/src/app/projects/project-issues.component.spec.ts` — rewritten: 21 tests covering AC1–AC5 plus retained create-issue tests
- `apps/web/src/app/api/api.service.spec.ts` — 1 new test for `getProject(id)`

## §Implementation plan

Ordered steps as executed:

1. Load all context: SKILL.md (Tier 1a), `gh issue view 10`, PROJECT.md, STACK.md, gamma-scaffold.md
2. Session start: `git fetch origin && git switch cycle/19 && git rebase origin/main`; set git identity (`alpha@issue-tracker.cdd.cnos`)
3. Read existing files: `api.service.ts`, `api.service.spec.ts`, `project-issues.component.ts`, `project-issues.component.spec.ts`, `chip.component.ts`
4. Add `getProject(id)` to `api.service.ts`
5. Rewrite `project-issues.component.ts`: four-column Kanban board with `DragDropModule`, `cdkDropList`/`cdkDrag`, drop handler, `getProject` call for heading
6. Rewrite `project-issues.component.spec.ts`: AC1–AC5 tests + retained create-issue tests
7. Add `getProject` test to `api.service.spec.ts`
8. Run `npm run test:web` — 61/61 pass
9. Commit implementation (1bd0b00)
10. Write self-coherence.md incrementally (this file)
