# Project MCP — issue-tracker

**Last verified:** 2026-06-19 (cycle 13 — root redirect fix; `npm run test:all` 118 tests pass: 76 api + 42 web)  
**Verify with:** `npm run test:all` (from repo root)

## Build / run / test

| Command | Purpose | Status |
|---------|---------|--------|
| `npm install` | Install all workspace deps | ✅ verified |
| `npm run dev:db` | Start Postgres 16 via Docker (`docker compose up -d db`) | ✅ configured |
| `npm run dev:api` | NestJS via ts-node (`ts-node -r tsconfig-paths/register src/main.ts`) — no auto-reload | ✅ configured |
| `npm run dev:web` | Angular dev server (`ng serve`) | ✅ configured |
| `npm run test:all` | api + web test suites | ✅ `118 tests passed` (cycle 13: 76 api + 42 web) |
| `npm run test:api` | API tests only (Jest) | ✅ `76 tests passed` (9 suites) |
| `npm run test:web` | Web tests only (Jest via jest-preset-angular) | ✅ `42 tests passed` (5 suites) |

Sample output from `npm run test:all` (cycle 13):
```
Test Suites: 9 passed, 9 total (api)
Tests:       76 passed, 76 total (api)
Test Suites: 5 passed, 5 total (web)
Tests:       42 passed, 42 total (web)
```

## Repo map

| Path | Role |
|------|------|
| `apps/api/` | NestJS REST API (`/api/v1`, Swagger at `/api/docs`) |
| `apps/api/src/health/` | Health check endpoint (`GET /api/v1/health`) |
| `apps/api/src/middleware/` | `UserEmailMiddleware` — sets `req.userEmail` from `X-User-Email` header |
| `apps/api/src/projects/` | Projects module: create, list, rename, archive (cycle 3) |
| `apps/api/src/issues/` | Issues module: create, list-by-project, get, patch, status-transition (cycle 4) |
| `apps/api/src/comments/` | Comments module: create + list comments per issue, author from `X-User-Email` (cycle 5) |
| `apps/web/` | Angular 17 SPA (standalone components, Angular Material from cycle 7) |
| `apps/web/src/app/api/api.service.ts` | HTTP client — typed wrappers for all v1 routes (cycle 6) |
| `apps/web/src/app/projects/projects-list.component.ts` | Project list view with create + archive actions (cycle 7, Angular Material) |
| `apps/web/src/app/projects/project-issues.component.ts` | Issue list for a project with create-issue form (cycle 7+9, Angular Material) |
| `apps/web/src/app/issues/issue-detail.component.ts` | Issue detail, comments, add-comment form, status transitions, edit (cycles 8–9) |
| `apps/web/src/environments/` | Angular environment files (`apiUrl = http://localhost:3000/api/v1`) |
| `docs/SMOKE.md` | Operator-runnable manual smoke checklist (cycle 10) |
| `docker-compose.yml` | Postgres 16 service (`db`) |
| `.env.example` | `DATABASE_URL` template |
| `.github/workflows/ci.yml` | CI: api job (Postgres service) + web job on Node 20 |
| `.cdd/SCOPE.md` | Product boundary |
| `.cdd/STACK.md` | Stack pins, CDD dispatch binding |
| `.cdd/ISSUES.md` | Cycle index |
| `.cdd/issues/N/ISSUE.md` | Per-cycle dispatch contract |

## Entry points

| Surface | Entry | Cycle |
|---------|-------|-------|
| API | `apps/api/src/main.ts` | 1 ✅ |
| Projects API | `apps/api/src/projects/projects.controller.ts` | 3 ✅ |
| Issues API | `apps/api/src/issues/issues.controller.ts` | 4 ✅ |
| Comments API | `apps/api/src/comments/comments.controller.ts` | 5 ✅ |
| Web | `apps/web/src/main.ts` | 1 ✅ |
| Web routes | `apps/web/src/app/app.routes.ts` | 6 ✅ |
| Web HTTP client | `apps/web/src/app/api/api.service.ts` | 6 ✅ |
| Migrations | `apps/api/src/migrations/20260610000000-InitialSchema.ts` | 2 ✅ |

## Angular routes

| Route | Component | Cycle |
|-------|-----------|-------|
| `/` → `/projects` (redirect) | — | 13 ✅ |
| `/projects` | `ProjectsListComponent` | 6 ✅ |
| `/projects/:projectId/issues` | `ProjectIssuesComponent` | 7 ✅ |
| `/issues/:issueId` | `IssueDetailComponent` | 8 ✅ |

## CI / local parity

GitHub Actions `.github/workflows/ci.yml`:
- `api` job: Node 20, Postgres 16 service container, `npm run test:api`
- `web` job: Node 20, `npm run test:web`

Local `npm run test:all` = CI api + web jobs combined.

## Conventions

See `.cdd/STACK.md`. Branch per cycle: `cycle/N`. Cycle artifacts: `.cdd/unreleased/N/` on same branch.

## Decisions (append-only, short)

- 2026-06-09: Greenfield; contracts in `.cdd/` before code. Issues local (not GitHub Issues). Hub: cn-sigma.
- 2026-06-09: Cycle 1 — monorepo scaffold delivered. npm workspaces root with `apps/api` (NestJS 10) and `apps/web` (Angular 17). Jest in both apps (ts-jest for API, jest-preset-angular for web). Tests pass locally.

## Decisions (append-only, short) — cycle 2

- 2026-06-10: Cycle 2 — TypeORM persistence layer. Entities Project/Issue/Comment. Initial migration with uuid-ossp extension, FK CASCADE constraints. AppModule wired with TypeOrmModule.forRootAsync; synchronize: false. Integration test proves migration round-trip.

