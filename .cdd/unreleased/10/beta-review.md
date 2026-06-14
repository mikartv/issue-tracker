---
cycle: 10
issue: "#10 — Integration smoke + README polish"
role: β
artifact: beta-review
round: 1
review-sha: b527b07895010e797f98d2f56762c9ce9f42d71d
origin-main-sha: local-only repository — no remote configured
---

**Verdict:** REQUEST CHANGES

**Round:** 1
**Fixed this round:** n/a (R1)
**Branch CI state:** local-only — `npm run test:web` 33/33 confirmed; `npm run test:all` (api) relies on α verbatim output (no remote CI)
**Merge instruction:** pending resolution of F1 and F2; then `git merge cycle/10` into main with `Closes #10`

---

## §2.0.0 Contract Integrity

| Check | Result | Notes |
|---|---|---|
| Status truth preserved | yes | Mode=substantial, Status=open — accurate for an in-flight implementation cycle |
| Canonical sources/paths verified | yes | SCOPE.md, STACK.md, ISSUE.md, gamma-scaffold.md all consistent; paths resolve |
| Scope/non-goals consistent | yes | Documentation-only cycle; no new routes, packages, schema changes |
| Constraint strata consistent | yes | `synchronize: false`, `migrationsRun: false`, strict TypeScript — respected |
| Exceptions field-specific/reasoned | yes | C2 documented with reason ("no functional impact"); C1 fixed |
| Path resolution base explicit | yes | Repo root throughout; SMOKE.md uses `$BASE` variable, repo-relative paths |
| Proof shape adequate | partial | AC2/web confirmed 33/33 independently; AC3 has a provable execution gap (F1) |
| Cross-surface projections updated | yes | PROJECT.md updated to cycle 9/10 state |
| No witness theater / false closure | yes | Test output pasted verbatim; decorator audit table is verifiable via grep |
| PR body matches branch files | n/a | Local-only repo; no PR |
| γ artifacts present (gamma-scaffold.md) | yes | `.cdd/unreleased/10/gamma-scaffold.md` present at commit `c2c4b7d` — rule 3.11b satisfied |

---

## §2.0 Issue Contract

### AC Coverage

| # | AC | In diff? | Status | Notes |
|---|----|----------|--------|-------|
| AC1 | README: Node 20, Docker, dev:db, dev:api, dev:web, test:all | yes (commit b4ca567 README edit) | PASS | All 6 items present. β independently verified. |
| AC2 | `npm run test:all` passes | no (no new tests) | PASS (partial β independence) | Web: 33/33 confirmed by β. API: 76/76 from α verbatim output; local-only repo, no CI to re-run api suite independently. Count consistent with prior cycle record. |
| AC3 | SMOKE.md exists covering full smoke path | yes (commit 4c3bb25) | FAIL | SMOKE.md exists and covers all 8 steps structurally; however missing `npm run migration:run -w apps/api` — see F1. |
| AC4 | Swagger covers all v1 endpoints | no (no decorator changes) | PASS | β independently grepped all 4 controllers: 12 routes, all decorated. |
| AC5 | No open contradictions | yes (commits b4ca567, 44e2a3e) | PARTIAL | C1 resolved ✅; C2 documented ✅. README Quick Start comment still says "watch mode" — same imprecision as C2 but in README (F2). |
| AC6 | PROJECT.md claims verified | yes (commit 44e2a3e) | PASS | Web component files verified to exist; Angular routes match app.routes.ts; cycle 6–9 decisions present; verified commands consistent with package.json. |

### Named Doc Updates

| Doc / File | In diff? | Status | Notes |
|------------|----------|--------|-------|
| `docs/SMOKE.md` | yes (new) | FAIL | Missing migration step — see F1 |
| `README.md` | yes (modified) | PASS (with F2 note) | Auth-header stub corrected ✅; "watch mode" inline comment not updated (F2) |
| `.cdd/PROJECT.md` | yes (modified) | PASS | Cycle 9 state: test counts, component map, routes, decisions, debt |
| `.cdd/unreleased/10/self-coherence.md` | yes (new) | PASS | AC evidence, CDD Trace, debt all present |

### CDD Artifact Contract

| Artifact | Required? | Present? | Notes |
|----------|-----------|----------|-------|
| `gamma-scaffold.md` | yes | yes | `c2c4b7d` ✅ |
| `alpha-prompt.md` | yes | yes | `c2c4b7d` ✅ |
| `beta-prompt.md` | yes | yes | `c2c4b7d` ✅ |
| `self-coherence.md` | yes | yes | `b527b07` ✅ |
| `beta-review.md` | yes | yes (this file) | β R1 |

