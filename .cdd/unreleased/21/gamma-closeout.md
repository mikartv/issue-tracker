---
cycle: 21
issue: "gh #11 — enhancement: move create-issue into a MatDialog triggered from a New Issue button"
role: γ
artifact: gamma-closeout
merge-sha: 90bc91b
---

<!-- section-manifest
  [x] §Cycle Summary
  [x] §Post-Merge Verification
  [x] §Close-out Triage Table
  [x] §Independent γ Process-Gap Check
  [x] §Cycle Iteration Triggers
  [x] §Skill Gap Candidate Dispositions
  [x] §Immediate Outputs
  [x] §Deferred Outputs
  [x] §Next MCA
  [x] §Hub Memory
-->

# γ Close-Out — Cycle 21

## Cycle Summary

- **Issue:** gh #11 — enhancement: move create-issue into a MatDialog triggered from a New Issue button
- **Mode:** design-and-build (4 ACs, small band, no split)
- **Review rounds:** 1 (R1 APPROVE, zero findings)
- **Findings:** 0
- **AC outcome:** AC1–AC4 PASS
- **Tests at merge:** 72 web (baseline 61, +11 net), 76 api (unchanged) = 148 total
- **Merge commit:** `90bc91b`
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

**What shipped:** `CreateIssueDialogComponent` — new standalone Angular dialog component with Title / Description / Priority / Assignee fields, submit (creates issue via `api.createIssue`, closes with result on success, shows archived message on 409 without closing), and cancel (closes with no args, no API call). `ProjectIssuesComponent` updated: inline always-visible create form removed; "New Issue" button added to header; `MatDialog.open(CreateIssueDialogComponent)` wired on click; `afterClosed()` triggers `loadIssues()` on result; `loadProject()` updated to set `projectArchived` from `project.archived`. Web test count: 61 → 72 (+11: −5 inline-form tests removed, +10 dialog unit tests, +3 parent AC1/AC2 tests).

---

## Post-Merge Verification

**CI on beta-closeout `436a998`:** completed / success — https://github.com/mikartv/issue-tracker/actions/runs/28526204130

Note: merge commit `90bc91b` itself has no separate CI run visible — β and α pushed `436a998` and `f6844e9` immediately after merge, likely superseding the merge SHA's run queue. The `436a998` run contains the full cycle 21 application code (beta-closeout.md adds only a `.cdd/` artifact); CI green at this state is the effective post-merge verification.

**CI on alpha-closeout `f6844e9`:** in_progress at γ close-out time — alpha-closeout adds only `.cdd/unreleased/21/alpha-closeout.md` (no code change); application code is identical to `436a998` which is CI-green.

**Jest test suite (local, pre-merge on cycle/21):** green; 72 web + 76 api = 148 total pass.

**`ng build` (AOT compilation):** PASS — exits 0, no NG8XXX errors. Bundle size warning (~811 kB vs 500 kB budget) is pre-existing from cycle 19 (CDK drag-and-drop); not a new defect.

---

## Close-out Triage Table

### α close-out findings

None. Implementation was clean — dialog component correct from scaffold draft; parent component rewrite straightforward.

**Disclosed items (informational, not findings):**
- `component['dialog']` private field access in tests — Angular 17 standalone `MatDialog` creates a separate injection hierarchy; `TestBed.inject(MatDialog)` returns a different instance. Pragmatic pattern disclosed in `self-coherence.md §Debt`. β assessed as NIT/informational (no fix required).
- `loadIssues()` made public — required for `afterClosed()` wiring and test spy; no encapsulation concern at this scope.

### β close-out findings

None. R1 APPROVE, zero findings. β confirmed all 4 ACs with code-level evidence.

**β observations (informational):**
1. `component['dialog']` spy pattern — Angular 17 standalone pattern; NIT only.
2. `CreateIssueDialogComponent` not in parent `imports[]` — correct (programmatic `MatDialog.open()` does not require host declaration).
3. `loadIssues()` made public — reasonable.

**Zero unresolved triage items at close.**

---

## Independent γ Process-Gap Check (§2.9)

**Q1 — Did this cycle reveal a recurring friction?**

No. The draft dialog files from the scaffold session materially reduced α's implementation burden — the γ scaffold-time draft pattern worked well. No friction pattern.

**Q2 — Was any gate too weak or too vague?**

No. The β ng-build gate (added in cycle 19, validated in cycle 20) fired correctly again — ng build passed with no NG8002. The gate is holding.

**Q3 — Did a role skill fail to prevent a finding?**

No. Zero findings, no skill miss.

**Q4 — Did coordination burden show a better mechanical path?**

The γ scaffold session produced near-complete draft component files (`create-issue-dialog.component.ts`, `create-issue-dialog.component.spec.ts`) that α adopted with minimal adjustment. This is the scaffold-as-draft pattern for design-and-build cycles and it worked well. No mechanical improvement needed.

No independent γ process-gap action required.

---

## Cycle Iteration Triggers

| Trigger | Fire condition | Status | Notes |
|---------|----------------|--------|-------|
| Review churn | rounds > 2 | **NOT FIRED** | 1 round |
| Mechanical overload | mechanical ratio > 20% AND ≥ 10 findings | **NOT FIRED** | 0 findings |
| Avoidable tooling failure | tooling/environment blocked cycle in preventable way | **NOT FIRED** | No tooling failures |
| Loaded-skill miss | loaded skill should have prevented a finding but did not | **NOT FIRED** | No findings |

