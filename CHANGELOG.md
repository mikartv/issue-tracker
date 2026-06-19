# CHANGELOG — issue-tracker

## Release Coherence Ledger

| Version | C_Σ | α | β | γ | Level | Rounds | Coherence note |
|---------|-----|---|---|---|-------|--------|----------------|
| 1.0.0 | B+ | B+ | B+ | B | L6 | 15 | First vertical slice: API + SPA; honest-claim pattern C1–C4; navigation gap (P0) at release |
| 1.1.0 | A | A | A | A- | L5 | 1+1+1 | Navigation + enum labels + root redirect: all v1.0.0 known issues closed |

**Scoring notes:**
- v1.0.0 γ: scope omission (navigation ACs not required for UI cycles → P0 at release) caps at B; §5.2 A- ceiling does not lift below-ceiling grades.
- v1.0.0 α/β: honest-claim pattern cycles 1–4 (all caught R1); C10 loaded-skill miss (3 rounds). All ACs met every cycle → B+ aggregate.
- v1.1.0 γ: §5.2 (δ=γ) configuration-floor clause caps at A- per `release/SKILL.md §3.8`.
- v1.1.0 α/β: 0 findings across all 3 cycles, 1 review round each → A.
- C_Σ is the geometric mean of α/β/γ numeric grades (A=4.0, A-=3.7, B+=3.3, B=3.0).

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