### Active Skill Consistency

| Skill | Required by | Loaded? | Applied? | Notes |
|-------|-------------|---------|----------|-------|
| `CDD.md` | beta/SKILL.md | yes | yes | Canonical lifecycle reference |
| `beta/SKILL.md` | dispatch | yes | yes | β role surface |
| `review/SKILL.md` | beta/SKILL.md | yes | yes | Three-phase review orchestrator |

---

## Findings

| # | Finding | Evidence | Severity | Type |
|---|---------|----------|----------|------|
| F1 | **SMOKE.md missing migration step** — `migrationsRun: false` in `apps/api/src/app.module.ts` (line 28) means DB tables do not exist until `npm run migration:run -w apps/api` is run. SMOKE.md Setup section omits this step. An operator following SMOKE.md from a clean clone will receive a Postgres "relation 'projects' does not exist" error at Step 1 (POST /projects). AC3 requires every step to be operator-runnable without chat context — this fails that requirement. | `apps/api/src/app.module.ts:28` (`migrationsRun: false`); `docs/SMOKE.md` §Setup (no migration step present); STACK.md §Database ("Migrations: `npm run migration:run -w apps/api`") | D | judgment |
| F2 | **README Quick Start "watch mode" comment** — `README.md` Quick Start bash block: `npm run dev:api   # Start NestJS API in watch mode (port 3000)`. Actual script: `apps/api/package.json:8` (`start:dev = ts-node -r tsconfig-paths/register src/main.ts`; no file watcher). α documented C2 covering STACK.md's "watch mode" description but did not update the same imprecision in README. Both surfaces claim watch mode; neither is accurate. | `README.md` line 15 (Quick Start block); `apps/api/package.json:8`; α self-coherence §ACs AC5 C2 (names STACK.md only) | B | mechanical |

---

## Regressions Required (D-level)

**F1 — SMOKE.md missing migration step**

- **Positive case:** Add `npm run migration:run -w apps/api` to SMOKE.md Setup (after `dev:db`, before `dev:api`). Follow the smoke path from Step 1; Step 1 returns HTTP 201 with a project JSON object containing `id`, `name: "Smoke Project"`, `archived: false`.
- **Negative case:** Remove (or skip) the migration step. Follow the smoke path; Step 1 returns HTTP 500 with Postgres error "relation 'projects' does not exist" (or TypeORM equivalent). No project is created.

---

## Notes

**CI gate (rule 3.10):** Local-only repository — no remote, no GitHub Actions runs to query. `npm run test:web` confirmed 33/33 passing (β independent run). API suite (76/9) not independently re-runnable without a live Postgres instance; α's verbatim runner output accepted as provisional evidence, consistent with the cycle 5 baseline (76 api). Noting "provisional" per rule 3.10.

**Origin/main freshness (pre-merge gate row 2):** No remote configured (`git remote -v` returned empty). No `git fetch --verbose origin main` possible. No mid-session push risk; local canonical state is authoritative.

**Merge-test worktree (pre-merge gate row 3):** Not executed — REQUEST CHANGES verdict; merge not attempted this round.

**Implementation contract check (rule 7):** Documentation-only cycle. TypeScript axes not applicable (no TypeScript code authored). Package scope: `docs/` (new), `README.md`, `.cdd/PROJECT.md` — all within repo root workspace scope ✅. No new routes, no schema changes, no npm packages ✅. JSON/wire contract unchanged ✅.

**γ artifact gate (rule 3.11b):** `gamma-scaffold.md` present at `.cdd/unreleased/10/gamma-scaffold.md` (commit `c2c4b7d`) ✅.

---

## Required fixes before R2

1. **F1 (D) — Add migration step to SMOKE.md Setup:**
   Insert between the `dev:db` and `dev:api` lines:
   ```bash
   npm run migration:run -w apps/api   # Run DB migrations (required before first API start)
   ```

2. **F2 (B) — Fix README Quick Start watch-mode comment:**
   Change:
   ```
   npm run dev:api   # Start NestJS API in watch mode (port 3000)
   ```
   to accurately reflect ts-node:
   ```
   npm run dev:api   # Start NestJS API via ts-node (port 3000)
   ```
   (Same imprecision already documented as C2 for STACK.md; fix both for consistency.)
