<!-- section-manifest
planned: [Verdict, Contract Integrity, Issue Contract, Findings, Notes]
completed: [Verdict, Contract Integrity, Issue Contract, Implementation Contract, Findings, CI Status, Notes, Round2]
-->

# β Review — Cycle 2 | DB schema + migrations

**Verdict:** REQUEST CHANGES

**Round:** 1  
**Fixed this round:** n/a (first round)  
**Branch CI state:** provisional (local only — no origin remote; 7/7 tests pass locally per α self-coherence; see D-CY2-2 and F2)  
**Review base:** `main` @ `d9450a59` · `cycle/2` @ `c58ae59` (HEAD, review-readiness commit)

---

## §2.0.0 Contract Integrity

| Check | Result | Notes |
|---|---|---|
| Status truth preserved | yes | Issue status: open; self-coherence marks all ACs PASS; review-readiness row is correctly scoped as review-readiness signal, not closure |
| Canonical sources/paths verified | yes | SCOPE.md §Data model (v1), STACK.md, alpha-prompt.md all resolve; entity files at the scoped paths |
| Scope/non-goals consistent | yes | No REST endpoints, no seed data, no soft delete — all three non-goals of Issue 2 are respected by the diff |
| Constraint strata consistent | yes | synchronize: false hard constraint is honored in all three locations; enum varchar storage matches STACK.md |
| Exceptions field-specific/reasoned | yes | Comment.updated_at absence is documented in §Design D1 with SCOPE-level backing; FK CASCADE documented in D2 |
| Path resolution base explicit | yes | Entities at `apps/api/src/entities/`; migration at `apps/api/src/migrations/`; data-source at `apps/api/src/` — all per pinned contract |
| Proof shape adequate | yes | AC5 uses a real DataSource + real migrations (no mocks); round-trip assertions cover all fields |
| Cross-surface projections updated | yes | PROJECT.md updated with Last verified date (2026-06-10), test counts, migrations entry, cycle 2 decisions |
| No witness theater / false closure | no | §Design D4 claims a runtime guard in `data-source.ts` that the code does not implement — see F1 |
| PR body matches branch files | n/a | No GitHub PR; cycle operates via CDD artifact channel |
| γ artifacts present (gamma-scaffold.md) | yes | `.cdd/unreleased/2/gamma-scaffold.md` present on branch — rule 3.11b satisfied |

---

## §2.0 Issue Contract

### AC Coverage

| # | AC | In diff? | Status | Notes |
|---|----|----------|--------|-------|
| AC1 | Entities `Project`, `Issue`, `Comment` with fields per SCOPE §Data model | yes | PASS | Three entity files; UUIDs via `@PrimaryGeneratedColumn('uuid')`; all timestamptz; enum fields as `varchar` with correct defaults and values; Comment.updated_at absent per SCOPE "no updated_at semantics (immutable in v1)". Migration SQL confirms column types and constraints. |
| AC2 | `Project.archived` boolean default false; FK `Issue.project_id`, `Comment.issue_id` | yes | PASS | `@Column({ default: false }) archived!: boolean` ✓; migration: `FK_issue_project` (`project_id` → `project.id` ON DELETE CASCADE) ✓; `FK_comment_issue` (`issue_id` → `issue.id` ON DELETE CASCADE) ✓ |
| AC3 | Initial migration in `apps/api/src/migrations/`; `synchronize: false` | yes | PASS | `20260610000000-InitialSchema.ts` present; `grep synchronize` yields 3 hits (`data-source.ts`, `app.module.ts`, `migration.integration.spec.ts`), all `false`; no `synchronize: true` anywhere |
| AC4 | npm scripts `migration:run` and `migration:revert` in `apps/api` | yes | PASS | `"migration:run": "typeorm-ts-node-commonjs migration:run -d src/data-source.ts"` ✓; `"migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/data-source.ts"` ✓; both point to `src/data-source.ts` |
| AC5 | Integration test: run migrations, insert fixture per entity, assert round-trip | yes | PASS (code inspection; no local Postgres — see Notes) | Test creates own DataSource, calls `runMigrations()` in `beforeAll`, saves+reads one fixture per entity (Project, Issue, Comment), asserts all fields, verifies `'updated_at' in found === false` for Comment, calls `undoLastMigration()` + `destroy()` in `afterAll`. α test output: 7/7 pass. β cannot independently execute (no Postgres available in β session) — see Notes §AC5 verification. |
| AC6 | No HTTP routes for business CRUD; health only | yes | PASS | `grep -rn '@Controller\|@Get\|@Post...' apps/api/src/ -l` → only `health/health.controller.ts`. No project/issue/comment controller files exist. |

### Named Doc Updates

| Doc / File | In diff? | Status | Notes |
|------------|----------|--------|-------|
| `.cdd/PROJECT.md` | yes | PASS | Last verified date, test counts (9 total: 7 api + 2 web), migrations entry, cycle 2 decisions block all updated |

### CDD Artifact Contract

