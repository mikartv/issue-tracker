<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills, ACs, Self-check, Debt]
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

## §Self-check

**Did α's work push ambiguity onto β?**

No. The fix is a mechanical 2-character removal (`[` and `]`). The error message is explicit; the corrected form is standard Angular directive usage. Both ACs have concrete runner output as evidence. Nothing is left for β to discover.

**Is every claim backed by evidence in the diff?**

Yes.
- The fix: `git diff origin/main -- apps/web/src/app/projects/project-issues.component.ts` shows exactly one line changed (`-          <div class="board" [cdkDropListGroup]>` → `+          <div class="board" cdkDropListGroup>`).
- AC1 evidence: ng build output pasted verbatim above, exit 0.
- AC2 evidence: jest runner output pasted verbatim above, 61/61 pass.

**Peer enumeration:**

γ scaffold confirmed via grep: `[cdkDropListGroup]` appears exactly once in the codebase. No other occurrences in templates or TS files. Peer set = {one occurrence at line 51}. Fixed. No peers exempt.

**Harness audit:**

No schema-bearing contract changed. No harness audit required.

**Implementation contract compliance:**

- Language: TypeScript (strict) — unchanged file, bracket removal only.
- Package scoping: `apps/web/` only — one file touched.
- Runtime dependencies: no changes to imports or dependencies.
- JSON/wire contract: no API changes.
- Backward-compat: 61 existing tests pass.

## §Debt

**Known debt:**

1. **Bundle size warning** — `ng build` emits `[WARNING] bundle initial exceeded maximum budget. Budget 500.00 kB was not met by 269.88 kB`. This is a pre-existing condition introduced when CDK drag-and-drop was added in cycle 19 (gh #10). Out of scope for this fix cycle. Deferred as a separate issue.

2. **ng build CI step** — CI workflow does not run `ng build`; the NG8002 defect went undetected at merge time because Jest tests do not trigger AOT. Adding an `ng build` step to `.github/workflows/ci.yml` is deferred per issue non-goals (separate issue).

3. **Provisional α close-out** — α exits after signaling review-readiness per bounded dispatch model. `alpha-closeout.md` will be written on re-dispatch after β merge.

No loaded skill would have prevented the known debt items — they are architectural gaps in CI coverage, not authoring failures.

## §CDD Trace

| Step | Role | Artifact | SHA / evidence |
|------|------|----------|----------------|
| 1 — Receive | α | Read issue gh #14, γ-scaffold, PROJECT.md, STACK.md, CDD.md, alpha/SKILL.md | branch `cycle/20`; base `8992715` |
| 2 — Gap identified | α | Gap: NG8002 from `[cdkDropListGroup]` bracket syntax; fix: remove brackets | — |
| 3 — Peer enumeration | α | `grep -rn 'cdkDropListGroup' apps/web/` → 1 occurrence; no peers exempt | γ-scaffold §Peer enumeration |
| 4 — Implementation | α | `apps/web/src/app/projects/project-issues.component.ts` line 51: `[cdkDropListGroup]` → `cdkDropListGroup` | commit `73e65bf` |
| 5 — AC1 oracle | α | `cd apps/web && npx ng build --configuration=production` → exit 0, no NG8002 | output in §ACs |
| 6 — AC2 oracle | α | `npm run test:web` → 61/61 pass, 6 suites | output in §ACs |
| 7 — Self-coherence | α | `.cdd/unreleased/20/self-coherence.md` (this file) | commits `0f5323f` → `aa2bd1a` |

**Diff scope (from `git diff origin/main -- apps/web/src/app/projects/project-issues.component.ts | grep -c '^[+-]'`):** 4 lines (2 hunk-header `---`/`+++` lines + 1 removed + 1 added)

**Files touched (`git diff origin/main --stat HEAD`):**
- `apps/web/src/app/projects/project-issues.component.ts` — 1 line changed (implementation)
- `.cdd/unreleased/20/self-coherence.md` — this file (α artifact)
- `.cdd/unreleased/20/alpha-prompt.md`, `beta-prompt.md`, `gamma-scaffold.md` — γ-authored; present on branch, not α-modified

**Caller-path trace:** `cdkDropListGroup` is a directive applied to a host element in the template; it has no TS caller path to enumerate — Angular's template compiler binds it at AOT time. The directive usage is consumed by the board UI (visible in the component template; tested implicitly by the project-issues component spec).

**Git identity:** `git log -1 --format='%ae' HEAD` → `alpha@issue-tracker.cdd.cnos` ✓

**γ-artifact:** `.cdd/unreleased/20/gamma-scaffold.md` present on `origin/cycle/20` — canonical §5.1 path ✓
