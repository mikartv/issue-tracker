# CHANGELOG — issue-tracker

## Release Coherence Ledger

| Version | C_Σ | α | β | γ | Level | Rounds | Coherence note |
|---------|-----|---|---|---|-------|--------|----------------|
| 1.0.0 | B+ | B+ | B+ | B | L6 | 15 | First vertical slice: API + SPA; honest-claim pattern C1–C4; navigation gap (P0) at release |
| 1.1.0 | A | A | A | A- | L5 | 1+1+1 | Navigation + enum labels + root redirect: all v1.0.0 known issues closed |
| 1.2.0 | A | A | A | A- | L6 | 1 | Design-system foundation: Material M2 theme + 17-token CSS custom-property layer |
| 1.3.0 | A- | B+ | A | A- | L5 | 2 | Projects screen redesigned: card grid + empty/loading states; honest-claim §Diff scope (F-1) caught R1 |
| 1.4.0 | A- | B+ | A | A- | L5 | 2 | App shell added: persistent toolbar, brand router-link, responsive content frame; F-1/F-2 (shared root: branch not rebased before signal) caught R1 |

**Scoring notes:**
- v1.0.0 γ: scope omission (navigation ACs not required for UI cycles → P0 at release) caps at B; §5.2 A- ceiling does not lift below-ceiling grades.
- v1.0.0 α/β: honest-claim pattern cycles 1–4 (all caught R1); C10 loaded-skill miss (3 rounds). All ACs met every cycle → B+ aggregate.
- v1.1.0 γ: §5.2 (δ=γ) configuration-floor clause caps at A- per `release/SKILL.md §3.8`.
- v1.1.0 α/β: 0 findings across all 3 cycles, 1 review round each → A.
- v1.2.0 γ: §5.2 cap → A-. α/β: 0 findings, 1 round, design-and-build mode → A.
- v1.3.0 γ: §5.2 cap → A-. α: 1 honest-claim finding (§Diff scope mismatch, B severity) → B+. β: finding caught R1, verified R2 → A.
- v1.4.0 γ: §5.2 cap → A-. α: 2 findings (F-1 D protocol-compliance, F-2 B honest-claim) sharing one root cause; implementation substantively clean; 2 rounds → B+. β: both findings caught R1, shared root cause identified, R2 targeted → A.
- C_Σ is the geometric mean of α/β/γ numeric grades (A=4.0, A-=3.7, B+=3.3, B=3.0).

---

## v1.4.0 — 2026-06-24

### Added
- Persistent `<mat-toolbar>` on all routes with token-based surface background and shadow — cycle 16 (#6)
- Brand "Issue Tracker" as `routerLink="/projects"` anchor (Angular router; no full-page reload) — cycle 16 (#6)
- Responsive content frame: `<router-outlet>` wrapped in `.app-content` container (`max-width: 1000px; margin: 0 auto; padding: 0 var(--it-space-4)`) — cycle 16 (#6)

---

## v1.3.0 — 2026-06-24

### Changed
- Projects screen redesigned from `<table mat-table>` to a responsive `<mat-card>` grid with `repeat(auto-fill, minmax(280px, 1fr))` — cycle 15 (#5)
- Designed empty state (icon + "No projects yet" + "Create project" CTA) replaces bare `<p>No projects yet.</p>` — cycle 15 (#5)
- 3 hardcoded color literals (`#c00`, `#ccc`) replaced with R1 design tokens; 10 `var(--it-*)` applications — cycle 15 (#5)

---

## v1.2.0 — 2026-06-22

### Added
- Angular Material M2 theme (`mat.define-light-theme`, deep-purple/amber palette) replacing `styles.css` — cycle 14 (#4)
- 17-token CSS custom-property layer (`--it-status-*`, `--it-priority-*`, `--it-space-*`, `--it-radius-*`, `--it-shadow-*`, `--it-surface`, `--it-background`) — cycle 14 (#4)
- Global `box-sizing: border-box` reset — cycle 14 (#4)

---

## v1.1.0 — 2026-06-19

### Fixed
- Blank page at root URL `/` — root redirect `'' → 'projects'` added to `app.routes.ts` — cycle 13 (#3)
- Raw enum values in `IssueDetailComponent` status, priority, "Move to" button — cycle 12 (#2)
- Raw enum values in `ProjectIssuesComponent` issue list display — cycle 11 (#1)
- Full-page hide on create-form error — inline `createError` replaces `@else if (error)` — cycle 11 (#1)

### Added
- routerLink on project rows → `/projects/:id/issues` — cycle 11 (#1)
- routerLink on issue rows → `/issues/:id` — cycle 11 (#1)
- Empty-state text ("No projects yet." / "No issues yet.") — cycle 11 (#1)

---

## v1.0.0 — 2026-06-16

First release. Projects API, Issues API, Comments API (NestJS 10) + Angular 17 SPA
(Angular Material). 109 tests (76 api + 33 web). Delivered across 10 CDD cycles.

### Added
- Projects API: create, list, rename, archive (`/api/v1/projects`)
- Issues API: create, list-by-project, get, patch, status-transitions (`open→in_progress→done→closed`)
- Comments API: create, list per issue
- Angular SPA: ProjectsList, ProjectIssues, IssueDetail views with Angular Material
- PostgreSQL 16 via Docker Compose + TypeORM migrations
- Swagger docs at `/api/docs`
- GitHub Actions CI: api job (Postgres service container) + web job on Node 20
- `docs/SMOKE.md`: operator-runnable manual smoke checklist