## Decisions (append-only, short) — cycle 3

- 2026-06-11: Cycle 3 — Projects HTTP API. NestJS `ProjectsModule` with controller, service, two DTOs (create/update). Four routes: POST /projects (201), GET /projects (200), PATCH /projects/:id (200/404/409), POST /projects/:id/archive (200/404/409). Global ValidationPipe + class-validator on DTOs. Swagger via @ApiTags/@ApiResponse decorators. Unit tests mock TypeORM repository; e2e tests use real Postgres with supertest. 25 API tests pass.

## Decisions (append-only, short) — cycle 4

- 2026-06-11: Cycle 4 — Issues HTTP API. NestJS `IssuesModule` with one controller (empty prefix), service, three DTOs (create/update/update-status). Five routes: POST /projects/:projectId/issues (201/404/409), GET /projects/:projectId/issues (200), GET /issues/:id (200/404), PATCH /issues/:id (200/400/404), POST /issues/:id/status (200/400/404). Status transitions enforced via constant `TRANSITIONS` map; skips, reverts, same-status, and transitions from `closed` all return 400. Archived-project guard in service (loads Project repo). `--runInBand` added to `jest` script to prevent e2e races on shared Postgres. 62 API tests pass (25 pre-existing + 17 new unit + 20 new e2e).

## Decisions (append-only, short) — cycle 5

- 2026-06-13: Cycle 5 — Comments HTTP API. NestJS `CommentsModule` with one controller (empty prefix), service, one DTO (create). Two routes: POST /issues/:issueId/comments (201/400/404), GET /issues/:issueId/comments (200/404). Author sourced from `req.userEmail` (set by global `UserEmailMiddleware`); absent/empty header → "anonymous". Comments ordered by `created_at ASC`. 76 API tests pass (62 pre-existing + 14 new: 7 unit + 7 e2e).

## Decisions (append-only, short) — cycle 6

- 2026-06-13: Cycle 6 — Angular SPA shell + typed HTTP client. `ApiService` with typed wrappers for all v1 routes. Three placeholder Angular standalone components (`ProjectsListComponent`, `ProjectIssuesComponent`, `IssueDetailComponent`) wired to routes. CORS enabled in `main.ts` (`app.enableCors()`); dev proxy not used because `environments/environment.ts` carries an absolute URL, making proxy inoperative. 6 web tests pass.

## Decisions (append-only, short) — cycle 7

- 2026-06-13: Cycle 7 — Issue list + project views with Angular Material. `ProjectsListComponent` and `ProjectIssuesComponent` wired with `@angular/material` components (MatCard, MatButton, MatFormField, MatList). `ApiService` gained `createProject`, `archiveProject` methods. 12 web tests pass (6 pre-existing + 6 new).

## Decisions (append-only, short) — cycle 8

- 2026-06-14: Cycle 8 — Issue detail + comments UI. New `IssueDetailComponent` replacing 22-line stub; full issue detail, comment list, add-comment form (sends `X-User-Email` header), and forward-only status transitions (button-absent approach for closed status). `ApiService` gained `getComments`, `addComment`, `updateIssueStatus` methods and `Comment` interface. 23 web tests pass (12 pre-existing + 11 new).

## Decisions (append-only, short) — cycle 9

- 2026-06-14: Cycle 9 — Create/edit issue flows. Create-issue form added to `ProjectIssuesComponent`; inline edit form added to `IssueDetailComponent` (title, description, priority, assignee). `ApiService` gained `createIssue`, `updateIssue` methods. Template-driven form binding (`[value]` + `(input)`) consistent with pre-existing comment form. 33 web tests pass (23 pre-existing + 10 new).

## Decisions (append-only, short) — cycle 11

- 2026-06-18: Cycle 11 — UX navigation: routerLink between views. `routerLink` bindings added to every project row (`ProjectsListComponent`) and every issue row (`ProjectIssuesComponent`). Empty-state text ("No projects yet." / "No issues yet.") added to both list components. `statusLabels`/`priorityLabels` maps added to `ProjectIssuesComponent` to replace raw enum strings in display. Inline form-submit `createError` field replaces full-view `@else if (error)` pattern on submit; inline load-error added inside `@else` block. 6 new tests (2 list + 4 issues). 39 web tests pass. gh #1 closed.

## Decisions (append-only, short) — cycle 12

- 2026-06-19: Cycle 12 — bug: raw enum values in issue-detail (status, priority, "Move to" button). `statusLabels` and `priorityLabels` maps added to `IssueDetailComponent`; three template bindings updated (status display, priority display, "Move to" button label). 3 new unit tests (`label-AC1`, `label-AC2`, `label-AC3`). 42 web tests pass (39 pre-existing + 3 new). gh #2 closed.

## Decisions (append-only, short) — cycle 13

- 2026-06-19: Cycle 13 — bug: no root route — blank page at /. `{ path: '', redirectTo: 'projects', pathMatch: 'full' }` added as first entry in `apps/web/src/app/app.routes.ts`. Navigating to `/` now redirects to `/projects`. 1 file changed, 1 line added. 42 web tests pass (unchanged). gh #3 closed.

## Known unknowns / debt

- ORM-level @ManyToOne/@OneToMany relations — deferred (D-CY2-4); issues loaded by project_id column directly.
- `dev:api` script uses ts-node (no auto-reload). Description imprecision ("watch mode") in STACK.md and README corrected in cycle 10 F2.
- AC1 oracle for root redirect (cycle 13) is manual smoke only — no automated Angular router navigation test (`app.routes.spec.ts`). Declared Known Gap in proof plan.
