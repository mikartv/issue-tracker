---
cycle: 15
issue: "gh #5 — enhancement: redesign Projects screen — card grid, empty + loading states"
role: γ
artifact: gamma-scaffold
---

# γ Scaffold — Cycle 15

## Selection

**Selected gap:** gh #5 — enhancement: redesign Projects screen — card grid, empty + loading states
**Decisive clause:** `cnos.cds/skills/cds/CDS.md §"Selection function" → §"Assessment-commitment default"` — cycle 14 gamma-closeout committed to the R2–R8 redesign wave as the next work; gh #5 is the first open redesign issue and the only open GitHub product issue in the queue.
**Rejected alternatives:** none — single open issue in queue after cycle 14 close.
**Dependency note:** R1 (tokens, cycle 14, `styles.scss`) shipped ✅. R2 (shell redesign) not yet cycled; the issue body declares no hard dependency for this card-grid scope — α uses R1 tokens and the existing `app.component.ts` shell frame as-is. R3 is not a hard prerequisite either (per issue body).

## Mode

`design-and-build` (small-change, 4 ACs, 1 primary file)
Dispatch config: §5.2 (δ=γ, single-session Claude Code, per cycles 13–14 precedent)

## Peer Enumeration (γ/SKILL.md §2.2a)

**Directory listing — `apps/web/src/app/projects/`:**

```
project-issues.component.spec.ts   7.7k
project-issues.component.ts        7.5k
projects-list.component.spec.ts    4.1k
projects-list.component.ts         5.8k
```

**Grep results:**

1. `rg "mat-card|mat-grid|css.*grid" apps/web/src/app/projects/ --type ts` → **no matches**.
   Card grid does not exist. This cycle introduces it.

2. `rg "MatTableModule|mat-table" apps/web/src/app/projects/ --type ts` → confirmed:
   `projects-list.component.ts:15  MatTableModule` (import)
   `projects-list.component.ts:29  MatTableModule,` (imports array)
   `projects-list.component.ts:43  <table mat-table [dataSource]="projects"...>`
   This cycle removes `MatTableModule` and the `<table mat-table>` template block.

3. Loading state: `<mat-spinner diameter="40" />` at `projects-list.component.ts:37`, inside `@if (loading)` at line 36. `MatProgressSpinnerModule` is already imported. Partially satisfies AC3 — spinner exists but is not contextualized within the redesigned card-grid layout. This cycle retains the spinner or upgrades to skeletons; the existing bare spinner already satisfies AC3 as written. α decides.

4. Empty state: `<p>No projects yet.</p>` at `projects-list.component.ts:40`. This cycle replaces it with designed empty state (icon + message + "Create project" CTA). Additive framing: the bare string exists; this cycle overwrites it.

5. `rg "#c00|#ccc" apps/web/src/app/projects/projects-list.component.ts` → confirmed:
   Line 111: `color: #c00;` (`.error` rule)
   Line 114: `color: #c00;` (`.inline-error` rule)
   Line 128: `background: #ccc;` (`.archived-badge` rule)
   All three are removed by this cycle and replaced with `var(--it-*)` tokens from R1.

6. `rg "\-\-it\-" apps/web/src/app/projects/` → **no matches**.
   R1 tokens are defined in `styles.scss` but not yet applied to this component. This cycle introduces them.

## Surfaces α Is Expected to Touch

**Primary — `apps/web/src/app/projects/projects-list.component.ts`:**
- Imports: remove `MatTableModule`; add `MatCardModule`; add `MatIconModule` (or equivalent) for empty-state icon; `MatProgressSpinnerModule` retained for AC3
- Template: replace `<table mat-table>` block with a CSS-grid card container + `mat-card` per project
- Each card: project name as `routerLink` to `/projects/:id/issues`, archived treatment (badge/dimming), Archive button with inline error, active-project gating
- Empty state (`projects.length === 0`): designed block — icon, message, "Create project" CTA that scrolls/navigates to the create form or opens it
- Loading state: spinner or skeleton during `loading === true`
- Component styles: CSS grid layout (responsive — multi-column at ≥768px, single column below); replace all three `#c00`/`#ccc` literals with `var(--it-*)` tokens; remove `displayedColumns` property (no longer needed)

**Secondary — `apps/web/src/app/projects/projects-list.component.spec.ts`:**
- Update existing empty-state test (`'AC3: shows "No projects yet."'`) to assert new empty-state selector (the bare `<p>No projects yet.</p>` will be gone)
- Add tests covering: AC1 (card element present, `<table>` absent), AC2 (designed empty state, CTA visible), AC3 (loading state renders), AC4 (actions preserved — existing tests for navigate, archive, create may suffice with minor updates)

**No changes in:** `project-issues.component.ts`, `project-issues.component.spec.ts`, `apps/api/`, `apps/web/src/styles.scss`, `app.routes.ts`, any other component.

## AC Oracle Approach

| AC | Oracle | Positive assertion | Negative assertion |
|----|----|----|----|
| AC1 — card grid | Browser at 1440px + 375px; observe DOM | `mat-card` elements present; multi-column at desktop, single column at mobile; no horizontal overflow | `<table mat-table>` element absent from projects view |
| AC2 — empty state | Load `/projects` with empty array | Designed empty-state block with "Create project" CTA visible | Bare unstyled `<p>No projects yet.</p>` absent |
| AC3 — loading state | Observe before API resolves | Spinner or skeleton visible during loading interval | No blank screen or raw text during load |
| AC4 — actions preserved | Click card name; archive a project; create a project | Navigation to `/projects/:id/issues`; archive + 409 "Already archived" error; create + reload all function as before | No regression vs current behavior |

**Test oracle:** `npm run test:web` must pass; existing 42 web tests must remain green; new AC-covering tests must pass. Expected total: 44–46 web tests.

## Expected Diff Scope

- 1 file modified: `apps/web/src/app/projects/projects-list.component.ts` (template + styles + imports)
- 1 file modified: `apps/web/src/app/projects/projects-list.component.spec.ts` (1 updated test selector + 2–4 new tests)
- Expected test delta: +2 to +4 web tests (42 → 44–46 total)
- No API changes, no routing changes, no `styles.scss` changes, no `package.json` changes
