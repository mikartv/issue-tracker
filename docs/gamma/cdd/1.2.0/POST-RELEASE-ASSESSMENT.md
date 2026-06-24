---
release: 1.2.0
role: γ
artifact: post-release-assessment
date: 2026-06-22
cycles: 1 (14)
tests_at_release: 118 (76 api + 42 web)
---

# Post-Release Assessment — issue-tracker 1.2.0

**CI status on merge SHA:**
- Cycle 14: merge `32fb13a` → CI green on `dabe75c` — [run/27951960494](https://github.com/mikartv/issue-tracker/actions/runs/27951960494) (2026-06-22T12:16:27Z)

---

### 1. Coherence Measurement

- **Baseline:** 1.1.0 — α A, β A, γ A- (C_Σ A, L5)
- **This release:** 1.2.0 — α A, β A, γ A- (C_Σ A, L6)
- **Delta:**
  - α: A → A. Single design-and-build cycle, 1 round, 0 RC findings. The M3/M2 API discovery (mat.define-theme absent from AM17) was handled via §Debt; β accepted at R1. Diff scope matched γ scaffold prediction exactly.
  - β: A → A. 0 findings, 1 round. O1 (CI on feature branches) correctly carried as a structural gap, not raised as a finding. Git-author check applied.
  - γ: A- → A- (§5.2 ceiling unchanged). Scaffold peer enumeration and oracle prediction were accurate; API-availability check for `mat.define-theme` was not performed at scaffold time — minor friction, not a protocol gap (α self-corrected via §Debt; no RC round cost).
  - Level: L5 → L6 (one cycle vs three — regression in delivery volume; acceptable for a single-cycle design-foundation release).
  - C_Σ: A → A. Geometric mean unchanged; individual scores held.

- **Coherence contract closed?** Yes. gh #4 (design-system foundation) shipped a custom Angular Material M2 theme and a 17-token CSS custom-property layer. The layer (`--it-status-*`, `--it-priority-*`, `--it-space-*`, `--it-radius-*`, `--it-shadow-*`, `--it-surface`, `--it-background`) is now the canonical R1 design dependency for the R2–R8 redesign wave.

---

### 2. Encoding Lag

| Issue | Title | Type | Design | Impl | Lag |
|-------|-------|------|--------|------|-----|
| D-CY2-4 | ORM `@ManyToOne`/`@OneToMany` decorators | feature | none | not started | stale |
| C10-deferred | E2E automation | feature | none | not started | growing |
| C13-debt | Automated root redirect test | test | trivial | not started | low |
| C12-debt | Duplicate test names in `issue-detail.component.spec.ts` | process | none | not started | low |
| R2–R8 wave | Redesign remaining components with R1 tokens | feature | partial (cycle 14 root) | not started | growing |
| AM18 upgrade | `mat.define-theme` M3 API adoption | feature | deferred | not started | growing |
| O1 | CI extension to feature branches | process | clear | not started | growing |

**MCI/MCA balance:** Balanced. R1 design-token layer shipped; R2–R8 redesign wave is unblocked. No design commitments outstanding that outrun implementations. The 3:1 freeze threshold is not met (no "SHALL" enforcement pending). Continue — next cycle selects R2.

---

### 3. Process Learning

**What went wrong:** The γ scaffold and issue body asserted `mat.define-theme` ships with `@angular/material 17.3.10` without verification. It does not. α discovered this empirically and self-corrected via §Debt; β accepted at R1. No RC round lost.

**Root cause:** §2.2a peer-enumeration does not currently require API-method availability checks (grep of `node_modules`) for newly cited APIs in design-and-build mode. The pattern is low-frequency (first occurrence in 14 cycles) and the self-correction mechanism handled it. γ-closeout §2.9 assessment: no patch now; revisit if pattern recurs in next 2–3 design-and-build cycles.

**What went right:** Scaffold peer enumeration (`rg "mat-card|mat-grid|css.*grid"`, `rg "--it-"`) was accurate. Observable oracle (custom palette applied, `indigo-pink` absent) was precise. β applied git-author check correctly. Single-round cycle at design-and-build scope.

**Skill patches:** None. No loaded-skill miss trigger fired. No recurring pattern at threshold.

---

### 4. Review Quality

**Cycles this release:** 1 (C14)
**Avg review rounds:** 1.0 (**MET** — target ≤2 code)
**Superseded cycles:** 0 (**MET**)

| Cycle | Issue | Mode | Rounds | Findings (R1) | Notes |
|-------|-------|------|--------|---------------|-------|
| 14 | gh #4 — design-system foundation | design-and-build / small-change | 1 | 0 RC, 1 obs (O1 CI gap) | M3/M2 fallback self-corrected via §Debt; O1 is structural |

**Finding-class breakdown:**

| Class | Count |
|-------|-------|
| honest-claim | 0 |
| mechanical | 0 |
| wiring | 0 |
| judgment | 0 |
| contract | 0 |

**Action:** none.

---

### 4a. CDD Self-Coherence

- **CDD α:** 4/4 — All artifacts present; diff scope exact; no honest-claim violations; M3 gap disclosed in §Debt; pre-review gate clean; git identity correct.
- **CDD β:** 4/4 — 0 findings; O1 correctly classified structural (not a protocol gap); git-author check applied; wiring check performed; R1 APPROVE.
- **CDD γ:** 4/4 — Scaffold accurate on all surfaces except API availability (not a §2.2a requirement); peer enumeration correct; selection clause named; §5.2 ceiling applied.
- **Weakest axis:** γ (structural §5.2 ceiling — not a quality signal). All axes 4/4 on concrete checks.
- **Action:** none.

---

### 4b. Cycle Iteration

No trigger fired. 1 round, 0 RC findings, CI green, no tooling block, no loaded-skill miss.

---

### 5. Production Verification

**Scenario:** Angular Material M2 theme active; 17 CSS custom properties available globally.

**Before this release:** Default Angular styles only (`styles.css`); no theme; raw enum strings in UI (already fixed in 1.1.0); no `--it-*` tokens.

**After this release:** Custom deep-purple/amber M2 theme applied via `mat.define-light-theme`; 17 `--it-*` tokens on `:root`; global `box-sizing: border-box`.

**How to verify:**
```
docker compose up -d db
npm run dev:api
npm run dev:web
# Open http://localhost:4200/projects
```
1. DevTools → Computed → `:root` — confirm `--it-status-open`, `--it-priority-critical`, `--it-space-4`, etc. are present.
2. Material components (buttons, form fields) render with deep-purple primary colour.
3. `indigo-pink.css` is NOT loaded — confirm in DevTools Network tab.

**Result:** DEFERRED — browser environment not available in this assessment session. CI green on merge SHA `32fb13a` serves as automated build verification. Manual token inspection deferred to operator.

---

### 6. Next Move

**Next cycle:** R2 redesign wave — apply R1 tokens to the first component (Projects screen card grid). Filed as gh #5 → cycle 15.

**Deferred outputs carried forward:**
- AM18 upgrade (mat.define-theme M3) — future cycle
- CI on feature branches (O1) — δ infrastructure
- 1.2.0 PRA (this document) — written retroactively 2026-06-24 per deferred output commitment from cycle 14 γ-closeout

**Owner:** γ (next cycle dispatch).
**MCI frozen?** No — balanced.
