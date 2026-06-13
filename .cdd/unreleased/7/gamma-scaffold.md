---
cycle: 7
issue: "#7 — Issue list + project views (Material)"
role: γ
artifact: gamma-scaffold
date: 2026-06-13
---

# γ Scaffold — Cycle 7

## Issue

#7 — Issue list + project views (Material)  
Mode: **design-and-build**  
Work-shape: **small-change** (6 ACs, single Angular module scope, additive UI)

---

## Peer Enumeration (§2.2a)

Directories enumerated:

- `apps/web/src/app/projects/` — 2 files: `projects-list.component.ts`, `project-issues.component.ts`
- `apps/web/src/app/api/` — 2 files: `api.service.ts`, `api.service.spec.ts`
- `apps/web/src/app/issues/` — 1 file: `issue-detail.component.ts`

grep checks:

| Check | Command | Result |
|-------|---------|--------|
| Angular Material installed | `rg "@angular/material" apps/web/package.json` | **no matches** — not in dependencies |
| Material imports in components | `rg "MatTable\|MatList\|MatButton" apps/web/src/` | **no matches** — no Material used |
| ApiService create/archive | `rg "createProject\|archiveProject" apps/web/src/` | **no matches** — methods absent from `ApiService` |
| Existing component tests | `rg "HttpClientTestingModule" apps/web/src/` | **no matches** — no spec files for list components |

Gap framing: Angular Material does not yet exist in `apps/web/`; the two list components are placeholders with `loading = true` and no data wiring; `ApiService` has `getProjects` and `getIssues` but lacks `createProject` and `archiveProject`; no component-level test specs exist for either list component.

---

## Surfaces γ Expects α to Touch

| Surface | File | Action |
|---------|------|--------|
| Package manifest | `apps/web/package.json` | Add `@angular/material ~17.x` and `@angular/cdk ~17.x` to dependencies |
| Material theme | `apps/web/src/index.html` or `apps/web/src/styles.css` | Import one pre-built Material theme (e.g. `indigo-pink`) |
| API client | `apps/web/src/app/api/api.service.ts` | Add `createProject(name: string)` (POST /projects) and `archiveProject(id: string)` (POST /projects/:id/archive) |
| Projects list component | `apps/web/src/app/projects/projects-list.component.ts` | Replace placeholder: Material table or list of projects, create-project form (name field), archive action, archived-project visual distinction, 409 guard, loading + error states |
| Project issues component | `apps/web/src/app/projects/project-issues.component.ts` | Replace placeholder: Material table with status, priority, title columns, loading + error states |
| Projects list tests | `apps/web/src/app/projects/projects-list.component.spec.ts` | New file — TestBed + HttpClientTestingModule; cover list render, create-project, archive, error state |
| Project issues tests | `apps/web/src/app/projects/project-issues.component.spec.ts` | New file — TestBed + HttpClientTestingModule; cover table render and error state |

Out of scope this cycle: `apps/api/` (no backend changes), `apps/web/src/app/issues/` (issue-detail is cycle 8), `app.routes.ts` (routes already correct from cycle 6).

---

## AC Oracle Approach

| AC | Verification approach |
|----|----------------------|
| AC1 | Manual browse `/projects` against running API; project names appear in list/table; create-project form submits → list refreshes with new project |
| AC2 | Navigate to `/projects/:id/issues`; table rows show status, priority, title columns |
| AC3 | Click archive on a live project; project appears visually distinct (greyed/badge); clicking archive again → 409 handled → no crash, error message shown |
| AC4 | Stop API server (`Ctrl-C dev:api`); browse `/projects` → loading state appears, then error message; same on issue list route |
| AC5 | `npm run test:web` exits 0; spec files for both list components present and run |
| AC6 | Manual check at desktop viewport (≥1024px); no horizontal scroll; table columns readable |

---

## Expected Diff Scope

| File | Change type | Size estimate |
|------|------------|---------------|
| `apps/web/package.json` | dep additions | ~4 lines |
| `apps/web/src/index.html` or `styles.css` | theme import | 1–2 lines |
| `apps/web/src/app/api/api.service.ts` | method additions | ~15–20 lines |
| `apps/web/src/app/projects/projects-list.component.ts` | full replacement | ~120–160 lines |
| `apps/web/src/app/projects/project-issues.component.ts` | full replacement | ~70–90 lines |
| `apps/web/src/app/projects/projects-list.component.spec.ts` | new file | ~70–90 lines |
| `apps/web/src/app/projects/project-issues.component.spec.ts` | new file | ~50–70 lines |

No route changes. No `apps/api/` changes. `issue-detail.component.ts` untouched.
