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
