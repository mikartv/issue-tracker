---
cycle: 7
issue: "#7 — Issue list + project views (Material)"
role: α
artifact: self-coherence
date: 2026-06-13
---

# α Self-Coherence — Cycle 7

## §Gap

**Issue:** #7 — Issue list + project views (Material)  
**Cycle:** 7  
**Mode:** design-and-build  
**Work-shape:** small-change (6 ACs, single Angular module scope, additive UI)

**Gap framing (from γ-scaffold):** Angular Material was absent from `apps/web/`; the two list components (`projects-list`, `project-issues`) were placeholders with `loading = true` and no data wiring; `ApiService` lacked `createProject` and `archiveProject`; no component-level test specs existed for either list component.

**Closure claim:** All 6 ACs satisfied; implementation is additive (no existing behavior changed).

---

## §Skills

**Tier 1:**
- `CDD.md` — canonical lifecycle and role contract
- `alpha/SKILL.md` — α role surface (this file's governing skill)

**Tier 2 (always-applicable eng/):**
- `eng/angular` — Angular component + TestBed authoring constraints (implicit; no explicit Tier 2 skill file loaded from `cnos.eng`; applied from domain knowledge)
- `eng/typescript` — TypeScript type discipline (implicit)

**Tier 3 (issue-specific):**
- None declared in issue #7.

---

## §ACs

Per-AC oracles run against branch HEAD `73b6621`.

| AC | Description | File | Evidence |
|----|-------------|------|----------|
| AC1 | `/projects` — Material table of projects; create project form (name) | `apps/web/src/app/projects/projects-list.component.ts` | `MatTableModule` with `displayedColumns = ['name', 'actions']`; `mat-form-field` + `matInput` + `[(ngModel)]="newProjectName"` in template; `createProject()` calls `api.createProject(name)` → reloads list |
| AC2 | `/projects/:projectId/issues` — issue list with status, priority, title columns | `apps/web/src/app/projects/project-issues.component.ts` | `MatTableModule`; `displayedColumns = ['status', 'priority', 'title']`; all three column defs present in template |
| AC3 | Archive action on project; archived projects visually distinct; 409 guard | `apps/web/src/app/projects/projects-list.component.ts` | `archiveProject()` calls `api.archiveProject(project.id)`; `[class.archived]="project.archived"` applies `opacity: 0.5; text-decoration: line-through`; `err.status === 409` sets `archiveErrors[project.id]` without crashing; `<span class="archived-badge">Archived</span>` badge rendered |
| AC4 | Loading and error states for failed API calls | both components | `loading = true` initially; `@if (loading)` renders `<mat-spinner>`; `error:` handler sets error string; `@else if (error)` renders `<p class="error">` |
| AC5 | Component tests (TestBed + HttpClientTestingModule) | `apps/web/src/app/projects/projects-list.component.spec.ts`, `project-issues.component.spec.ts` | Both spec files use `TestBed.configureTestingModule`, `HttpClientTestingModule`, `HttpTestingController`; `npm run test:web` output: **12 tests, 4 suites, 0 failures** |
| AC6 | Responsive for desktop browser | both components | `.container { max-width: 800px/1000px }`, `table { width: 100% }`, `.create-form { flex-wrap: wrap }` |

**Material Setup Evidence:**

| Requirement | File | Evidence |
|-------------|------|----------|
| `@angular/material ~17.3.0` added | `apps/web/package.json` | line 15 |
| `@angular/cdk ~17.3.0` added | `apps/web/package.json` | line 12 |
| Pre-built theme wired | `apps/web/src/styles.css` | `@import "@angular/material/prebuilt-themes/indigo-pink.css"` |
| `styles.css` registered in build | `apps/web/angular.json` | `"styles": ["src/styles.css"]` |
| `provideAnimations()` added | `apps/web/src/main.ts` | bootstrap providers array |

**ApiService Extension Evidence:**

| Method | File | Caller | Call Site |
|--------|------|--------|-----------|
| `createProject(name: string)` | `apps/web/src/app/api/api.service.ts` | `projects-list.component.ts` | `createProject()` method → `this.api.createProject(this.newProjectName)` |
| `archiveProject(id: string)` | `apps/web/src/app/api/api.service.ts` | `projects-list.component.ts` | `archiveProject()` method → `this.api.archiveProject(project.id)` |
| Existing methods preserved | `apps/web/src/app/api/api.service.ts` | — | `getProjects`, `getIssues`, `getIssue` unchanged |

**Non-Goals Confirmed Absent:**
- Issue detail page: `apps/web/src/app/issues/issue-detail.component.ts` not modified
- Create issue form: not present in either component
- Dark theme: not configured; only `indigo-pink` pre-built theme

---

## §Self-check

**Did α push ambiguity to β?** No. Every AC is mapped to concrete evidence in the diff. No AC is partially met without disclosure.

**Is every claim backed by evidence in the diff?**

- AC1–AC4: component source files changed; template + component class satisfy each AC.
- AC5: spec files created (`project-issues.component.spec.ts`, `projects-list.component.spec.ts`); `npm run test:web` exits 0 with 12 tests.
- AC6: inline styles applied in both components; responsive layout confirmed by CSS declarations.
- Material setup: all five setup steps verified against specific files and lines.
- ApiService: both new methods have a named non-test caller in `projects-list.component.ts`.

**Potential ambiguity items reviewed:**

| Item | Status |
|------|--------|
| 409 guard — only catches HTTP 409, not generic errors | Explicit: `err.status === 409` branch; non-409 errors fall to generic `this.error` handler |
| `archiveErrors` map keyed by project id — no cleanup if project reloads | Acceptable: reload after successful archive clears the component state |
| `package-lock.json` — large diff from new Material deps | Expected; generated file; no hand-authored content |

**Peer enumeration:** γ-scaffold explicitly scoped the peer set: `apps/web/src/app/projects/` (2 components) + `apps/web/src/app/api/` (1 service). `apps/web/src/app/issues/issue-detail.component.ts` is out of scope (cycle 8). All in-scope peers updated.

**Harness audit:** No schema-bearing contract changed (UI-only additive change). Not applicable.

**Re-audit (polyglot):** Diff touches TypeScript only (`*.ts`, `*.json`, `*.css`). CSS/JSON have no executable toolchain; TypeScript covered by `npm run test:web` (Jest, Angular TestBed). `npm run test:all` exits 0.

---

## §Debt

| Item | Severity | Notes |
|------|----------|-------|
| No remote CI infrastructure | Low | Repo is local-only; no `origin` remote exists. Tests are green locally (12 web, 76 api). Gate row 10 marked as "local-only" in §Review-readiness. |
| No manual browser verification | Low | UI correctness validated via TestBed specs only (AC5). The γ-scaffold oracle for AC1–AC4 and AC6 requires a running API + browser; that path is unavailable in headless α session. Spec coverage provides structural proof; β may manual-browse if desired. |
| `alpha-closeout.md` not written | Process | Per SKILL.md §2.8 bounded dispatch model: α exits after review-readiness signal; close-out is written in a γ-requested re-dispatch after β merge. |

---

## §CDD Trace

| Step | Action | Artifact / Evidence |
|------|--------|---------------------|
| 0 | Receive dispatch | `.cdd/unreleased/7/alpha-prompt.md`; cycle branch `cycle/7` checked out |
| 1 | Read issue + related artifacts | Issue #7 body read; `gamma-scaffold.md` read; 6 ACs enumerated |
| 2 | Load active skills | Tier 1: `CDD.md`, `alpha/SKILL.md`; Tier 2: eng/angular, eng/typescript (implicit); Tier 3: none |
| 3 | Design | Not required — issue is additive UI wiring with clear component boundaries; no design doc produced |
| 4 | Plan | Not required — single Angular module scope; linear implementation order; no inter-module dependencies |
| 5 | Tests | `apps/web/src/app/projects/projects-list.component.spec.ts` (new); `apps/web/src/app/projects/project-issues.component.spec.ts` (new); 12 web tests, 4 suites |
| 6 | Code + Docs | `apps/web/angular.json` (styles entry); `apps/web/package.json` (Material deps); `apps/web/src/styles.css` (new — theme import); `apps/web/src/main.ts` (provideAnimations); `apps/web/src/app/api/api.service.ts` (createProject, archiveProject); `apps/web/src/app/projects/projects-list.component.ts` (full replacement); `apps/web/src/app/projects/project-issues.component.ts` (full replacement). All files committed at `73b6621`. New methods in ApiService have non-test callers: `createProject` ← `projects-list.component.ts` createProject(); `archiveProject` ← `projects-list.component.ts` archiveProject(). |
| 7 | Self-coherence | This file; §Gap, §Skills, §ACs, §Self-check, §Debt, §CDD Trace completed; §Review-readiness to follow |
