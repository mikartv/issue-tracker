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

## §Debt

| ID | Description | Scope |
|----|-------------|-------|
| D-CY2-4 (carried) | No `@ManyToOne`/`@OneToMany` ORM relation decorators on `Comment.issue_id`. Column-based queries used throughout — consistent with existing pattern in `issues.service.ts`. Deferred by design to a future cycle. | `apps/api/src/entities/comment.entity.ts`, `comments.service.ts` |
| D-CY5-1 (new) | `alpha-closeout.md` is provisional — written at review-readiness time before β verdict. Per α SKILL §2.8 provisional close-out fallback. | `.cdd/unreleased/5/alpha-closeout.md` |

No other debt introduced this cycle.

## §CDD Trace

| Step | Description | Status |
|------|-------------|--------|
| 0 | Issue filed | ✅ `.cdd/issues/5/ISSUE.md` |
| 1 | γ selects issue | ✅ gamma-scaffold.md: sequence rule, no P0 override |
| 2 | γ creates cycle branch `cycle/5` | ✅ branch `cycle/5` exists; dispatched on it |
| 3 | γ writes scaffold artifacts | ✅ `.cdd/unreleased/5/gamma-scaffold.md`, `alpha-prompt.md`, `beta-prompt.md` |
| 4 | α dispatch intake + skill load | ✅ SKILL.md loaded; STACK.md, SCOPE.md, ISSUE.md, gamma-scaffold.md read before coding |
| 5 | Design | Not required — issue is additive completion of a partially-scaffolded feature (entity + migration already exist); route shape and AC contract are fully specified in ISSUE.md and gamma-scaffold.md; no incoherence to name |
| 6 | Implementation artifacts | ✅ `apps/api/src/comments/comments.module.ts` (new); `comments.controller.ts` (new); `comments.service.ts` (new); `dto/create-comment.dto.ts` (new); `comments.service.spec.ts` (new); `comments.e2e.spec.ts` (new); `apps/api/src/app.module.ts` (modified — CommentsModule added); `.cdd/PROJECT.md` (modified — cycle 5 row, test counts, entry point). Caller path: `CommentsController` (non-test caller of `CommentsService`) is wired through `CommentsModule` and imported by `AppModule`. |
| 7 | Self-coherence | ✅ This file — §Gap, §Skills, §ACs, §Self-check, §Debt, §CDD Trace complete |

## Pre-review Gate

| Row | Check | Result |
|-----|-------|--------|
| 1 | Branch rebased onto current `origin/main` | No remote configured in this environment; branch was created from `main` at dispatch (γ-scaffold commit `d3649e4`); no `origin/main` drift observable. Noted as CI/remote unavailable — see row 10. |
| 2 | `self-coherence.md` carries CDD Trace through step 7 | ✅ §CDD Trace steps 0–7 complete above |
| 3 | Tests present | ✅ `comments.service.spec.ts` (7 unit) + `comments.e2e.spec.ts` (7 e2e) |
| 4 | Every AC has evidence | ✅ §ACs table: all 6 ACs mapped to file/line/test |
| 5 | Known debt explicit | ✅ §Debt: D-CY2-4 (carried) + D-CY5-1 (provisional close-out) |
| 6 | Schema/shape audit | N/A — no schema-bearing parser or manifest shape changed; `Comment` entity unchanged; `CreateCommentDto` is new, not a modification |
| 7 | Peer enumeration | ✅ Change is purely additive (new module + one app.module.ts import); no family of sibling routes modified; no peer set requires enumeration beyond what gamma-scaffold.md already documented |
| 8 | Harness audit | N/A — no schema-bearing contract changed |
| 9 | Post-patch re-audit | N/A — no mid-cycle β RC received |
| 10 | Branch CI green | No remote/CI available in this environment. Tests green locally: `Test Suites: 9 passed, 9 total; Tests: 76 passed, 76 total` (run at review-readiness time). β MUST wait for CI green on head commit before merge. |
| 11 | Artifact enumeration matches diff | ✅ Diff (from γ-scaffold base): 6 new `apps/api/src/comments/` files + `app.module.ts` + `PROJECT.md` + `self-coherence.md` + γ-authored artifacts (`gamma-scaffold.md`, `alpha-prompt.md`, `beta-prompt.md`). All α-authored files mentioned in §ACs or §CDD Trace step 6. γ artifacts are γ-authored — not α scope. |
| 12 | Caller-path trace for new modules | ✅ `CommentsController` is the non-test caller of `CommentsService` (wired in `CommentsModule`). `CommentsModule` is imported by `AppModule` (`app.module.ts:5,33`). Call site: `CommentsController.create` → `CommentsService.create`; `CommentsController.findByIssue` → `CommentsService.findByIssue`. |
| 13 | Test assertion count from runner | ✅ Actual runner output: `Tests: 76 passed, 76 total` (pasted above) |
| 14 | α commit author email | ✅ `git log -1 --format='%ae' HEAD` → `alpha@issue-tracker.cdd.cnos` |
| 15 | γ-artifact at §5.1 canonical path | ✅ `git cat-file -e HEAD:.cdd/unreleased/5/gamma-scaffold.md` → EXISTS. γ-artifact at canonical §5.1 path. |

## §Review-readiness | round 1 | implementation SHA: a580530 | base SHA: d3649e4 | branch CI: green locally (76/76); remote CI unavailable — β must wait for CI green before merge | ready for β
