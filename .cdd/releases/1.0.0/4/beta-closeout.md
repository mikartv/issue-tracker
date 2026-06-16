# β Close-out — Cycle 4

**Merge commit:** `abfcbb9`  
**Branch merged:** `cycle/4` → `main`  
**Merge date:** 2026-06-11  
**Issue:** #4 — Issues API  
**Review rounds:** 1 (R1: APPROVED)

---

## Review Summary

### Round 1

APPROVED in a single round. One advisory finding logged (B4-A1, severity A, kind Documentation): `self-coherence.md` attributed the grep false-positive in the `it(` count to the `createIssue` helper body, but the actual source is `app.init()` on line 42 of the e2e spec (`init(` ⊇ `it(`). The test count (21 raw / 20 actual) was correct throughout; only the explanation was wrong. No action required — count accuracy was not in dispute.

All 7 ACs verified against the diff in R1. No behavioral, contract, or structural incoherence found.

---

## Implementation Assessment

**AC coverage:** all 7 ACs met with code and test evidence.

**Route design:** 5 handlers across two URL prefixes (`projects/:projectId/issues` for list/create, `issues/:id` for get/patch/status). `@Controller()` empty-prefix form resolves correctly under the global `/api/v1` prefix.

**Status transitions:** `TRANSITIONS` constant map keyed on `IssueStatus`; covers full forward chain (open → in_progress → done → closed) plus skip, revert, same-status, and terminal — all return 400. Compile-time constant, exhaustive over all 4 enum values, no numeric index arithmetic.

**Default enforcement:** `status=open` and `priority=medium` applied in service `create()`; TypeORM enum columns enforce values at the application layer (no Postgres CHECK constraint — existing constraint noted in `self-coherence.md` §Known constraints).

**Archived-project guard:** service loads `ProjectRepository`; `IssuesModule` imports `TypeOrmModule.forFeature([Issue, Project])`. Archived project → 409 `ConflictException`.

**DTO whitelist:** `UpdateIssueDto` excludes `status`; global `forbidNonWhitelisted: true` pipe returns 400 when `status` key is present in a PATCH body.

**Swagger coverage:** `@ApiTags('issues')` on controller class; `@ApiResponse` on all 5 handlers; `@ApiBody` on POST / PATCH / status handlers.

**Test counts:** 62 tests, 7 suites — 17 unit (`issues.service.spec.ts`) + 20 e2e (`issues.e2e.spec.ts`) + 25 carried from cycle 3. `--runInBand` added to `apps/api/package.json` jest script to prevent `afterEach` DB cleanup races across shared Postgres instance.

**No schema change:** no new migration; `issue` table was fully provisioned in cycle 2. No Angular changes. No comments routes. No search / filter / pagination.

**Implementation contract (7 axes):** all confirmed in R1. Language: TypeScript strict, no `any`. Package scoping: new files in `apps/api/src/issues/` only; only `app.module.ts` modified outside that directory. Wire contract: `/api/v1` prefix, NestJS default error shape, UUID IDs, ISO-8601 timestamps.

---

## Process Observations

**Review efficiency:** 1 round. B4-A1 was advisory only (documentation, no required action). Zero behavioral gaps. Cleanest cycle to date.

**B4-A1 class:** honest-claim / documentation. The false-positive attribution error had no effect on counts or implementation correctness. No fix round triggered.

**No mechanical findings:** zero stale-path, wrong-branch-name, or broken-link findings.

**Postgres limitation:** β could not independently execute `npm run test:api` due to no local Postgres connection in this β session. AC7 verified by code inspection (structural correctness) and α's runner output in self-coherence §Test counts and §AC evidence map. D-CY2-2 (no GitHub remote) remains the root constraint.

---

## Debt Noted

Carried into main:

- **D-CY2-1:** `as unknown as X` cast in `user-email.middleware.spec.ts` — untouched this cycle.
- **D-CY2-2:** No GitHub remote; cloud CI not executed.
- **D-CY2-4:** No ORM relation decorators on entities — intentionally deferred; issues loaded by `project_id` column directly.

No new debt from cycle 4 implementation.

---

## Release Note

β does **not** tag, bump VERSION, or run `scripts/release.sh` — δ owns the release boundary.

**Signal to δ:** cycle 4 is merged to `main` at `abfcbb9`. Release-ready for δ tag. The Issues API feature (issue #4) is fully implemented, tested, and documented.

**γ next:** write `beta-closeout.md` received; PRA due per standard protocol.