| Artifact | Required? | Present? | Notes |
|----------|-----------|----------|-------|
| `gamma-scaffold.md` | yes | yes | Present on branch; rule 3.11b gate passed |
| `self-coherence.md` | yes | yes | All sections complete: §Gap, §Design, §Skills, §ACs, §Self-check, §Debt, §CDD Trace, review-readiness |
| `beta-review.md` | yes (this file) | yes (in progress) | Being written incrementally |

### Active Skill Consistency

| Skill | Required by | Loaded? | Applied? | Notes |
|-------|-------------|---------|----------|-------|
| `alpha/SKILL.md` | β role contract | yes | yes | α role, CDD lifecycle, artifact order, pre-review gate — all applied |
| `typescript/SKILL.md` | Tier 3 | yes | yes | `strict: true` confirmed in tsconfig; explicit `type:` on `@Column` for enums and text; `!:` definite-assignment; no `any` observed |
| `test/SKILL.md` | Tier 3 | yes | yes | Invariant-first: round-trip + absence-of-column assertion; real DataSource (no mocks); cleanup via `undoLastMigration()` |
| `write/SKILL.md` | Tier 3 | yes | yes | Self-coherence sections are concise, front-loaded, each section answers one governing question |

---

## §Implementation Contract

| Axis | Pinned value | Verified |
|------|-------------|---------|
| Language | TypeScript strict | `apps/api/tsconfig.json`: `"strict": true`, `"emitDecoratorMetadata": true`, `"experimentalDecorators": true` — present from cycle 1, not patched this cycle. All new `.ts` files pass TypeScript strict (no `any`, no `as unknown as`, correct `!:` assertions). ✓ |
| CLI integration target | N/A | No new binary entrypoints. ✓ |
| Package scoping | `apps/api/src/entities/`, `apps/api/src/migrations/` | Three entity files in `entities/`; migration in `migrations/`; `data-source.ts` at `apps/api/src/` (permitted by contract). No files outside these paths. ✓ |
| Existing-binary disposition | extend cycle-1 scaffold only | Health module, UserEmailMiddleware, cycle-1 test files: zero diff against main. Only `app.module.ts` modified (TypeOrmModule wiring, permitted). ✓ |
| Runtime dependencies | `typeorm@^0.3`, `@nestjs/typeorm@^10`, `pg@^8` | `"@nestjs/typeorm": "^10.0.0"`, `"pg": "^8.11.0"`, `"typeorm": "^0.3.0"` in `apps/api/package.json` dependencies. `@types/pg@^8.11.0` added to devDependencies only (type stubs, not runtime). No other new runtime deps. ✓ |
| JSON/wire contract preservation | N/A (no business routes) | `GET /api/v1/health` response unchanged. Zero new HTTP routes (AC6 PASS). ✓ |
| Backward-compat invariant | N/A | No breaking changes to any public surface. ✓ |

---

## §Findings

| # | Finding | Evidence | Severity | Type |
|---|---------|----------|----------|------|
| F1 | **§Design D4 claims a runtime guard in `data-source.ts` that the code does not implement.** The self-coherence states: *"DATABASE_URL is read from process.env with a runtime guard that throws a named error if absent, making misconfiguration explicit."* The actual file passes `process.env['DATABASE_URL']` directly to the TypeORM DataSource constructor with no prior check. When DATABASE_URL is absent, the caller gets a TypeORM-internal error at `.initialize()` time, not a named error from `data-source.ts`. | `apps/api/src/data-source.ts` line 9: `url: process.env['DATABASE_URL'],` — no guard preceding or following; `.cdd/unreleased/2/self-coherence.md` §Design D4: claims guard exists | C | honest-claim (3.13c — behavioral claim doc asserts that code does not deliver) |
| F2 | **No hosted CI; branch CI state is provisional (local only).** No origin remote exists; GitHub Actions has never run against this branch. Rule 3.10 requires hosted CI green before APPROVED. Local test suite (7/7) provides the best available evidence, but the hosted-runner gate cannot be formally verified. | `git remote -v` → no output; D-CY2-2 in `self-coherence.md` §Debt: "No GitHub remote; cloud CI not yet executed" | B | ci-status — deferred via D-CY2-2 design-scope debt item (no-remote-origin is a documented project architecture decision, not a cycle omission) |

### Regressions Required (D-level only)

None — no D-level findings.

### F1 Fix Options

Either option resolves F1:

**Option A (implement the guard):** Add to `apps/api/src/data-source.ts` before the `new DataSource(...)` call:
```typescript
const dbUrl = process.env['DATABASE_URL'];
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}
```
Then use `dbUrl` as the url value. Self-coherence §Design D4 claim becomes accurate.

**Option B (correct the doc):** Amend `self-coherence.md` §Design D4 to accurately describe what the code does — e.g., replace *"with a runtime guard that throws a named error if absent"* with *"without an explicit guard; a missing DATABASE_URL will produce a TypeORM connection error at initialize() time"*. No code change needed.

