# β Close-out — Cycle 5

**Merge commit:** `2956768`  
**Branch merged:** `cycle/5` → `main`  
**Merge date:** 2026-06-13  
**Issue:** #5 — Comments API  
**Review rounds:** 1 (R1: APPROVED)

---

## Review Summary

### Round 1

APPROVED in a single round. Zero findings — no advisory, no behavioral, no structural.

All 6 ACs verified against the diff in R1. Implementation contract (7 axes) confirmed. Architecture questions A–G all pass. Scope validation clean: only `app.module.ts` and `.cdd/PROJECT.md` modified outside `apps/api/src/comments/`, both expected.

---

## Implementation Assessment

**AC coverage:** all 6 ACs met with code and test evidence.

**Route design:** 2 handlers under `@Controller()` empty-prefix form, resolving to `POST /api/v1/issues/:issueId/comments` and `GET /api/v1/issues/:issueId/comments` via the global `/api/v1` prefix. Pattern mirrors `IssuesController`.

**Author sourcing:** `UserEmailMiddleware` (globally applied in `AppModule`) sets `req.userEmail = "anonymous"` when `X-User-Email` header is absent or empty. Controller reads `req.userEmail` via `@Req() req: RequestWithUserEmail` — does not re-read the raw header. Correctly conforms to the cross-cutting pattern established in cycle 3.

**Issue-existence guard:** both `create()` and `findByIssue()` call `issueRepository.findOneBy({ id: issueId })` and throw `NotFoundException` if null. The guard is symmetric — 404 is enforced at both the write and read path.

**Sort order:** `commentsRepository.find({ where: { issue_id }, order: { created_at: 'ASC' } })` — column-based query consistent with D-CY2-4 (no `@ManyToOne`/`@OneToMany` decorators).

**DTO validation:** `CreateCommentDto` carries `@IsString()` + `@IsNotEmpty()` on `body`. Global `ValidationPipe` with `forbidNonWhitelisted: true` (inherited from existing app setup) enforces the shape.

**Swagger coverage:** `@ApiTags('comments')` on controller class; `@ApiBody` on POST; `@ApiResponse` with 201/400/404 on POST and 200/404 on GET.

**Test counts:** 76 tests, 9 suites — 7 unit (`comments.service.spec.ts`) + 7 e2e (`comments.e2e.spec.ts`) + 62 carried from prior cycles. `--runInBand` already present from cycle 4; no change needed.

**No schema change:** no new migration; `comment.entity.ts` unmodified (entity + migration were provisioned in cycle 2). No new npm dependencies. Additive-only change.

**Implementation contract (7 axes):** all confirmed in R1. Language: TypeScript strict. Package scoping: new files in `apps/api/src/comments/` only; only `app.module.ts` modified outside that directory. Wire contract: `/api/v1` prefix, NestJS default error shape (`{ statusCode, message, error }`), UUID IDs from `@PrimaryGeneratedColumn('uuid')`, ISO-8601 timestamps from `@CreateDateColumn({ type: 'timestamptz' })`.

---

## Process Observations

**Review efficiency:** 1 round, zero findings. Cleanest cycle to date — no advisory, no documentation gap, no mechanical finding.

**No remote CI:** β and α both verified locally (`npm run test:api`; 76/76 at head SHA `c05f4df`). `npx tsc --noEmit` exits 0. D-CY2-2 (no GitHub remote) remains the root constraint; cloud CI gate was not available.

**Provisional alpha-closeout (D-CY5-1):** `alpha-closeout.md` carried into main as provisional (per α SKILL §2.8 fallback). β acknowledges this is per-protocol; the provisional marker is α's own debt declaration, not a β finding.

---

## Debt Noted

Carried into main:

- **D-CY2-1:** `as unknown as X` cast in `user-email.middleware.spec.ts` — untouched this cycle.
- **D-CY2-2:** No GitHub remote; cloud CI not executed.
- **D-CY2-4:** No ORM relation decorators on entities — column-based queries used throughout; intentionally deferred.
- **D-CY5-1:** `alpha-closeout.md` is provisional — written at review-readiness time before β verdict. Per α SKILL §2.8.

No new debt introduced by cycle 5 implementation.

---

## Release Note

β does **not** tag, bump VERSION, or run `scripts/release.sh` — δ owns the release boundary.

**Signal to δ:** cycle 5 is merged to `main` at `2956768`. Release-ready for δ tag. The Comments API feature (issue #5) is fully implemented, tested, and documented.

**γ next:** write `beta-closeout.md` received; PRA due per standard protocol.
