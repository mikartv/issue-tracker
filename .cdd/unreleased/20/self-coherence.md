<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap]
-->

# Self-coherence — Cycle 20

## §Gap

**Issue:** gh #14 — fix: cdkDropListGroup bracket syntax breaks ng build (NG8002)

**Version / mode:** cycle/20, single-file template fix (P0 build-breaking defect)

**Gap statement:** `[cdkDropListGroup]` on line 51 of `project-issues.component.ts` uses bracket syntax (property-binding form), but `cdkDropListGroup` is a directive selector, not an input property. Angular's AOT compiler rejects this with NG8002. Jest tests do not trigger AOT compilation, so the defect survived to merge undetected. The fix is a 2-character removal of `[` and `]`.

**Scope:** `apps/web/` only. One line changed in one file. No API changes. No new tests required.

## §Skills

**Tier 1a (loaded as hard constraints before implementation):**

- `cnos.cdd/skills/cdd/CDD.md` — CDD kernel (recursive coherence cell protocol)
- `cnos.cdd/skills/cdd/alpha/SKILL.md` — α role surface (produce, prove, gate, review loop, close-out)

**Tier 2 (always-applicable):**

- `.cdd/PROJECT.md` — verified repo map and test baselines
- `.cdd/STACK.md` — pinned conventions, implementation contract quick reference, α-rules

**Tier 3 (issue-specific):**

- `.cdd/unreleased/20/gamma-scaffold.md` — γ scaffold: peer enumeration, AC oracle approach, surface list

**Design:** not required — single-file 2-char syntax correction, no impact graph.
**Plan:** not required — one line, one file, no sequencing complexity.
