# α Dispatch — Cycle 1

```
You are α. Project: issue-tracker.
Load ../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md and follow its load order.
Issue: Read .cdd/issues/1/ISSUE.md from repo root (full contract: gap, AC, non-goals).
Branch: cycle/1
Tier 3 skills:
  - ../cn-sigma/.cn/vendor/packages/cnos.core/skills/write/SKILL.md
  - ../cn-sigma/.cn/vendor/packages/cnos.eng/skills/eng/typescript/SKILL.md
  - ../cn-sigma/.cn/vendor/packages/cnos.eng/skills/eng/test/SKILL.md
```

## Implementation contract (pinned by δ; α MUST NOT improvise)

| Axis | Pinned value |
|---|---|
| Language | TypeScript strict (`"strict": true` in tsconfig.json for both apps) |
| CLI integration target | N/A — standalone web application; not a `cn` subcommand |
| Package scoping | npm workspaces: root `package.json`; `apps/api/` (NestJS 10); `apps/web/` (Angular 17) |
| Existing-binary disposition | N/A — greenfield; no existing code to preserve or replace |
| Runtime dependencies | Node 20 LTS, NestJS 10.x, Angular 17.x, PostgreSQL 16 (Docker only); `class-validator`, `class-transformer`, `@nestjs/config`, `@nestjs/swagger` in apps/api; Jest in both apps |
| JSON/wire contract preservation | `GET /api/v1/health` → HTTP 200 `{ "status": "ok" }`; error shape per `.cdd/STACK.md` §Error response shape; API prefix `/api/v1` set globally in `main.ts` |
| Backward-compat invariant | N/A — greenfield; no prior API consumers |

## Context for δ

- Allowed tools: `--allowedTools "Read,Write,Bash"`
- Git identity for α commits: `Alpha <alpha@issue-tracker.cdd.cnos>`
- Mode: design-and-build, substantial (10 ACs; full monorepo skeleton to create from scratch).
- Branch: `cycle/1` — already exists on origin; γ created it. α does NOT create the branch.
  - Run: `git fetch origin cycle/1 && git switch cycle/1`
- Working directory: repo root of `issue-tracker` (`/home/mihail/Projects/usurobor/issue-tracker`).
- HUB (skill source): `../cn-sigma` relative to repo root (or `/home/mihail/Projects/usurobor/cn-sigma`).
- `.cdd/unreleased/1/gamma-scaffold.md` is already on `origin/cycle/1` — α does NOT create or modify it.
- Write `.cdd/unreleased/1/self-coherence.md` incrementally: one section per commit+push (§Gap, §Skills, §ACs, §Self-check, §Debt, §CDD Trace). Do NOT batch all sections into one commit — session timeout will discard partial work.
- On review-readiness: append the review-readiness section to `.cdd/unreleased/1/self-coherence.md` as a final separate commit+push.

## Key source-of-truth files α must read before implementing

1. `.cdd/issues/1/ISSUE.md` — the issue contract (gap, ACs, non-goals, pinned implementation contract)
2. `.cdd/STACK.md` — stack pins, monorepo layout, backend/frontend conventions, error shape, middleware spec
3. `.cdd/SCOPE.md` — product boundary, non-goals, data model
4. `.cdd/PROJECT.md` — update with verified commands after scaffold

## Dispatch note

δ: before routing, confirm `gamma-scaffold.md` exists on the branch:
```bash
git ls-tree -r --name-only origin/cycle/1 .cdd/unreleased/1/gamma-scaffold.md
```
Invoke α with `claude -p` in the `issue-tracker` repo root. This cycle creates the entire monorepo skeleton — it is the heaviest scaffolding cycle. α should install NestJS and Angular CLI scaffolding tools via Bash if needed (`npx @nestjs/cli new` / `npx @angular/cli new` or manual `npm init` + known file structures). α must push self-coherence.md in incremental commits to avoid losing work to context limits.
