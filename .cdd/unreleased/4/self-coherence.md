# Self-Coherence — Cycle 4 (α)

## Gap summary

No issues HTTP module existed. The `issue` table was fully provisioned in cycle 2 (migration `20260610000000-InitialSchema.ts`). This cycle adds the complete HTTP layer: 5 routes across two URL prefixes, 3 DTOs, service with forward-only status transitions, unit + e2e tests, Swagger decoration.

## AC coverage plan

| AC | Route / behaviour | How verified |
|----|-------------------|--------------|
| AC1 | `POST /api/v1/projects/:projectId/issues` → 201 (status=open, priority=medium); archived project → 409 | e2e: two cases |
| AC2 | `GET /api/v1/projects/:projectId/issues` → 200 array | e2e |
| AC3 | `GET /api/v1/issues/:id` → 200 with `project_id` field | e2e |
| AC4 | `PATCH /api/v1/issues/:id` → 200; `status` field in body → 400 (whitelist) | e2e |
| AC5 | `POST /api/v1/issues/:id/status` — full forward chain + skip/revert/same/terminal all 400 | e2e |
| AC6 | Swagger `@ApiTags('issues')` + `@ApiResponse` on all handlers | code |
| AC7 | `npm run test:api` green | CI / local run |

## Known constraints

- `issue` table uses `varchar` for status/priority (no Postgres CHECK constraint); TypeORM enum columns in code enforce the enum at the application layer.
- Status transitions implemented as a constant map (`TRANSITIONS`) keyed on `IssueStatus`; no numeric index arithmetic.
- Archived-project guard: service loads Project repository and checks `archived` before creating issue.
- `UpdateIssueDto` excludes `status`; `forbidNonWhitelisted: true` global pipe rejects any body with `status` key (400).
- Controller uses `@Controller()` (empty prefix) so routes `projects/:projectId/issues` and `issues/:id` resolve correctly under the global `/api/v1` prefix.

## Debt / deferred

- ORM-level `@ManyToOne`/`@OneToMany` relations still deferred (D-CY2-4); issues loaded by `project_id` column directly.
- Comments (cycle 5), search/filter/pagination (non-goal in v1).

## Files created / modified

**New:**
- `apps/api/src/issues/issues.module.ts`
- `apps/api/src/issues/issues.controller.ts`
- `apps/api/src/issues/issues.service.ts`
- `apps/api/src/issues/dto/create-issue.dto.ts`
- `apps/api/src/issues/dto/update-issue.dto.ts`
- `apps/api/src/issues/dto/update-issue-status.dto.ts`
- `apps/api/src/issues/issues.service.spec.ts`
- `apps/api/src/issues/issues.e2e.spec.ts`

**Modified:**
- `apps/api/src/app.module.ts` (IssuesModule import)
- `.cdd/PROJECT.md` (cycle 4 decisions block)

## Commit SHA

TBD — to be filled after implementation is merged.

## Test counts (TBD — filled after `npm run test:api` passes)

| File | `it(` count |
|------|-------------|
| `issues.service.spec.ts` | TBD |
| `issues.e2e.spec.ts` | TBD |
| Existing (cycle 3) | 25 |
| **Total expected** | ~40–45 |

## AC evidence map (TBD — filled after tests pass)

## Review-readiness (TBD)