No cycle iteration entries required. No `cdd-iteration.md` required (`protocol_gap_count == 0`). No INDEX.md row required.

---

## Skill Gap Candidate Dispositions

No skill gaps identified this cycle. Zero findings; no gate failures; no missed preventable errors.

---

## Immediate Outputs

Executed in this session:

1. **`gamma-scaffold.md` authored** — scaffold with implementation notes and draft component files for α.
2. **`alpha-prompt.md` authored and committed** — cycle 21 α dispatch prompt.
3. **`beta-prompt.md` authored and committed** — cycle 21 β dispatch prompt.
4. **`gamma-closeout.md` authored** — this document; closure declaration artifact for cycle 21.
5. **`PROJECT.md` to be updated** — test baseline and cycle 21 decision to be appended (below).

---

## Deferred Outputs

| Item | Type | Owner | First AC / condition |
|------|------|-------|----------------------|
| RELEASE.md + cycle directory move (§2.10 items 11, 12) | release artifact | γ/δ | Deferred — batch release; continuing batch with cycles 15, 17, 18, 19, 20, 21 |
| δ release-boundary preflight (§2.10 item 13) | gate | δ | After RELEASE.md + directory move committed |
| Batch-release PRAs | release artifact | γ | After batch release tag; write PRAs covering cycles 15, 17, 18, 19, 20, 21 |
| Branch cleanup: `cycle/21` remote | cleanup | γ/δ | Delete after close-out committed |
| CI `ng build` step for web job (O2 gap) | tooling / CI | δ (edit `.github/workflows/ci.yml`) | Add `npx ng build --configuration=production` step to web CI job; CI fails on NG8XXX errors (from cycle 20 deferred) |
| CI extension to feature branches (O1 gap) | structural | δ | Enable CI on `cycle/*` branch pushes in `.github/workflows/ci.yml` (from cycle 17 deferred) |
| Angular Material 18 upgrade (M3 `mat.define-theme`) | feature / future cycle | γ (future selection) | Cycle that upgrades @angular/material to 18+ (from cycle 14 deferred) |
| WCAG contrast audit for chip component | quality / accessibility | γ (future selection) | From cycle 17 deferred |
| Close-out dispatch prompt naming (§5.2) | process / coordination | γ (cnos PR) | Add explicit "α close-out prompt" template to `operator/SKILL.md §5.2 v0.1 overlay` (from cycle 17 deferred) |
| α close-out baseline sourcing | process / dispatch prompt | γ (next α close-out dispatch) | Add note: "Source pre-cycle test count from prior γ close-out baseline" (from cycle 18 deferred) |
| Dispatch-prompt reminder for `alpha/SKILL.md §2.5` | process / coordination | γ (next α dispatch) | One-line §2.5 reminder in α dispatch prompt (from cycle 17 deferred) |
| Dispatch-prompt rebase instruction | process / coordination | γ (next §5.2 dispatch) | From cycle 16 deferred |
| Bundle size: initial bundle > 500 kB budget | tooling | γ (future selection) | Pre-existing from CDK DragDrop (cycle 19); separate issue |

---

## Next MCA

**Candidate selection (`cnos.cds/skills/cds/CDS.md §"Selection function"`):**

| Candidate | Source | Rule clause | Priority | Decision |
|-----------|--------|-------------|----------|----------|
| gh #12 — issue-detail redesign sidebar | wave continuation | maximum-leverage rule — design wave (gh #11 → #12 → #13); gh #11 shipped | P2 | **Selected** |
| gh #13 — MatSnackBar toasts + empty/error states | wave continuation | maximum-leverage rule | P2 | Eligible; follows #12 |
| CI ng build + branch CI (O1/O2 gaps) | deferred tooling | operational-infrastructure — deferred since cycle 17/20; not P0 | P2 | Eligible; δ-side |

**Decisive clause:** Maximum-leverage rule — the design wave (gh #11 → #12 → #13) is underway. gh #11 shipped. gh #12 (issue-detail sidebar redesign) is the natural next step in the wave. No assessment-commitment from a prior close-out overrides this; cycle 20 left gh #12 as "wave continuation" eligible.

**Next MCA:** gh #12 — issue-detail redesign sidebar  
**Owner:** γ → α (next dispatch)  
**Branch:** `cycle/22` from `origin/main`  
**Rationale:** Wave continuation; design wave (gh #11 → #12 → #13) progressing sequentially.

---

## Hub Memory

**Daily reflection path:** `cn-sigma/threads/reflections/daily/20260701.md`  
**Content:** Cycle 21 γ close-out — gh #11 (create-issue MatDialog) shipped. AC1–AC4 PASS, 1 round, 0 findings. 72 web tests (baseline 61, +11). ng build exits 0. Draft component pattern from scaffold worked well. Next: gh #12 (issue-detail redesign sidebar).  
**cn-sigma push:** 403 — `origin/cn-sigma` denied; δ action required.

Cycle 21 closed. Next: cycle/22 — gh #12 (issue-detail redesign sidebar).