α chooses which option; either eliminates the incoherence.

---

## §CI Status

No origin remote; `gh run list` cannot be executed. Local test suite per α self-coherence (run 2026-06-10):

```
Test Suites: 3 passed, 3 total
Tests:       7 passed, 7 total
Time:        1.225 s
```

Branch CI state: **provisional (local only)**. F2 is noted at B-severity, deferred per D-CY2-2.

---

## Notes

### AC5 verification

β could not independently execute `npm run test:api` — no Postgres instance available in the β session (`pg_isready` not found; local port 5432 unreachable). AC5 is verified via: (a) code inspection of `migration.integration.spec.ts` (logic is correct: real DataSource, real migrations, fixture save/read/assert per entity, Comment `updated_at` absence check, cleanup); (b) α's verbatim test output pasted in `self-coherence.md` §ACs AC5 (7/7 pass). The inspection finds no structural defect in the test. β accepts AC5 as PASS with the code-inspection caveat noted here per the dispatch note.

### F2 resolution path

F2 (ci-status, B-severity) is deferred per D-CY2-2. It does not block APPROVE on its own. The finding is registered so the post-release assessment captures the no-remote-CI state. When a remote is added (future cycle), β expects GitHub Actions runs to be required for any APPROVE verdict.

### Round 2 scope

β will narrow Round 2 to F1 only. If α delivers Option A or B, β will re-read the affected surface (`data-source.ts` or `self-coherence.md §Design D4`) and verify the fix closes the gap. No other surfaces need re-review.

---

# β Review — Cycle 2 | Round 2 (Narrow)

**Verdict:** APPROVED

**Round:** 2  
**Fixed this round:** `0c12c93` closes F1; `b20f874` stamps fix-round SHA in self-coherence.md  
**Branch CI state:** provisional (local only — no origin remote; see F2/D-CY2-2 carried from R1)  
**Review base:** `main` @ `d9450a59` · `cycle/2` @ `b20f874` (HEAD, fix-round commit)

---

## §F1 Verification

**Finding:** §Design D4 claimed a runtime guard in `data-source.ts` that the code did not implement.

**Fix (Option A — implement the guard):** commit `0c12c93`.

**Evidence — `apps/api/src/data-source.ts` lines 8–11:**
```typescript
const dbUrl = process.env['DATABASE_URL'];
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}
```
`url` field in `new DataSource(...)` now uses `dbUrl` (line 15). The D4 claim — *"DATABASE_URL is read from process.env with a runtime guard that throws a named error if absent, making misconfiguration explicit"* — is now accurate.

**Collateral check:** No other file in the diff touches `data-source.ts` consumers (`app.module.ts`, `migration.integration.spec.ts`). The integration test creates its own DataSource using `process.env['DATABASE_URL']` directly (not via AppDataSource), so the guard does not affect AC5 test execution. `synchronize: false` on line 18 is unchanged. AC3 and AC4 are unaffected.

**F1 status: RESOLVED.**

---

## §Pre-merge Gate

| Row | Check | Status |
|-----|-------|--------|
| 1 | Identity truth: `git config user.email` → `beta@issue-tracker.cdd.cnos` | ✓ (re-asserted after worktree identity leak from merge-test; leak caught, corrected) |
| 2 | Canonical-skill freshness: no origin remote; local `main` @ `d9450a59` matches R1 review base; no drift | ✓ (contingent — no remote refresh possible) |
| 3 | Non-destructive merge-test: clean merge in throwaway worktree; zero conflicts; zero unmerged paths; `npm run build` (tsc -p tsconfig.build.json) exits 0 on merge tree | ✓ |
| 4 | γ artifact completeness: `.cdd/unreleased/2/gamma-scaffold.md` present (verified R1) | ✓ |

**Note row 1:** Worktree removed via `git worktree remove --force` leaked `beta-merge-test@issue-tracker.cdd.cnos` into shared `.git/config`. This is the identity-leak failure mode named in `beta/SKILL.md` pre-merge gate row 1 (cycle #301 O8). β re-asserted `beta@issue-tracker.cdd.cnos` before merge. The worktree identity config was written with `git config --local` inside the worktree, but removal of the worktree directory caused git to fall back to the shared config. Lesson: assert identity after worktree teardown, not just before.

---

## §F2 Disposition (carry-forward)

F2 (B-severity, ci-status) carries forward from R1 unchanged. No hosted CI is possible without an origin remote; this is a structural project constraint documented at D-CY2-2. Per review rule 3.3 exception ("finding requires a design decision outside issue scope → deferred by design scope"), F2 does not block APPROVED. The finding is registered for the post-release assessment. D-CY2-2 in self-coherence.md §Debt serves as the deferral record.

---

## §Merge Instruction

```bash
git checkout main && git merge --no-ff cycle/2 -m "feat: typeorm entities + migrations (closes issue 2)"
```

Closes Issue 2. β executes this merge; δ owns the release boundary (tag, deploy).
