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
