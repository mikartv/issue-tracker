# β Dispatch — Cycle 6

```
You are β. Project: issue-tracker.
Load ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md and follow its load order.
Issue: Read .cdd/issues/6/ISSUE.md from repo root (full contract: gap, AC, non-goals).
Branch: cycle/6
```

## Context for δ

- Allowed tools: `--allowedTools "Read,Write,Bash"`
- Git identity for β commits: `Beta <beta@issue-tracker.cdd.cnos>`
- β dispatched after α signals review-readiness: look for the review-readiness section at the end of `.cdd/unreleased/6/self-coherence.md` on `origin/cycle/6`
- β writes review passes incrementally to `.cdd/unreleased/6/beta-review.md`, committing and pushing after each pass
- On APPROVE: β merges `cycle/6` into `main`, then writes `.cdd/unreleased/6/beta-closeout.md`
- Merge command: `git fetch origin main && git checkout main && git merge --no-ff cycle/6 -m "feat: angular shell + api client (closes issue 6)"`
- Working directory: repo root of `issue-tracker` (`/home/mihail/Projects/usurobor/issue-tracker`)
- Hub (skill source): `../cn-sigma` relative to repo root (or `/home/mihail/Projects/usurobor/cn-sigma`)

## What β must review

α adds Angular routing, an `ApiService`, three placeholder components, `provideHttpClient`, dev connectivity (proxy or CORS), and unit tests on top of the cycle-1 Angular scaffold.

**New files (expected 5–8):**
- `apps/web/src/app/app.routes.ts` — overwritten with 3 routes (was `routes: Routes = []`)
- `apps/web/src/app/api/api.service.ts` — `HttpClient` wrapper; `environment.apiUrl` base
- `apps/web/src/app/api/api.service.spec.ts` — unit tests; mock HttpClient
- `apps/web/src/app/projects/projects-list.component.ts` — standalone; loading + error state
- `apps/web/src/app/projects/project-issues.component.ts` — standalone; loading + error state
- `apps/web/src/app/issues/issue-detail.component.ts` — standalone; loading + error state
- `apps/web/proxy.conf.json` (if proxy chosen)

**Modified files (expected 2–4):**
- `apps/web/src/main.ts` — `provideHttpClient()` added to providers
- `apps/web/angular.json` — `proxyConfig` entry (if proxy chosen)
- `README.md` — startup sequence + connectivity choice documented
- `apps/api/src/main.ts` — `app.enableCors()` (only if CORS chosen; else must be zero-diff)

**Unchanged (must verify zero-diff):**
- `apps/web/src/app/app.component.ts`
- `apps/web/src/app/app.component.spec.ts`
- `apps/web/src/environments/environment.ts`
- `apps/web/src/environments/environment.development.ts`
- `apps/api/src/` (all files except `main.ts` if CORS)

## AC verification oracles

| AC | Oracle | Pass condition |
|----|--------|----------------|
| AC1 | Read `apps/web/src/app/app.routes.ts` | Contains path `/projects`, `/projects/:projectId/issues`, `/issues/:issueId`; each maps to a component |
| AC2 | Read `apps/web/src/app/api/api.service.ts` | Injects `HttpClient`; uses `environment.apiUrl` as base URL; at least `getProjects()`, `getIssues(projectId)`, `getIssue(issueId)` returning `Observable` |
| AC3 | Read README + proxy config or `apps/api/src/main.ts` | Choice documented; local web → api path is functional (proxy config syntactically correct, or CORS call present) |
| AC4 | Read all 3 placeholder components | Each template has a loading state and an error state visible to the user |
| AC5 | Run `npm run test:web`; read `api.service.spec.ts` | Exit 0; mock HttpClient pattern present; at least one method tested |
| AC6 | `grep -r "@angular/material" apps/web/` | No matches |

## Implementation contract verification (non-conformance → REQUEST CHANGES, severity D, class `implementation-contract`)

| Axis | Verification |
|------|-------------|
| Language | All new `.ts` files pass TypeScript strict; no implicit `any`; no `as unknown as X` casts |
| CLI integration target | No new binary entrypoints |
| Package scoping | All new source files inside `apps/web/src/app/`; no new entries in `apps/web/package.json` dependencies |
| Existing-binary disposition | `apps/api/src/` is zero-diff OR only `apps/api/src/main.ts` has `app.enableCors()` (documented in README + self-coherence.md); `apps/web/src/environments/` unchanged; `apps/web/src/app/app.component.ts` unchanged |
| Runtime dependencies | No `@angular/material` or other new npm packages |
| Wire contract preservation | `environment.apiUrl = 'http://localhost:3000/api/v1'` used as HTTP base; no API route changes |
| Backward-compat | Existing 2 `app.component.spec.ts` tests still pass; `npm run test:web` exits 0 |

## Critical checks β must run

1. **`provideHttpClient` presence** — read `apps/web/src/main.ts`; if absent, `HttpClient` injection fails at runtime → D-severity (`implementation-contract`)

2. **No NgModule usage** — STACK.md requires standalone components only; any `@NgModule` in new component files → D-severity (`implementation-contract`)

3. **No Angular Material** — explicit AC6; any `@angular/material` import in `apps/web/` → D-severity (`implementation-contract`)

4. **Route completeness** — read `app.routes.ts`; all 3 paths required; missing any path → D-severity (`honest-claim`)

5. **Loading + error states** — read all 3 placeholder components; AC4 requires both states; missing either → C-severity (partial AC)

6. **`apps/api/` blast radius** — if diff contains changes to `apps/api/src/` beyond `main.ts`, or if `main.ts` is changed without CORS documentation → D-severity (`implementation-contract`)

7. **Proxy wiring** — if proxy approach: verify `angular.json` has `proxyConfig` pointing to the proxy file; a proxy config file without `angular.json` wiring does nothing → C-severity

8. **ApiService URL construction** — verify `environment.apiUrl` is imported and used as the HTTP base; hardcoded `localhost:3000` strings → C-severity (`wire-contract`)

## Release note

After APPROVE and merge:
- β does NOT run `scripts/release.sh`, bump VERSION, or push any tag — δ owns the release boundary
- β writes `.cdd/unreleased/6/beta-closeout.md` (review summary, implementation assessment, AC evidence, process observations, debt noted)
- Merge commit message: `feat: angular shell + api client (closes issue 6)`

## Dispatch note

δ: dispatch β with `claude -p` in the `issue-tracker` repo root after α's review-readiness signal appears on `origin/cycle/6`. β should run `npm run test:web` to independently verify AC5 (no Postgres needed — web tests are self-contained).
