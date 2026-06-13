---
cycle: 5
issue: "#5 — Comments API"
mode: design-and-build
role: α
---

# Self-Coherence — Cycle 5

## §Gap

**Issue:** #5 — Comments API  
**Mode:** design-and-build  
**Gap:** Issues API exists (cycle 4) but there is no discussion thread on issues. This cycle adds POST + GET comment routes under `/api/v1/issues/:issueId/comments`, with author sourced from the global `UserEmailMiddleware` / `req.userEmail` pattern.  
**Non-goals (carried in):** Edit/delete comment; markdown rendering; @mentions.

## §Skills

**Tier 1 — CDD lifecycle:**
- `cnos.cdd/skills/cdd/alpha/SKILL.md` — α role surface (loaded; this file is its primary output)
- `cnos.cds/skills/cds/CDS.md` — canonical lifecycle (referenced via SKILL.md load order)

**Tier 2 — always-applicable eng:**
- `.cdd/STACK.md` — stack pins (TypeScript strict, NestJS 10, TypeORM, Postgres 16; no new dependencies)

**Tier 3 — issue-specific:**
- `.cdd/SCOPE.md` — confirms comments in scope; no edit/delete in v1
- `.cdd/issues/5/ISSUE.md` — full AC contract
- `.cdd/unreleased/5/gamma-scaffold.md` — peer enumeration, implementation constraint notes, AC oracle approach

**Active constraints applied:**
- `req.userEmail` from `UserEmailMiddleware` — not re-read from header in controller
- Column-based queries (no `@ManyToOne` / `@OneToMany` decorators) per D-CY2-4
- `--runInBand` already set in `apps/api/package.json` (cycle 4) — no change needed
- No new npm dependencies added

## §ACs

Per-AC oracles run against branch HEAD `a580530` (implementation commit).

| AC | Status | Evidence |
|----|--------|----------|
| AC1 | ✅ | `POST /api/v1/issues/:issueId/comments` implemented in `comments.controller.ts:20`; body `{ body }` via `CreateCommentDto`; author = `req.userEmail` passed to service. e2e: `201 — creates comment with author from X-User-Email header` passes. |
| AC2 | ✅ | `GET /api/v1/issues/:issueId/comments` implemented in `comments.controller.ts:29`; service calls `find({ where: { issue_id: issueId }, order: { created_at: 'ASC' } })`. e2e: `200 — returns comments ordered by created_at ASC` inserts 2 comments and asserts order. |
| AC3 | ✅ | Both service methods call `issueRepository.findOneBy({ id: issueId })` and throw `NotFoundException` if null. e2e: `404 — issue does not exist` passes for both POST and GET; `200 — returns empty array when issue has no comments` passes. |
| AC4 | ✅ | `UserEmailMiddleware` (globally applied in `app.module.ts`) sets `req.userEmail = "anonymous"` when header absent. Controller reads `req.userEmail` via `@Req() req: RequestWithUserEmail`. e2e: `201 — author is "anonymous" when X-User-Email header is absent` passes. |
| AC5 | ✅ | `@ApiTags('comments')` on controller class; `@ApiBody` on POST; `@ApiResponse` with 201/400/404 on POST and 200/404 on GET in `comments.controller.ts`. |
| AC6 | ✅ | Unit spec: 7 tests in `comments.service.spec.ts` (create with email, create anonymous, create 404, findByIssue ordered, findByIssue empty, findByIssue 404). e2e spec: 7 tests in `comments.e2e.spec.ts`. All 76 API tests pass (`Test Suites: 9, Tests: 76`). |

## §Self-check

**Did α push ambiguity onto β?** No.

- Every AC is mapped to concrete evidence (file, line, test name, runner output).
- The author-sourcing contract (`req.userEmail` from middleware, not raw header read) is implemented as specified; no new header-reading logic was added.
- The controller uses `@Req() req: RequestWithUserEmail` imported from `../middleware/user-email.middleware` exactly as the dispatch requires.
- Column-based queries are used throughout (no `@ManyToOne` added), consistent with D-CY2-4 carried debt.
- Both `create` and `findByIssue` guard on issue existence before acting — 404 path is covered in both unit and e2e tests.
- No new npm packages were added; `--runInBand` already present.
- `CommentsModule` is added to `app.module.ts` imports — the only required modification to that file.
- `CommentsModule` exports `CommentsService` (available for future consumers, not required by this cycle's ACs).

**Are all claims backed by evidence in the diff?** Yes — test runner output (`76 passed, 76 total`) is the authoritative assertion count, not manual enumeration.
