# α Dispatch — Cycle 2

```
You are α. Project: issue-tracker.
Load ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md and follow its load order.
Issue: Read .cdd/issues/2/ISSUE.md from repo root (full contract: gap, AC, non-goals).
Branch: cycle/2
Tier 3 skills:
  - ../cn-sigma/.cn/vendor/packages/cnos.core/skills/write/SKILL.md
  - ../cn-sigma/.cn/vendor/packages/cnos.eng/skills/eng/typescript/SKILL.md
  - ../cn-sigma/.cn/vendor/packages/cnos.eng/skills/eng/test/SKILL.md
```

## Implementation contract (pinned by δ; α MUST NOT improvise)

| Axis | Pinned value |
|------|--------------|
| Language | TypeScript strict (`"strict": true`; `"emitDecoratorMetadata": true`; `"experimentalDecorators": true` required for TypeORM decorators — verify in `apps/api/tsconfig.json` and patch if absent) |
| CLI integration target | N/A |
| Package scoping | New files in `apps/api/src/entities/` and `apps/api/src/migrations/` only; no new dirs outside these paths except `apps/api/src/data-source.ts` at src root |
| Existing-binary disposition | Extend cycle-1 Nest scaffold only; do NOT modify health module, UserEmailMiddleware, or any cycle-1 test files |
| Runtime dependencies | Add `typeorm@^0.3`, `@nestjs/typeorm@^10`, `pg@^8` to `apps/api/package.json`; no other new runtime deps |
| JSON/wire contract preservation | N/A — no HTTP business routes this cycle; `GET /api/v1/health` remains unchanged |
| Backward-compat invariant | N/A |

Entity columns MUST match `.cdd/SCOPE.md` §Data model (v1) exactly.

## Context for δ

- Allowed tools: `--allowedTools "Read,Write,Bash"`
- Git identity for α commits: `Alpha <alpha@issue-tracker.cdd.cnos>`
- Mode: design-and-build, typical (6 ACs)
- Branch: `cycle/2` — already exists on origin; γ created it. α does NOT create the branch.
  - Run: `git fetch origin cycle/2 && git switch cycle/2`
- Working directory: repo root of `issue-tracker` (`/home/mihail/Projects/usurobor/issue-tracker`).
- HUB (skill source): `../cn-sigma` relative to repo root (or `/home/mihail/Projects/usurobor/cn-sigma`).
- `.cdd/unreleased/2/gamma-scaffold.md` is already on `origin/cycle/2` — α does NOT create or modify it.
- Write `.cdd/unreleased/2/self-coherence.md` incrementally: one section per commit+push (§Gap, §Design, §Skills, §ACs, §Self-check, §Debt, §CDD Trace). Do NOT batch all sections into one commit — session timeout will discard partial work.
- On review-readiness: append the review-readiness section to `.cdd/unreleased/2/self-coherence.md` as a final separate commit+push.
- Test database: `DATABASE_URL=postgresql://issue_tracker:issue_tracker@localhost:5432/issue_tracker` — matches CI (Postgres service container) and local `docker compose up -d db`. The AC5 integration test MUST use this real database; no mocking or in-memory substitution.

## Key source-of-truth files α must read before implementing

1. `.cdd/issues/2/ISSUE.md` — the issue contract (gap, ACs, non-goals, pinned implementation contract)
2. `.cdd/SCOPE.md` — §Data model (v1): exact entity fields, enums, constraints (entity columns MUST match exactly)
3. `.cdd/STACK.md` — TypeORM paths, `synchronize: false` rule, migration scripts, enum storage pattern (`varchar`)
4. `.cdd/PROJECT.md` — verified repo map; update `Last verified` date and Migrations entry after implementing

## Design constraints α must enforce

- `synchronize: false` in every TypeOrmModule.forRoot and DataSource config — HARD constraint; never true in any file
- Enums (`status`: open/in_progress/done/closed default open; `priority`: low/medium/high/critical default medium) stored as varchar columns with TypeORM enum type (`{ type: 'varchar', enum: [...] }`)
- All PKs: `@PrimaryGeneratedColumn('uuid')`
- All timestamps: `@CreateDateColumn({ type: 'timestamptz' })` / `@UpdateDateColumn({ type: 'timestamptz' })`
- `Comment.updated_at`: SCOPE says "no updated_at semantics (immutable in v1)" — α decides (present-but-set-once OR absent) and documents the decision in §Design of self-coherence.md before first implementation commit
- FKs: `Issue.project_id` → `Project.id` (CASCADE delete or RESTRICT — α decides and documents); `Comment.issue_id` → `Issue.id`
- A `data-source.ts` file at a resolvable path is required for `migration:run` / `migration:revert` CLI scripts
- AC5 integration test: create a DataSource, run migrations, insert one fixture row per entity, read back and assert all fields round-trip, then clean up (drop schema or delete rows)
- AC6: no project/issue/comment controllers; `GET /api/v1/health` remains the only route

## Carry-forward debt from cycle 1 (awareness only — do NOT fix in this cycle)

- D1: `as unknown as X` cast in `user-email.middleware.spec.ts` — minor; out of scope
- D4: No GitHub remote; cloud CI not yet executed
- D5: `supertest@6.3.4` deprecation warning — carry-forward until e2e tests land

## Dispatch note

δ: before routing, confirm `gamma-scaffold.md` exists on the branch:
```bash
git ls-tree -r --name-only origin/cycle/2 .cdd/unreleased/2/gamma-scaffold.md
```
Invoke α with `claude -p` in the `issue-tracker` repo root. α must run `npm install` (from repo root) after adding deps to `apps/api/package.json` to update `package-lock.json`. α must run `npm run test:api` with `DATABASE_URL` set locally to verify AC5 before signaling review-readiness.
