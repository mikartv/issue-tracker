<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills]
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

## §ACs

Per-AC oracles run against branch HEAD at implementation commit `73e65bfb14ef9afaee2da78464b44cf78f88259b`.

### AC1 — `ng build --configuration=production` exits 0 with no NG8002 error

**Evidence:** Ran `cd apps/web && npx ng build --configuration=production` locally.

```
Application bundle generation complete. [2.518 seconds]
▲ [WARNING] bundle initial exceeded maximum budget. Budget 500.00 kB was not met by 269.88 kB with a total of 769.88 kB.
```

Exit code: 0. No NG8002 diagnostic. No other build errors. The budget warning was pre-existing (not introduced by this cycle) and is not a build error. **PASS.**

### AC2 — All existing 61 web tests pass

**Evidence:** Ran `npm run test:web` from repo root.

```
PASS src/app/api/api.service.spec.ts
PASS src/app/shared/chip.component.spec.ts
PASS src/app/app.component.spec.ts
PASS src/app/projects/projects-list.component.spec.ts
PASS src/app/issues/issue-detail.component.spec.ts
PASS src/app/projects/project-issues.component.spec.ts

Test Suites: 6 passed, 6 total
Tests:       61 passed, 61 total
Snapshots:   0 total
Time:        1.995 s, estimated 2 s
```

61 tests pass across 6 suites. No regressions. **PASS.**
