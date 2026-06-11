# Self-Coherence — Cycle 4 (α)

## Gap summary

No issues HTTP module existed. The `issue` table was fully provisioned in cycle 2 (migration `20260610000000-InitialSchema.ts`). This cycle adds the complete HTTP layer: 5 routes across two URL prefixes, 3 DTOs, service with forward-only status transitions, unit + e2e tests, Swagger decoration.

## AC coverage plan

| AC | Route / behaviour | How verified |
|----|-------------------|--------------|
| AC1 | `POST /api/v1/projects/:projectId/issues` → 201 (status=open, priority=medium); archived project → 409 | e2e: "201 creates issue with defaults", "409 rejects create on archived project" |
| AC2 | `GET /api/v1/projects/:projectId/issues` → 200 array | e2e: "200 returns array of issues for project" |
| AC3 | `GET /api/v1/issues/:id` → 200 with `project_id` field | e2e: "200 returns issue with project_id" |
| AC4 | `PATCH /api/v1/issues/:id` → 200; `status` field in body → 400 (whitelist) | e2e: "200 updates title/priority/assignee", "400 rejects body containing status field" |
| AC5 | `POST /api/v1/issues/:id/status` — full forward chain + skip/revert/same/terminal all 400 | e2e: "200 full forward chain", "400 skip open→done", "400 revert", "400 same-status", "400 terminal" |
| AC6 | Swagger `@ApiTags('issues')` + `@ApiResponse` on all handlers | code: issues.controller.ts lines 14, 24–27, 33–34, 39–40, 46–48, 54–57, 62–64 |
| AC7 | `npm run test:api` green | 62 tests, 7 suites — all pass |

## Known constraints

- `issue` table uses `varchar` for status/priority (no Postgres CHECK constraint); TypeORM enum columns in code enforce the enum at the application layer.
- Status transitions implemented as a constant map (`TRANSITIONS`) keyed on `IssueStatus`; no numeric index arithmetic.
- Archived-project guard: service loads Project repository; `IssuesModule` imports `TypeOrmModule.forFeature([Issue, Project])`.
- `UpdateIssueDto` excludes `status`; `forbidNonWhitelisted: true` global pipe rejects any body with `status` key (400).
- Controller uses `@Controller()` (empty prefix) so routes `projects/:projectId/issues` and `issues/:id` resolve correctly under the global `/api/v1` prefix.
- `--runInBand` added to `jest` script in `apps/api/package.json` to prevent `afterEach` DB cleanup races when two e2e suites share the same Postgres instance.

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
- `apps/api/package.json` (jest --runInBand)
- `.cdd/PROJECT.md` (cycle 4 decisions block)

## Commit SHA

`408f3f7` — feat: issues API (closes issue 4)

## Test counts

| File | `it(` count (grep) | Actual tests (Jest verbose) |
|------|-------------------|------------------------------|
| `issues.service.spec.ts` | 17 | 17 |
| `issues.e2e.spec.ts` | 21 (1 is `createIssue` helper body) | 20 |
| Cycle 3 suites (5 files) | — | 25 |
| **Total** | — | **62** |

## AC evidence map

| AC | Evidence |
|----|----------|
| AC1 create defaults | e2e `✓ 201 — creates issue with status=open and priority=medium by default`; unit `✓ creates issue with defaults status=open and priority=medium` |
| AC1 archived 409 | e2e `✓ 409 — rejects create on archived project`; unit `✓ throws ConflictException when project is archived` |
| AC2 list | e2e `✓ 200 — returns array of issues for project`, `✓ 200 — returns empty array for project with no issues` |
| AC3 single | e2e `✓ 200 — returns issue with project_id` (asserts `project_id` field present) |
| AC4 patch | e2e `✓ 200 — updates title, priority, and assignee`; `✓ 400 — rejects body containing status field (whitelist)` |
| AC5 full chain | e2e `✓ 200 — full forward chain: open → in_progress → done → closed` |
| AC5 skip | e2e `✓ 400 — skip: open → done` |
| AC5 revert | e2e `✓ 400 — revert: advance to in_progress then try to revert to open` |
| AC5 same | e2e `✓ 400 — same-status transition` |
| AC5 terminal | e2e `✓ 400 — transition from closed (terminal)` |
| AC6 Swagger | `@ApiTags('issues')` on controller; `@ApiResponse` on all 5 handlers; `@ApiBody` on POST/PATCH/status handlers |
| AC7 green | `Tests: 62 passed, 62 total` — `Test Suites: 7 passed, 7 total` |

## Review-readiness

- All 7 ACs met with test evidence.
- No new migration created; no DB schema change.
- Projects API routes and response shapes unchanged (projects e2e: 10/10 pass).
- `--runInBand` is the standard NestJS pattern for e2e tests sharing a database; added to `package.json` rather than a local flag so CI picks it up automatically.
- Transition map is a compile-time constant — exhaustive over all 4 `IssueStatus` values, no runtime enum index arithmetic.
- Ready for β review.
