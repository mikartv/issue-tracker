---
cycle: 5
issue: "#5 — Comments API"
mode: design-and-build
work_shape: typical (6 ACs)
---

# γ Scaffold — Cycle 5

## Selection

Selected under sequence rule: issues 1–4 closed; issue #5 is the next open issue (`.cdd/ISSUES.md`). No P0 override, no cross-repo proposal, no assessment commitment overriding sequence. Decisive clause: sequence rule.

## Peer Enumeration (§2.2a)

Directories in impact graph: `apps/api/src/`, `apps/api/src/entities/`, `apps/api/src/comments/` (proposed), `apps/api/src/app.module.ts`.

Grep results for `Comment`/`comment`/`CommentsModule` in `apps/api/src/`:
- `apps/api/src/entities/comment.entity.ts` — `Comment` entity exists: fields `id` UUID, `issue_id` UUID, `author` varchar(255), `body` text, `created_at` timestamptz. No `@ManyToOne` decorator (D-CY2-4 carried deferred by design).
- `apps/api/src/app.module.ts` — `Comment` imported and registered in `TypeOrmModule.forRootAsync` entities array.
- `apps/api/src/migrations/20260610000000-InitialSchema.ts` — `comment` table exists with FK `issue_id → issue.id ON DELETE CASCADE`. No migration changes needed.
- No `CommentsModule`, `CommentsController`, `CommentsService` found — confirmed absent by grep.
- No `apps/api/src/comments/` directory — confirmed absent.

Gap framing: partially scaffolded (entity + migration + entity registration shipped in cycle 2); this cycle completes the HTTP surface (module, controller, service, DTO, tests). Not a negation of existence — additive completion.

## Surfaces α Will Touch

| Surface | Change type |
|---------|-------------|
| `apps/api/src/comments/comments.module.ts` | new |
| `apps/api/src/comments/comments.controller.ts` | new |
| `apps/api/src/comments/comments.service.ts` | new |
| `apps/api/src/comments/dto/create-comment.dto.ts` | new |
| `apps/api/src/comments/comments.service.spec.ts` | new |
| `apps/api/src/comments/comments.e2e.spec.ts` | new |
| `apps/api/src/app.module.ts` | modified — add CommentsModule import |
| `.cdd/PROJECT.md` | modified — test counts, entry point row |

No entity or migration changes. No changes outside `apps/api/src/comments/` and `app.module.ts`.

## AC Oracle Approach

| AC | Oracle |
|----|--------|
| AC1 (POST create) | Read controller + e2e; `npm run test:api` — 201; response body has `id`, `issue_id`, `author` (= header or "anonymous"), `body`, `created_at` |
| AC2 (GET list ordered) | Read controller + service `find` call; e2e inserts ≥2 comments and asserts `created_at` order |
| AC3 (404/empty) | Service checks `issueRepository.findOneBy({ id: issueId })` before any action; empty `[]` from `find` when issue exists with no comments |
| AC4 (anonymous) | `UserEmailMiddleware` (applied globally) sets `req.userEmail = "anonymous"` when header absent; controller reads `req.userEmail` via `@Req()`; e2e POST case without header |
| AC5 (Swagger) | `@ApiTags('comments')` on controller class; `@ApiResponse` on each handler (201/400/404 for POST; 200/404 for GET) |
| AC6 (tests) | `npm run test:api` exits 0; service spec mocks Comment + Issue repos; e2e covers all cases |

## Implementation Constraint Notes

- **`req.userEmail` access**: import `RequestWithUserEmail` from `../middleware/user-email.middleware`; use `@Req() req: RequestWithUserEmail` in controller. Do not re-read the header directly.
- **Issue existence**: service injects `Repository<Issue>`; both `create` and `findByIssue` call `issueRepository.findOneBy({ id: issueId })` and throw `NotFoundException` if absent.
- **Sort**: `commentsRepository.find({ where: { issue_id: issueId }, order: { created_at: 'ASC' } })`.
- **No ORM relations** (D-CY2-4): column-based queries throughout; consistent with existing `issues.service.ts` pattern.
- **`--runInBand`** already set in `apps/api/package.json` from cycle 4; no change needed.
- **No new npm dependencies** — no new packages required.

## Expected Diff Scope

~8 new files in `apps/api/src/comments/`, 2 modified (`app.module.ts`, `.cdd/PROJECT.md`). Fully additive. No migration required.
