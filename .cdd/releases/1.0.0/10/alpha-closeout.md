---
cycle: 10
issue: "#10 — Integration smoke + README polish"
role: α
artifact: alpha-closeout
merge-sha: 468ffadb3d50583b4e3ac0a116defeabc9c2a1e4
beta-closeout-sha: 774bb1ca878ff2d38aff85834d1600b4565e1f78
---

# α Close-out — Cycle 10

## Cycle Summary

**Issue:** #10 — Integration smoke + README polish  
**Mode:** substantial (documentation-and-verification)  
**Rounds:** 3 (R1 REQUEST CHANGES → R2 REQUEST CHANGES → R3 APPROVED)  
**Findings:** F1 D, F2 B, F3 B — all resolved  
**ACs at merge:** 6/6 PASS  
**Tests at merge:** 109/109 (76 api + 33 web), 0 failures  
**Merge commit:** `468ffad`

---

## Findings Log

### F1 (D, judgment) — Config-to-runbook propagation miss

`docs/SMOKE.md` omitted `npm run migration:run -w apps/api` from the Setup section. Because `migrationsRun: false` in `apps/api/src/app.module.ts`, an operator following SMOKE.md from a clean clone receives a Postgres "relation does not exist" error at Step 1.

**Root surface:** STACK.md §Database documented the migration command. SMOKE.md authoring did not consult that surface. The AC3 oracle in `self-coherence.md` checked structural coverage (step categories present) but not operational completeness (each step executable from a clean clone given only the documented prerequisites).

**Resolution:** Migration step inserted between `dev:db` and `dev:api` in SMOKE.md §Setup — commit `c773cfc` (R2 fix round).

---

### F2 (B, mechanical) — Cross-surface peer enumeration incomplete at AC5 C2 fix

AC5 C2 audit named STACK.md as the authoritative site of the "watch mode" imprecision. α's fix round (R1→R2) applied the correction to STACK.md and README in a single commit (`84c90ad`) after β named README as a second peer. However, the F2 peer surface enumerated during the R1→R2 fix round covered README + STACK.md only.

**Pattern:** The claim "dev:api runs in watch mode" existed across three carriers — README Quick Start (line 17), README Startup sequence (line 55), and STACK.md §Dev ergonomics. The AC5 C2 self-coherence entry scoped to STACK.md as the imprecise surface; the README carriers were not enumerated at AC5 authoring time.

**Resolution:** README and STACK.md corrected — commit `84c90ad`. PROJECT.md §Known unknowns separately held a derived claim (see F3).

---

### F3 (B, mechanical/honest-claim) — Fix-round peer surface did not include PROJECT.md §Known unknowns

After `84c90ad` corrected STACK.md and README, PROJECT.md §Known unknowns line 124 still asserted the STACK.md watch-mode description was imprecise — the debt entry described a condition that no longer held.

**Pattern:** F3 is a direct extension of the F2 peer-enumeration escape. The F2 fix-round's §2.3 grep surface covered README and STACK.md; PROJECT.md §Known unknowns carried a derived fact-claim (the resolution of C2 was recorded as active debt) that was not in the enumeration surface. Two-finding chain from one peer-enumeration miss: F2 named the first two carriers; F3 named the third.

**Resolution:** PROJECT.md §Known unknowns line 124 updated to accurate resolution note — commit `501a474`.

---

## Friction Log

**Local-only repository.** No remote, no GitHub Actions. The API suite (76/76) was accepted as provisional across all three rounds — β could not independently re-run the api suite without a live Postgres CI runner. This is a structural project constraint, not a process gap.

**AC3 oracle scope.** The self-coherence AC3 oracle checked that SMOKE.md structurally covered the documented step categories. The operability gap (clean-clone executability from documented prerequisites only) was not part of the oracle definition. F1 is the direct consequence.

**AC5 C2 enumeration scope.** The C2 imprecision was first identified against STACK.md in the initial pass. The fix at R1 correctly applied to STACK.md + README, but the PROJECT.md §Known unknowns surface — which independently carried a claim about the same imprecision — was not enumerated during AC5 authoring or during the F2 fix-round. The §2.3 cross-surface repetition rule (same fact, multiple carriers) was applicable at both the original authoring pass and the fix-round.

**AC1 pre-cycle state.** AC1 oracle passed with no edit required — all six prerequisite and script items were already present in README before the cycle began. This is the expected outcome for a documentation-and-verification cycle targeting existing correct content; noting as a cycle-shape observation.

---

## Identity Trail

All α commits on `cycle/10` carry `alpha@issue-tracker.cdd.cnos`. All β artifact commits carry `beta@issue-tracker.cdd.cnos`. γ dispatch artifacts at `c2c4b7d` carry `gamma@issue-tracker.cdd.cnos`. Merge commit `468ffad` carries `beta@issue-tracker.cdd.cnos`. No identity drift observed across any role.
