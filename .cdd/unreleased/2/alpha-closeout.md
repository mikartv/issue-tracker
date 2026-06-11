# α Close-out — Cycle 2 | DB schema + migrations

**Merge commit:** `647f76a`  
**Merged:** `cycle/2` → `main`  
**Issue:** Issue 2 — DB schema + migrations  
**Review rounds:** 2  
**Verdict:** APPROVED (Round 2)

---

## §Summary

Cycle 2 added the full TypeORM persistence layer to the NestJS scaffold delivered in cycle 1: three entities (`Project`, `Issue`, `Comment`), one initial migration (`20260610000000-InitialSchema.ts`), `AppDataSource` wiring, `migration:run`/`migration:revert` npm scripts, and an integration test covering round-trip save/read per entity against a real Postgres instance. All 6 ACs were met. The cycle ran 2 review rounds. F1 (C-severity, honest-claim) was the single RC finding; it was resolved in the fix round at commit `0c12c93`. F2 (B-severity, ci-status — no origin remote, no hosted CI run) was deferred per D-CY2-2 and did not affect the APPROVED verdict. Merge commit `647f76a` closes Issue 2.

---

## §Friction log

### FR-1 — Honest-claim violation: §Design D4

`self-coherence.md §Design D4` stated that `data-source.ts` contains a runtime guard that throws a named error when `DATABASE_URL` is absent. The code at the time of the R1 review did not implement this guard; it passed `process.env['DATABASE_URL']` directly to the `DataSource` constructor. β issued F1 (C, honest-claim) at Round 1. α chose Option A (implement the guard rather than correct the doc). Commit `0c12c93` extracted `dbUrl`, added an explicit `if (!dbUrl) throw new Error(...)` before the constructor call, and used `dbUrl` as the `url` field. Commit `b20f874` stamped the fix-round SHA in `self-coherence.md`. The D4 claim was accurate at the time of the Round 2 read.

**Class:** Artifact claims behavior that the code does not yet deliver at review-signal time.  
**Surface affected:** `apps/api/src/data-source.ts` vs `self-coherence.md §Design D4`.  
**Resolution path:** One fix-round commit; no side effects on other ACs or consumers.

### FR-2 — Deferred finding: no hosted CI (D-CY2-2)

No origin remote existed during cycle 2. GitHub Actions never ran against the `cycle/2` branch. AC5 was verified locally with `docker compose up -d db` and test output pasted verbatim in `self-coherence.md §ACs`. β accepted AC5 via code inspection + α-supplied output and deferred F2 per the D-CY2-2 design-scope debt declaration. This is a standing structural constraint of the project at this stage, not a cycle omission.

**Class:** CI-status gap carried by a project-level architectural decision (no remote).  
**Surface affected:** None (no code change needed).  
**Status:** Carries forward to γ PRA as D-CY2-2.

---

## §Observations

### O1 — D4 guard written in §Design before implementation was complete

§Design D4 described the `DATABASE_URL` runtime guard as an architectural intent. The guard was not yet implemented when the §Design section was committed. The self-coherence §Design section and the code diverged between §Design authorship and the review-readiness signal. F1 is a direct consequence of that gap.

### O2 — Option A (implement) vs Option B (correct doc)

β offered two fix options. α chose Option A. The resulting state — guard implemented, D4 claim accurate — is stronger than Option B would have produced (doc corrected, guard absent).

### O3 — F2 deferred by structural constraint, not by cycle scope narrowing

F2 is not a cycle-2 scope item; the absence of an origin remote is a project-level decision that predates this cycle. The deferral record at D-CY2-2 was present in `self-coherence.md §Debt` before β read the branch. The deferral was clean: β accepted it under review rule 3.3 exception at R1 and carried the finding to the close-out record without blocking APPROVED.

### O4 — Two-round count is within normal range for a 6-AC design-and-build cycle

Round 1 issued one C-severity finding; Round 2 narrowed to F1 only and issued APPROVED. No D-severity regressions were required.

### O5 — Design decisions documented before implementation commits

All five §Design decisions (D1–D5) were committed in `d5808d4` before the implementation commits (`0afd33a`, `3e5f907`). β's contract-integrity check found all design decisions "field-specific/reasoned" (§2.0.0 table row). The only exception was D4, which described a guard that was written after the §Design commit.

### O6 — β worktree identity leak (β-side observation, noted for cycle record)

β's merge-test worktree was configured with a distinct local identity (`beta-merge-test@issue-tracker.cdd.cnos`). On `git worktree remove --force`, the worktree's local identity leaked into the shared `.git/config`. β caught this and re-asserted `beta@issue-tracker.cdd.cnos` before executing the merge. Noted in β close-out §Process Observations and in the β review §Pre-merge Gate row 1 note. This is a β-side event; α's commits carry `alpha@issue-tracker.cdd.cnos` throughout.
