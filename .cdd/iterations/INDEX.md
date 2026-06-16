# .cdd/iterations/INDEX.md

Aggregator: one row per cycle that produced a `cdd-iteration.md` artifact
(i.e. cycles where `protocol_gap_count > 0`).

Per `epsilon/SKILL.md §1`: a `cdd-iteration.md` is required only when the cycle
receipt has `protocol_gap_count > 0` — findings of type `cdd-skill-gap`,
`cdd-protocol-gap`, `cdd-tooling-gap`, or `cdd-metric-gap`.

---

## Confirmed entries (v1.0.0 release)

| Cycle | Issue | Date | Findings | Gap type | Proposed patches | MCAs committed | No-patch | Path |
|-------|-------|------|----------|----------|------------------|----------------|----------|------|
| 10 | #10 — Integration smoke + README polish | 2026-06-14 | 3 (F1 D: runbook operability, F2 B: watch-mode, F3 B: peer-enumeration) | cdd-skill-gap (loaded-skill miss: α peer-enumeration rule + runbook-AC oracle scope) | 2 (α/SKILL.md §2.3 derived-fact carriers; AC oracle operability check) | 1 (bundled — runbook operability + peer-enumeration) | 0 | .cdd/releases/1.0.0/10/ |

---

## Retroactive audit status — cycles 1–9

_Full retroactive audit of cycles 1–9 is planned for the ε=δ pass (Step 3 in
`ПЛАН-следующий-этап.md`). Cycles below are flagged as candidates based on
gamma-closeout review; `cdd-iteration.md` files not yet written._

| Cycle | Candidate reason | Audit status |
|-------|-----------------|--------------|
| 1 | F1 B (honest-claim): §Debt D2 guard claimed not present in code | Pending |
| 2 | F1 C (honest-claim): DATABASE_URL guard claimed not implemented | Pending |
| 3 | F1 A (honest-claim): test-count off by 1 (7→8 cases) | Pending |
| 4 | B4-A1 A (advisory): grep attribution wrong — count correct, no action | Likely no gap (advisory/drop) |
| 5 | 0 findings | No gap |
| 6 | 0 findings | No gap |
| 7 | 0 findings | No gap |
| 8 | NIT-1, NIT-2 + identity drift (not caught by β) | Pending — identity miss is a candidate cdd-protocol-gap |
| 9 | F1 NIT (test coverage) | Likely no gap (judgment call, not skill miss) |

_Note: Cycles 1–3 honest-claim findings were caught and resolved by β R1 in each
case — the review loop worked correctly. Whether these constitute `cdd-skill-gap`
(α oracle scope) vs. normal operating tolerance is the question for the ε=δ audit._
