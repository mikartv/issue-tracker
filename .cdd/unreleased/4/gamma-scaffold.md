# γ Scaffold — Cycle 4

## Issue

**#4 — Issues API + status rules**  
File: `.cdd/issues/4/ISSUE.md`  
Mode: **design-and-build** (substantial)  
Work-shape: substantial — new HTTP module across 7 ACs

## Peer enumeration (§2.2a)

Verified before authoring §Gap:

```
rg "IssuesModule|IssuesController|IssuesService" apps/api/src/
→ no matches
```

```
rg "issues" apps/api/src/ --include="*.ts" -l
→ no matches (no HTTP layer for issues exists)
```

`issue` table: present in `apps/api/src/migrations/20260610000000-InitialSchema.ts` (columns: `id`, `project_id`, `title`, `description`, `status varchar default 'open'`, `priority varchar default 'medium'`, `assignee`, `created_at`, `updated_at`; FK to `project` ON DELETE CASCADE). No issues HTTP module exists. This cycle adds the HTTP layer only — no new migration required.

## Gap

No issues HTTP module exists. The `issue` table is fully provisioned from cycle 2. This cycle closes the gap with the full CRUD surface (create, list-by-project, single-issue, patch, status transition) plus Swagger documentation and tests.

## Surfaces γ expects α to touch

**New files:**
- `apps/api/src/issues/issues.module.ts`
- `apps/api/src/issues/issues.controller.ts`
- `apps/api/src/issues/issues.service.ts`
- `apps/api/src/issues/dto/create-issue.dto.ts`
- `apps/api/src/issues/dto/update-issue.dto.ts`
- `apps/api/src/issues/dto/update-issue-status.dto.ts`
- `apps/api/src/issues/issues.service.spec.ts`
- `apps/api/src/issues/issues.e2e.spec.ts`
- `.cdd/unreleased/4/self-coherence.md`

**Modified files:**
- `apps/api/src/app.module.ts` — register `IssuesModule`
- `.cdd/PROJECT.md` — cycle 4 decisions block

**No new migration.** The `issue` table columns match the SCOPE.md data model exactly. α must not run `migration:generate` or alter the table schema.

## AC oracle approach

Pattern from cycle 3: e2e spec via supertest against real Postgres test database.

| AC | Oracle | Test approach |
|----|--------|---------------|
| AC1 | `POST /api/v1/projects/:projectId/issues` → 201 (`status=open`, `priority=medium`); archived project → 409 | e2e: create active project + create issue; create archived project + attempt issue creation |
| AC2 | `GET /api/v1/projects/:projectId/issues` → 200 array | e2e: create project, create 2 issues, list |
| AC3 | `GET /api/v1/issues/:id` → 200 with `project_id` field | e2e: create + fetch single |
| AC4 | `PATCH /api/v1/issues/:id` → 200; body with `status` field must not change status | e2e: patch title/priority/assignee; confirm status field unchanged |
| AC5 | `POST /api/v1/issues/:id/status` → full chain `open→in_progress→done→closed` all 200; skip `open→done` → 400; revert `in_progress→open` → 400 | e2e: 4 sequential forward calls; 1 skip call; 1 revert call |
| AC6 | Swagger at `/api/docs` lists issue routes under `issues` tag | smoke check in e2e or unit: Swagger JSON includes `/projects/{projectId}/issues` and `/issues/{id}` paths |
| AC7 | `npm run test:api` green | all test files pass |

## Expected diff scope

~10 files changed: 8 new (`issues/` module files + `self-coherence.md`), 2 modified (`app.module.ts`, `PROJECT.md`). Test count delta: from 25 (cycle 3) to approximately 40–45 (unit mock-repo tests for IssuesService + e2e status-chain tests). No frontend changes.

## Empirical anchor

Cycle 3 pattern: projects module delivered module/controller/service/2 DTOs/unit spec/e2e spec as 7 new files with `app.module.ts` modification. Issues module follows identical structure. `e2e.spec.ts` naming was corrected mid-cycle 3 (D-CY3-1); α should use `.e2e.spec.ts` from the start.
