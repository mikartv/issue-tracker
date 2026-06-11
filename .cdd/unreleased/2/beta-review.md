<!-- section-manifest
planned: [Verdict, Contract Integrity, Issue Contract, Findings, Notes]
completed: []
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
