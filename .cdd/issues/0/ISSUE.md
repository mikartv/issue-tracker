# Issue 0 — Bootstrap docs + README skeleton

**Mode:** design-and-build  
**Status:** open  
**Branch:** cycle/0

## Problem

**What exists:** Draft `.cdd/SCOPE.md`, `.cdd/STACK.md`, `.cdd/ISSUES.md`, and per-cycle contracts 1–10 without README, PROJECT MCP, or CDD dispatch binding.  
**What is expected:** Auditable project contracts, README skeleton, PROJECT MCP placeholder, and dispatch conventions so cycle 1 can scaffold without re-deciding scope or stack.  
**Where they diverge:** Missing root `README.md`, `.cdd/PROJECT.md`, STACK dispatch section; archive semantics were inconsistent (fixed in SCOPE + Issue 3).

## Source of truth

| Claim | Canonical |
|-------|-----------|
| Product scope | `.cdd/SCOPE.md` |
| Stack pins | `.cdd/STACK.md` |
| Cycle index | `.cdd/ISSUES.md` |
| Dispatch binding | `.cdd/STACK.md` §CDD dispatch |
| Project MCP | `.cdd/PROJECT.md` |

## Acceptance Criteria

- [ ] AC1: `.cdd/SCOPE.md`, `.cdd/STACK.md`, `.cdd/ISSUES.md` are mutually consistent (no contradictory pins)
- [ ] AC2: Root `README.md` exists with sections: Prerequisites, Quick start (placeholder commands), Project structure, CDD cycles pointer to `.cdd/ISSUES.md`
- [ ] AC3: `.cdd/PROJECT.md` skeleton exists; `Last verified` notes docs-only until cycle 1 adds code
- [ ] AC4: `.cdd/STACK.md` §CDD dispatch documents local `.cdd/issues/N/ISSUE.md` reference (not `gh issue view`)
- [ ] AC5: `.cdd/issues/1/ISSUE.md` dispatch-ready (gap + AC + non-goals + implementation contract)
- [ ] AC6: No `apps/` directory or application code in this cycle

## Non-goals

- NestJS / Angular scaffold
- docker-compose
- CI workflow
- DATABASE_URL or migrations
- Verified build/test commands in PROJECT.md (cycle 1)

## Closure

All AC met; artifacts committed on `cycle/0`; operator confirms README + contracts readable without chat context.
