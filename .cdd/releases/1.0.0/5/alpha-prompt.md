# α Dispatch — Cycle 5

```
You are α. Project: issue-tracker.
Load ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md and follow its load order.
Issue: Read .cdd/issues/5/ISSUE.md from repo root (full contract: gap, AC, non-goals).
Branch: cycle/5
```

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) |
| CLI integration target | N/A (standalone web app, not a `cn` subcommand) |
| Package scoping | `apps/api/src/comments/` (new); `apps/api/src/app.module.ts` (modified); root workspace unchanged |
| Existing-binary disposition | N/A (greenfield) |
| Runtime dependencies | Node 20, NestJS 10, TypeORM, PostgreSQL 16 — no new packages in `dependencies` |
| JSON/wire contract preservation | `/api/v1` prefix; error shape `{ statusCode, message, error }`; UUID string IDs; ISO-8601 timestamps; all existing routes unaffected |
| Backward-compat invariant | N/A until v1 ships; all existing routes must remain unaffected |

## Context

Stack and conventions: `.cdd/STACK.md` (pinned, non-optional). Prior art: `apps/api/src/issues/` pattern (module, controller, service, DTOs, unit spec, e2e spec).

**Entity and table already exist.** `Comment` entity is at `apps/api/src/entities/comment.entity.ts`:
- `id` UUID pk
- `issue_id` UUID (FK to `issue.id`, column-based — no `@ManyToOne` decorator)
- `author` varchar(255) NOT NULL
- `body` text NOT NULL
- `created_at` timestamptz (no `updated_at` — immutable in v1)

The `comment` table is in `apps/api/src/migrations/20260610000000-InitialSchema.ts` with FK `issue_id → issue.id ON DELETE CASCADE`. **No migration change needed.**

`Comment` is already imported and registered in `app.module.ts` `TypeOrmModule.forRootAsync` entities array. The only `app.module.ts` change is adding `CommentsModule` to the `imports` array.

**`req.userEmail` pattern.** `UserEmailMiddleware` (applied globally via `consumer.apply(UserEmailMiddleware).forRoutes('*')`) sets `req.userEmail` to the trimmed `X-User-Email` header value, or `"anonymous"` when the header is absent or empty. Import `RequestWithUserEmail` from `../middleware/user-email.middleware`; use `@Req() req: RequestWithUserEmail` in controller handlers to read the author. Do not re-implement header-reading logic.

**`--runInBand` already set** in `apps/api/package.json` jest script (added in cycle 4). The new e2e suite will be discovered automatically; no `package.json` change needed for test isolation.

**No ORM relation decorators** (D-CY2-4 is carried deferred debt). Use column-based queries consistent with `issues.service.ts`: `findBy({ issue_id: issueId })` for lookups; `find({ where: { issue_id: issueId }, order: { created_at: 'ASC' } })` for ordered list.

## Files to create

| File | Role |
|------|------|
| `apps/api/src/comments/comments.module.ts` | NestJS module; `TypeOrmModule.forFeature([Comment, Issue])`; exports `CommentsService` |
| `apps/api/src/comments/comments.controller.ts` | 2 routes (see below); `@ApiTags('comments')`; `@Controller()` with empty prefix |
| `apps/api/src/comments/comments.service.ts` | `create(issueId, body, author)` + `findByIssue(issueId)`; injects both repos |
| `apps/api/src/comments/dto/create-comment.dto.ts` | `body: string`; `@IsString()`, `@IsNotEmpty()` |
| `apps/api/src/comments/comments.service.spec.ts` | unit; mocked `Repository<Comment>` and `Repository<Issue>` |
| `apps/api/src/comments/comments.e2e.spec.ts` | supertest + real Postgres; all 6 ACs covered |

## Files to modify

| File | Change |
|------|--------|
| `apps/api/src/app.module.ts` | Add `CommentsModule` to `imports` array |
| `.cdd/PROJECT.md` | Update `Last verified` date; update test counts; add Comments API entry point row |

## Route shape

```
POST /api/v1/issues/:issueId/comments
  Body: { body: string }
  Author: req.userEmail
  Success: 201 + created comment
  Errors: 400 (validation), 404 (issue not found)

GET /api/v1/issues/:issueId/comments
  Success: 200 + Comment[] ordered by created_at ASC (empty array when no comments)
  Errors: 404 (issue not found)
```

## CDD artifacts

After all tests pass, write `.cdd/unreleased/5/self-coherence.md` per the self-coherence skill. Signal review-readiness in its final section. Commit and push all changes (application code + CDD artifacts) to `origin/cycle/5`.

Working directory: `/home/mihail/Projects/usurobor/issue-tracker`
Hub (skill source): `../cn-sigma` relative to repo root
