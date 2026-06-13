# α Dispatch — Cycle 6

```
You are α. Project: issue-tracker.
Load ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md and follow its load order.
Issue: Read .cdd/issues/6/ISSUE.md from repo root (full contract: gap, AC, non-goals).
Branch: cycle/6
```

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript strict (`strict: true` in `apps/web/tsconfig.json`) — no `any`, no `as unknown as X` casts |
| CLI integration target | N/A — standalone Angular SPA; no new binary entrypoints |
| Package scoping | `apps/web/` only; do not add new entries to `apps/web/package.json` dependencies; all new source files under `apps/web/src/app/`; proxy config at `apps/web/proxy.conf.json` if proxy chosen |
| Existing-binary disposition | `apps/api/src/` must be zero-diff EXCEPT `apps/api/src/main.ts` may add `app.enableCors()` if CORS approach is chosen (document this decision in README); `apps/web/src/environments/` unchanged — `apiUrl: 'http://localhost:3000/api/v1'` already correct; `apps/web/src/app/app.component.ts` — keep `RouterOutlet` and existing template; `main.ts` providers array extended (not replaced) |
| Runtime dependencies | Angular 17 built-ins only; `@angular/common/http` is already included in Angular — no `npm install` needed; do not add `@angular/material` |
| JSON/wire contract preservation | All HTTP calls use `environment.apiUrl` as base; no API route changes; no change to error shape |
| Backward-compat invariant | Existing 2 web tests in `app.component.spec.ts` must still pass; `npm run test:web` must exit 0; do not delete or rename any existing file |

## Context

- Working directory: repo root (`/home/mihail/Projects/usurobor/issue-tracker`)
- Hub (skill source): `../cn-sigma` relative to repo root (i.e. `/home/mihail/Projects/usurobor/cn-sigma`)
- Branch `cycle/6` is already checked out — do not create a new branch
- Git identity: `Alpha <alpha@issue-tracker.cdd.cnos>`

### Current web app state

- `apps/web/src/app/app.routes.ts` — `export const routes: Routes = []` (empty; fill it)
- `apps/web/src/main.ts` — `bootstrapApplication(AppComponent, { providers: [provideRouter(routes)] })` (no `provideHttpClient`; add it)
- `apps/web/src/environments/environment.ts` — `{ production: false, apiUrl: 'http://localhost:3000/api/v1' }` (correct; do not edit)
- `apps/web/src/app/app.component.ts` — shell with `RouterOutlet` (correct; do not edit)
- No `ApiService`, no feature components, no proxy config yet

### Proxy vs CORS choice

Both are valid. Proxy is preferred (lower blast radius — no `apps/api/` change):

**Proxy approach (preferred):**
1. Create `apps/web/proxy.conf.json`: forward `/api` to `http://localhost:3000`
2. Add `"proxyConfig": "proxy.conf.json"` to the `serve` options in `apps/web/angular.json`
3. Document in README

**CORS approach (alternative):**
1. Add `app.enableCors()` in `apps/api/src/main.ts` (before `app.listen`)
2. Document in README
3. Note in `self-coherence.md` that `apps/api/` was touched and why

## What to deliver

1. **Routes** — populate `apps/web/src/app/app.routes.ts` with 3 routes:
   - `/projects` → `ProjectsListComponent`
   - `/projects/:projectId/issues` → `ProjectIssuesComponent`
   - `/issues/:issueId` → `IssueDetailComponent`

2. **ApiService** — `apps/web/src/app/api/api.service.ts`:
   - Inject `HttpClient`
   - Use `environment.apiUrl` as base URL (import from `../../environments/environment`)
   - Typed methods returning `Observable`: at minimum `getProjects()`, `getIssues(projectId: string)`, `getIssue(issueId: string)`
   - Standalone injectable (`providedIn: 'root'`)

3. **Placeholder components** (3 total, standalone, no NgModule):
   - `apps/web/src/app/projects/projects-list.component.ts`
   - `apps/web/src/app/projects/project-issues.component.ts`
   - `apps/web/src/app/issues/issue-detail.component.ts`
   - Each must display a loading state and an error state in its template (minimal: `@if (loading)` / `@if (error)` or `*ngIf` equivalent)

4. **provideHttpClient** — add to providers array in `apps/web/src/main.ts`:
   ```ts
   import { provideHttpClient } from '@angular/common/http';
   // providers: [provideRouter(routes), provideHttpClient()]
   ```

5. **Dev connectivity** — implement proxy or CORS per choice above; document in README

6. **Unit tests** — `apps/web/src/app/api/api.service.spec.ts`:
   - Use `HttpClientTestingModule` or `provideHttpClientTesting`
   - Test at least one typed method (happy path: verify URL called)
   - `npm run test:web` must exit 0 with these tests included

7. **README** — add or update section documenting:
   - Startup sequence: `npm run dev:db`, `npm run dev:api`, `npm run dev:web`
   - CORS vs proxy choice and how it works
   - Auth header stub note: `X-User-Email` (optional, for future cycles)

## Signal review-readiness

Commit `.cdd/unreleased/6/self-coherence.md` to `cycle/6` with:
- All 6 AC rows mapped to file/line/test evidence
- The review-readiness gate at the bottom (all pre-review gate rows explicitly passed or failed-with-reason)
- Commit message: `cdd: alpha-ready — cycle 6`
