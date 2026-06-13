---
cycle: 6
issue: "#6 — Angular shell + API client"
role: γ
date: 2026-06-13
mode: design-and-build
---

# γ Scaffold — Cycle 6

## Issue

#6 — Angular shell + API client

## Mode

design-and-build — small-change band (6 ACs, single-app scope, no new infrastructure)

## Selection

Selected under `cnos.cds/skills/cds/CDS.md` §"Selection function" → dependency-order rule: backend v1 complete (cycles 1–5, all 76 tests passing), cycle 6 is the next open issue in declared sequence. No P0 override; no operational-infrastructure override. Cycle 5 γ-closeout explicitly commits #6 as next MCA.

## Peer Enumeration (γ §2.2a)

Directories enumerated: `apps/web/src/`

Files present (confirmed via `find apps/web/src -type f`):
- `apps/web/src/app/app.component.ts` — shell with `RouterOutlet`; title only; no feature routes
- `apps/web/src/app/app.routes.ts` — `export const routes: Routes = []` (confirmed empty)
- `apps/web/src/app/app.component.spec.ts` — 2 passing placeholder tests
- `apps/web/src/environments/environment.ts` — `apiUrl: 'http://localhost:3000/api/v1'` already present
- `apps/web/src/environments/environment.development.ts` — same values
- `apps/web/src/index.html`
- `apps/web/src/main.ts` — `bootstrapApplication` + `provideRouter(routes)`; no `provideHttpClient`

Grep: `rg "ApiService|HttpClient|provideHttpClient|lazy|loadChildren" apps/web/src/` → **no matches**.

**Gap framing (all items unimplemented):**
- `app.routes.ts` exists but is empty — routes are not partially closed; cycle 6 fills them
- `environment.ts` exists with `apiUrl` — no edits needed; already correct
- No `ApiService`, `HttpClient` provider, feature components, or dev proxy/CORS config

## Surfaces γ Expects α to Touch

**New files (expected 5–8):**
- `apps/web/src/app/app.routes.ts` — overwrite empty routes with 3 named paths
- `apps/web/src/app/api/api.service.ts` — shared typed `HttpClient` wrapper; `environment.apiUrl` base
- `apps/web/src/app/api/api.service.spec.ts` — unit tests; mock HttpClient
- `apps/web/src/app/projects/projects-list.component.ts` — standalone; loading + error template state
- `apps/web/src/app/projects/project-issues.component.ts` — standalone; loading + error template state
- `apps/web/src/app/issues/issue-detail.component.ts` — standalone; loading + error template state
- `proxy.conf.json` (at `apps/web/` or repo root) — if proxy approach chosen

**Modified files (expected 2–4):**
- `apps/web/src/main.ts` — add `provideHttpClient()` to providers array
- `apps/web/angular.json` — add `proxyConfig` to serve options (if proxy chosen)
- `README.md` — document startup sequence and proxy vs CORS choice

**If CORS chosen instead of proxy:**
- `apps/api/src/main.ts` — `app.enableCors()` call; this is the only allowed `apps/api/` edit this cycle and must be documented

**Unchanged (must be zero-diff):**
- All of `apps/api/src/` except `main.ts` if CORS chosen
- `apps/web/src/environments/` — `apiUrl` is already correct
- `apps/web/src/app/app.component.ts` — must keep `RouterOutlet`
- `apps/web/src/app/app.component.spec.ts` — 2 existing tests must still pass

## AC Oracle Approach

| AC | β verification oracle |
|----|----------------------|
| AC1 | Read `apps/web/src/app/app.routes.ts`: must contain paths `/projects`, `/projects/:projectId/issues`, `/issues/:issueId` with associated components |
| AC2 | Read `api.service.ts`: must inject `HttpClient`; must reference `environment.apiUrl`; typed methods returning `Observable` |
| AC3 | Read README for documented choice; read proxy config or CORS setup to verify completeness |
| AC4 | Read all 3 placeholder components: each must have a loading state and error state in its template |
| AC5 | `npm run test:web` exits 0; read spec for mock HttpClient pattern (`HttpClientTestingModule` or `provideHttpClientTesting`) |
| AC6 | `grep -r "@angular/material" apps/web/` → no matches |

## Expected Diff Scope

~200–350 lines net new across `apps/web/`. No new npm packages. README addition (short section). `angular.json` single property addition (if proxy). Zero or one-line change to `apps/api/src/main.ts` (CORS only, optional).

## Empirical Anchor

`apps/web/src/app/app.routes.ts` exists with `routes: Routes = []` confirmed by read. `environment.ts` with `apiUrl` exists confirmed by read. These are cycle-1 scaffolds; this cycle completes them. No partial HttpClient or routing work is present — grep confirms gap is fully open.
