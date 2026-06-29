---
cycle: 19
issue: "gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop"
role: γ
artifact: gamma-scaffold
dispatch-config: §5.2 (δ=γ, single-session Claude Code)
base-sha: 1e37af0be588812c24f361f040b73c2421c245b5
---

# γ Scaffold — Cycle 19

## Issue

gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop

## Mode

design-and-build — 5 ACs

## Selection

Selected under `cnos.cds/skills/cds/CDS.md §"Selection function" → §"Maximum-leverage rule"` — confirmed from cycle 18 γ close-out. All dependencies now shipped:
- R5a (free transitions + GET /projects/:id): gh #9 ✅ merged 2026-06-29
- R3 (shared chip component): cycle 17 ✅ shipped
- R1 (design tokens): cycle 14 ✅ shipped
- R2 (app shell): cycle 16 ✅ shipped

## Peer enumeration (gamma/SKILL.md §2.2a)

Directories surveyed:
- `apps/web/src/app/projects/` — 4 files: `project-issues.component.{spec.ts,ts}`, `projects-list.component.{spec.ts,ts}`
- `apps/web/src/app/api/` — 2 files: `api.service.{spec.ts,ts}`
- `apps/web/src/app/shared/` — 3 files: `chip.component.{spec.ts,ts}`, `issue-labels.ts`

Grep evidence:
```
rg "getProject" apps/web/src/app/api/api.service.ts
→ line 40: getProjects(): Observable<Project[]>  (list endpoint only; getProject(id) not present)

rg "cdkDrag|cdkDropList|DragDropModule|drag-drop|kanban|board" apps/web/src/
→ NO MATCH (confirmed: no drag-drop or board surfaces exist)
```

§Gap is additive: `getProject(id)` does not exist; Kanban board does not exist. Both confirmed by grep.

## Surfaces γ expects α to touch

1. `apps/web/src/app/projects/project-issues.component.ts` — full rewrite: replace `mat-table` with four-column `cdkDropList` Kanban board; issues as `cdkDrag` cards; drop handler calling `updateIssueStatus` with optimistic move + rollback; heading "Issues — {name}" via `getProject`; horizontal scroll on narrow viewports; inline create-issue form must remain accessible
2. `apps/web/src/app/api/api.service.ts` — add `getProject(id: string): Observable<Project>` calling `GET /projects/:id`
3. `apps/web/src/app/projects/project-issues.component.spec.ts` — rewrite: tests for board columns, drag-drop handler (success + error revert), project name heading
4. `apps/web/src/app/api/api.service.spec.ts` — add test for `getProject(id)`

Files NOT in scope: `apps/api/`, `apps/web/src/app/shared/` (chip unchanged), `apps/web/src/app/issues/`, `apps/web/src/styles.scss`

## AC oracle approach

- AC1 (four columns render): component test asserts four `cdkDropList` containers with correct column headers
- AC2 (cards with chips): component test asserts `cdkDrag` elements contain `app-chip` children and title links
- AC3 (drag to another column): component test mocks `updateIssueStatus` success, simulates `cdkDropListDropped` event, asserts card in target column
- AC4 (failed move reverts): component test mocks `updateIssueStatus` error, asserts optimistic move reverted, error surfaced
- AC5 (project name heading): component test mocks `getProject` returning `{name: 'Alpha'}`, asserts heading contains "Alpha"; asserts `GET /projects/:id` called (not list)

## Expected diff scope

- `project-issues.component.ts`: ~150–220 lines (full rewrite; new imports: `DragDropModule`, `CdkDragDrop`, `moveItemInArray`, `transferArrayItem`; new state: per-status columns, projectName; drop handler with rollback)
- `api.service.ts`: +5–7 lines (getProject method)
- `project-issues.component.spec.ts`: major update (+15–20 new tests; old mat-table tests removed)
- `api.service.spec.ts`: +5–10 lines (getProject test)

Baseline test count (from cycle 18 γ close-out): **47 web tests**. α should source this figure from this scaffold, not from a local re-count.

## Design constraint: create-issue form

The inline create-issue form in the current component may remain or be replaced with a "New Issue" stub button. Issue states: "creating issues must remain reachable." Issue non-goal: create-issue dialog is R6. α may keep the inline form or add a stub, but must not silently remove issue creation ability. The form does not need to be visible above the board; placing it below the board or collapsing it is acceptable.

## δ=γ configuration floor

§5.2 configuration — γ/δ collapse; γ-axis grade floors at A- per `release/SKILL.md §3.8`.
