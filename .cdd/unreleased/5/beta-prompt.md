# β Dispatch — Cycle 5

```
You are β. Project: issue-tracker.
Load ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md and follow its load order.
Issue: Read .cdd/issues/5/ISSUE.md from repo root (full contract: gap, AC, non-goals).
Branch: cycle/5
```

## Context for δ

- Allowed tools: `--allowedTools "Read,Write,Bash"`
- Git identity for β commits: `Beta <beta@issue-tracker.cdd.cnos>`
- β dispatched after α signals review-readiness: look for the review-readiness section at the end of `.cdd/unreleased/5/self-coherence.md` on `origin/cycle/5`.
- β writes review passes incrementally to `.cdd/unreleased/5/beta-review.md`, committing + pushing after each pass.
- On APPROVE: β merges `cycle/5` into `main`, then writes `.cdd/unreleased/5/beta-closeout.md`.
- Working directory: repo root of `issue-tracker` (`/home/mihail/Projects/usurobor/issue-tracker`).
- HUB (skill source): `../cn-sigma` relative to repo root (or `/home/mihail/Projects/usurobor/cn-sigma`).

## What β must review

α adds the full Comments HTTP module on top of the existing `Comment` entity and migration (both shipped in cycle 2). The diff will contain:

**New files (expected ~8 total):**
- `apps/api/src/comments/comments.module.ts` — NestJS module; imports `TypeOrmModule.forFeature([Comment, Issue])`; provides `CommentsService`
- `apps/api/src/comments/comments.controller.ts` — 2 routes: `POST /issues/:issueId/comments`, `GET /issues/:issueId/comments`; `@ApiTags('comments')` + `@ApiResponse` per handler
- `apps/api/src/comments/comments.service.ts` — `create` + `findByIssue`; injects `Repository<Comment>` and `Repository<Issue>`; throws `NotFoundException` when issue absent
- `apps/api/src/comments/dto/create-comment.dto.ts` — `body: string`; class-validator decorators
- `apps/api/src/comments/comments.service.spec.ts` — unit test; mocked repos
- `apps/api/src/comments/comments.e2e.spec.ts` — supertest + test Postgres; all 6 ACs covered

**Modified files:**
- `apps/api/src/app.module.ts` — `CommentsModule` added to imports array
- `.cdd/PROJECT.md` — `Last verified` date updated; test counts updated; Comments API entry point row added

## AC verification oracles

| AC | Oracle | Pass condition |
|----|--------|----------------|
| AC1 | Read controller + e2e; `npm run test:api` (with `DATABASE_URL`) | `POST /api/v1/issues/:issueId/comments` returns 201; response body has `id` (UUID string), `issue_id`, `author` (= header value or `"anonymous"`), `body`, `created_at` (ISO-8601) |
| AC2 | Read service `findByIssue` call; read e2e for order assertion | `GET /api/v1/issues/:issueId/comments` returns 200; array; e2e inserts ≥2 comments and asserts `created_at` ascending order |
| AC3 | Read service for issue check; read e2e for 404 and empty-array cases | 404 when `issueId` does not exist (both POST and GET); 200 with `[]` when issue exists but has no comments |
| AC4 | Read middleware + controller; read e2e for anonymous case | POST without `X-User-Email` header → `author = "anonymous"` in response; e2e test case explicitly exercises this path |
| AC5 | Read controller decorators | `@ApiTags('comments')` on controller class; POST handler has `@ApiResponse` for 201, 400, 404; GET handler has `@ApiResponse` for 200, 404 |
| AC6 | `npm run test:api` | Exit 0; ≥1 service spec file + ≥1 e2e spec file; anonymous case, 404 case, and empty-array case each covered by a distinct test |

## Implementation contract verification (binding — non-conformance → REQUEST CHANGES, severity D, class `implementation-contract`)

| Axis | Verification |
|------|-------------|
| Language | All new `.ts` files pass TypeScript strict; class-validator decorators on DTO; no implicit `any` |
| CLI integration target | No new binary entrypoints |
| Package scoping | All new files inside `apps/api/src/comments/`; only `apps/api/src/app.module.ts` modified outside that dir; no new directories outside `apps/api/src/` |
| Existing-binary disposition | `apps/api/src/entities/comment.entity.ts` **unmodified**; `migrations/`, `health/`, `middleware/`, `projects/`, `issues/`, `main.ts`, `data-source.ts`, and all prior test files unchanged |
| Runtime dependencies | No new entries in `apps/api/package.json` `dependencies` |
| Wire contract | Error shape `{ statusCode, message, error }` per STACK.md; UUID string IDs; ISO-8601 timestamps; all existing routes (`/health`, `/projects`, `/issues`) unaffected |
| Backward-compat | N/A |

**Critical checks β must run:**

1. Read `dto/create-comment.dto.ts` — `@IsString()` and `@IsNotEmpty()` required on `body`; absence of either is D-severity (`implementation-contract`)

2. Read `comments.controller.ts` — verify `@Req() req: RequestWithUserEmail` is used (imported from `../middleware/user-email.middleware`) and `req.userEmail` is passed as author; any controller that reads `x-user-email` directly from `req.headers` bypasses middleware and is C-severity (`implementation-contract`)

3. Read `comments.service.ts` — both `create` and `findByIssue` must call `issueRepository.findOneBy({ id: issueId })`; missing check in either is C-severity (behavioral gap — returns 500 instead of 404)

4. Read `findByIssue` implementation — must use `order: { created_at: 'ASC' }`; absent order clause is C-severity (AC2 violation)

5. Verify `app.module.ts` imports `CommentsModule` — absent means all comment routes return 404 (D-severity)

6. Verify `apps/api/src/entities/comment.entity.ts` is **unmodified** — any modification is a scope violation (D-severity, `implementation-contract`)

7. Confirm no new entries in `apps/api/package.json` `dependencies`

8. Verify `--runInBand` is present but not newly duplicated in `apps/api/package.json` — it was added in cycle 4; if it appears twice or was removed, flag as advisory

## Release note

After APPROVE and merge:
- β does NOT run `scripts/release.sh`, bump VERSION, or push any tag — δ owns the release boundary.
- β writes `.cdd/unreleased/5/beta-closeout.md` (review summary, implementation assessment, process observations, debt noted).
- Merge command: `git fetch origin main && git checkout main && git merge --no-ff cycle/5 -m "feat: comments API (closes issue 5)"`.

## Dispatch note

δ: dispatch β with `claude -p` in the `issue-tracker` repo root after α's review-readiness signal appears on `origin/cycle/5`. If a local Postgres instance is available, β should run `npm run test:api` with `DATABASE_URL` set to independently verify AC6. If Postgres is not available locally, β verifies AC6 via code inspection and α's self-coherence test output, noting the limitation in `beta-review.md`.
