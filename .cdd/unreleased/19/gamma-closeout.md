---
cycle: 19
issue: "gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop"
role: γ
artifact: gamma-closeout
merge-sha: 0ad9dab87726b87ce1a9b252219e7e1ead47f891
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

# γ Close-Out — Cycle 19

## Cycle Summary

- **Issue:** gh #10 — enhancement: Kanban board view for project issues with cdk drag-and-drop
- **Mode:** design-and-build (5 ACs)
- **Review rounds:** 3 (R1 REQUEST CHANGES, R2 REQUEST CHANGES, R3 APPROVE)
- **Findings:** 3 (A-1 mechanical, B-1 honest-claim B, B-2 honest-claim B); all resolved by R3
- **AC outcome:** AC1–AC5 PASS
- **Tests at merge:** 61 web (net +14 from baseline 47), 76 api (unchanged) = 137 total
- **Merge commit:** `0ad9dab87726b87ce1a9b252219e7e1ead47f891`
- **Post-merge defect:** `ng build` fails — NG8002 on `[cdkDropListGroup]` in the board template (confirmed by δ post-merge observation; Jest tests unaffected; fix must go through α next cycle)
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

**What shipped:** `ApiService.getProject(id)` calling `GET /projects/:id`; full rewrite of `ProjectIssuesComponent` from `mat-table` to a four-column `cdkDropList` Kanban board with `cdkDrag` cards (title link, priority chip, assignee), optimistic drop handler with rollback, "Issues — {name}" heading via `getProject`, horizontal scroll. Test suite rewritten: 21 tests covering AC1–AC5 plus retained create-issue coverage; +1 test for `getProject` in `api.service.spec.ts`.

---

## Post-Merge Verification

**CI status on merge SHA `0ad9dab`:** no direct CI run found in the visible run history (merge may have been batched or the run was displaced by subsequent commits). CI on immediately subsequent main commits:

- SHA `6e5f87b` (beta-closeout) — **SUCCESS** — https://github.com/mikartv/issue-tracker/actions/runs/28391087620
- SHA `8992715` (alpha-closeout) — **SUCCESS** — https://github.com/mikartv/issue-tracker/actions/runs/28391258244

**Jest test suite (CI):** green; 61 web + 76 api = 137 total pass.

**`ng build` (AOT compilation):** **FAIL** — NG8002 on `apps/web/src/app/projects/project-issues.component.ts:51`:

```
NG8002: Can't bind to 'cdkDropListGroup' since it isn't a known property of 'div'
  <div class="board" [cdkDropListGroup]>
```

`cdkDropListGroup` is a directive selector, not an input property. The template uses `[cdkDropListGroup]` (property binding) which AOT rejects; the correct form is `cdkDropListGroup` (attribute selector). Jest does not trigger AOT compilation; CI does not run `ng build`; this error was undetected at review time.

δ confirmed the failure post-merge and made then reverted a direct fix. The fix (`[cdkDropListGroup]` → `cdkDropListGroup`, 2 characters) must go through α in the next cycle.

---

## Close-out Triage Table

### α close-out findings

| Finding | Source | Type | CAP Classify | CAP Assess | CAP Prescribe | Artifact / commit |
|---------|--------|------|-------------|-----------|--------------|-------------------|
| Diff-count authoring sequence (B-1 root cause: §Diff scope estimated before finalizing source edits) | α-closeout §Friction Log | honest-claim process (α self-documented) | Recurring pattern — α measured diff at draft time; source edit in same commit invalidated the measurement; B-2 was the cascading off-by-one from the R2 fix applied after the measurement was written | Two review rounds consumed by a documentation accuracy artifact (B-1 → R2 → B-2 → R3). Implementation and ACs were correct throughout. Root cause: §Diff scope figures authored before source is final. | Patch STACK.md: add α-rule requiring §Diff scope counts to be sourced from `git diff` at the FINAL committed state, not estimated during drafting | STACK.md §α-rule (this session) |
| Unused variable `originStatus` (A-1) | α-closeout §Friction Log | mechanical | Pre-commit linting would catch dead code; `noUnusedLocals` is not set in tsconfig — pre-existing debt | Low impact; β caught at R1; no functional issue | No immediate action (`noUnusedLocals` tsconfig gap is pre-existing); carry as known debt | α-closeout.md §Friction Log |
| `cdkDropListGroup` directive bound via `[cdkDropListGroup]` — α §Debt incorrectly described this as "consistent with Angular CDK 17 patterns" | α-closeout §Debt (and confirmed by δ post-merge observation) | honest-claim + cdd-tooling-gap | The §Debt claim was a rationalization of a template syntax error; `[cdkDropListGroup]` causes NG8002 at AOT compile; Jest does not catch it | Neither α nor β detected the error because neither ran `ng build`; the §Debt statement gave false assurance | Skill patch: add β-rule for `ng build` to STACK.md; file next cycle to fix the template; note as `cdd-tooling-gap` in cdd-iteration.md | STACK.md §β-rule (this session); next MCA |

### β close-out findings

| Finding | Source | Type | CAP Classify | CAP Assess | CAP Prescribe | Artifact / commit |
|---------|--------|------|-------------|-----------|--------------|-------------------|
| β approved cycle/19 without running `ng build` | β-closeout §Review Summary (implicit — β CI gate is Jest only) | cdd-skill-gap | β review protocol (STACK.md §β-rule: CI green gate) covers Jest CI but is silent on `ng build`; β correctly followed the skill but the skill is incomplete for Angular changes | `ng build` failure (NG8002) on main is a real defect. β review did not surface it. The skill gap means this is not a β failure — it is a protocol gap. | Patch STACK.md: add β-rule requiring `ng build` verification for any Angular component change; add CI extension for `ng build` as deferred output | STACK.md §β-rule (this session) |

**Zero unresolved triage items at close.**

---

## Independent γ Process-Gap Check (§2.9)

**Q1 — Did this cycle reveal a recurring friction?**

Yes — two recurring patterns:

1. **α §Diff scope estimation error**: This is the second time α has miscounted diff figures in self-coherence (cycle 18 noted α baseline-count discrepancy; cycle 19 had B-1/B-2 diff-count errors). Root cause in both cases: α measures at draft time rather than at final committed state. Cycle 18 deferred output was "instruct α to source baseline from prior γ close-out" — addressing the baseline count but not the diff-count estimation. This cycle extends the patch to §Diff scope figures.

2. **`ng build` not in any verification gate**: No role (α, β, CI) runs `ng build` for Angular changes. This has been a structural blind spot for the entire Angular web development cycle sequence. Cycle 19 is the first cycle where it caused a defect.

**Q2 — Was any gate too weak or too vague?**

Yes — STACK.md §β-rule: CI green gate only requires Jest CI status check. For Angular changes, AOT compilation is a distinct gate that Jest cannot substitute. The gap is clear and the patch is immediate.

**Q3 — Did a role skill fail to prevent a finding?**

Yes — the absence of an `ng build` requirement in β protocol is a loaded-skill miss by the skill (not by β). β followed the protocol correctly. The skill itself needed the rule.

**Q4 — Did coordination burden show a better mechanical path?**

The 3-round review for B-1/B-2 reflects a process in which α authors §Diff scope during implementation rather than after `git commit`. A cleaner mechanical path: author §Diff scope as the last section of self-coherence, after all source edits are committed, by running `git diff origin/main -- <file> | grep -c "^[+-]"` and copying the output directly.

---

## Cycle Iteration Triggers

| Trigger | Fire condition | Status | Notes |
|---------|----------------|--------|-------|
| Review churn | rounds > 2 | **FIRED** — 3 rounds | R1: A-1 (mechanical) + B-1 (honest-claim, §Diff scope estimate wrong). R2: B-2 (honest-claim, off-by-one introduced when R2 fix applied after measurement). R3: B-2 resolved (no source change). All 3 rounds were documentation accuracy corrections; no AC changes. Root cause: α authored §Diff scope from estimates not from post-commit `git diff`. Disposition: patch STACK.md §α-rule now (this session). |
| Mechanical overload | mechanical ratio > 20% AND ≥ 10 total findings | **NOT FIRED** | 3 total findings; 1 mechanical (A-1) = 33% ratio, but below the ≥10-finding floor. Ratio noted; no filing required. |
| Avoidable tooling failure | tooling/environment blocked cycle in a way a guardrail could prevent | **FIRED** | `ng build` failure (NG8002) on main undetected until δ post-merge check. Neither α nor β ran `ng build`; CI does not run `ng build`. A `ng build` step in CI, or a β-rule requiring it, would have caught this before merge. Disposition: β-rule patch to STACK.md (this session); CI `ng build` step as deferred output (δ action). |
| Loaded-skill miss | a loaded skill should have prevented a finding but did not | **FIRED** | STACK.md §β-rule: CI green gate covers only Jest CI — it does not require `ng build` for Angular changes. β applied the existing rule correctly; the rule itself was the gap. Disposition: patch STACK.md §β-rule (this session). |

### Cycle Iteration

**Review churn (3 rounds) — root cause and patch:**

Root cause: α authors §Diff scope in self-coherence during or before implementation, then makes source edits in a later commit without updating the figures. In cycle 19: B-1 came from a draft-time estimate (+280 vs actual +166); B-2 came from a measurement taken before applying the `originStatus` removal in the same commit. The pattern is mechanical and preventable.

Patch: STACK.md new `§α-rule: self-coherence diff counts` — "Derive §Diff scope line counts from `git diff origin/main -- <file> | grep -c '^[+-]'` run AFTER all source edits are committed. Never estimate. Never copy from a draft. If a source edit is made after the figures are written, recount before committing self-coherence."

This is landed in this session (STACK.md edit below).

**Avoidable tooling failure + loaded-skill miss — root cause and patch:**

Root cause: `ng build` is not in any verification gate (α testing, β review protocol, CI). Angular AOT compilation catches template property-binding errors (NG8002) that Jest shallow-rendering cannot. This is a structural blind spot.

Patches (both landed this session):
1. STACK.md new `§β-rule: Angular ng build` — β must run `ng build` and verify it succeeds for any cycle that modifies Angular component templates (`.html` or inline template in `.component.ts`). Failure is an RC finding, D-severity.
2. STACK.md §α-rule addition (optional self-check) — α should run `ng build` as a local pre-signal-readiness check for Angular template changes.

CI `ng build` step: deferred as a structural O1 improvement (δ action required to edit `.github/workflows/ci.yml`).

---

## Skill Gap Candidate Dispositions

| Finding | Gap type | Disposition | Artifact |
|---------|----------|-------------|---------|
| β protocol silent on `ng build` for Angular changes | cdd-skill-gap | **Patch landed** — STACK.md §β-rule: Angular ng build added (this session) | STACK.md (this commit) |
| CI does not include `ng build` step | cdd-tooling-gap | **Deferred** — CI extension requires δ to edit `.github/workflows/ci.yml`; filed as deferred output (O2 gap) | deferred outputs §CI ng-build step |
| α §Diff scope authoring sequence | cdd-skill-gap | **Patch landed** — STACK.md §α-rule: self-coherence diff counts added (this session) | STACK.md (this commit) |

**protocol_gap_count: 3** (2 cdd-skill-gap, 1 cdd-tooling-gap) — `cdd-iteration.md` authored at `.cdd/unreleased/19/cdd-iteration.md`; INDEX.md row added.

---

## Immediate Outputs

Executed in this session:

1. **`gamma-closeout.md` authored** — this document; closure declaration artifact for cycle 19.
2. **STACK.md patched** — two new rules added: `§β-rule: Angular ng build` (D-severity RC for Angular template changes without `ng build` pass) and `§α-rule: self-coherence diff counts` (derive from `git diff` at final committed state).
3. **PROJECT.md updated** — test count updated to 137 (76 api + 61 web); `ng build` failure noted as known debt; cycle 19 decision appended.
4. **`cdd-iteration.md` authored** — `.cdd/unreleased/19/cdd-iteration.md`; 3 protocol findings (2 cdd-skill-gap, 1 cdd-tooling-gap).
5. **`.cdd/iterations/INDEX.md` updated** — cycle 19 row added.

---

## Deferred Outputs

| Item | Type | Owner | First AC / condition |
|------|------|-------|----------------------|
| Fix `[cdkDropListGroup]` → `cdkDropListGroup` in `project-issues.component.ts` template | P0 defect / next MCA | α (next cycle dispatch) | `ng build` succeeds; NG8002 absent; existing 61 web tests still pass |
| CI `ng build` step for web job (O2 gap) | tooling / CI | δ (edit `.github/workflows/ci.yml`) | Add `npx ng build --configuration=production` step to web CI job; CI fails on NG8XXX errors |
| α close-out baseline sourcing | process / dispatch prompt | γ (next α close-out dispatch) | Add note: "Source pre-cycle test count from prior γ close-out baseline" (from cycle 18 deferred) |
| Scaffold template DB pre-flight reminder for e2e verification | process / coordination | γ (next §5.2 dispatch) | Add one-line note in γ scaffold template (from cycle 18 deferred) |
| Close-out dispatch prompt naming (§5.2) | process / coordination | γ (cnos PR) | Add explicit "α close-out prompt" template to `operator/SKILL.md §5.2 v0.1 overlay` (from cycle 17 deferred) |
| Dispatch-prompt reminder for `alpha/SKILL.md §2.5` | process / coordination | γ (next α dispatch) | One-line §2.5 reminder in α dispatch prompt (from cycle 17 deferred) |
| Angular Material 18 upgrade (M3 `mat.define-theme`) | feature / future cycle | γ (future selection) | Cycle that upgrades @angular/material to 18+ and migrates from M2 to M3 theme API (from cycle 14 deferred) |
| CI extension to feature branches (O1 gap) | structural | δ | Enable CI on `cycle/*` branch pushes in `.github/workflows/ci.yml` (from cycle 17 deferred) |
| Batch-release PRAs (1.2.0, 1.3.0, 1.4.0, 1.5.0) | release artifact | γ | After batch release tag covering cycles 14–18; write PRAs (from cycle 18 deferred) |
| RELEASE.md + cycle directory move (§2.10 items 11, 12) | release artifact | γ/δ | Deferred — batch release; no release instruction from δ; continuing batch with cycles 15, 17, 18, 19 |
| δ release-boundary preflight (§2.10 item 13) | gate | δ | After RELEASE.md + directory move committed |
| Branch cleanup: `cycle/18`, `cycle/19` remotes | cleanup | γ/δ | Delete after close-out committed |
| WCAG contrast audit for chip component | quality / accessibility | γ (future selection) | From cycle 17 deferred |
| Dispatch-prompt rebase instruction | process / coordination | γ (next §5.2 dispatch) | From cycle 16 deferred |

---

## Next MCA

**Candidate selection (`cnos.cds/skills/cds/CDS.md §"Selection function"`):**

| Candidate | Source | Rule clause | Priority | Dependency | Decision |
|-----------|--------|-------------|----------|------------|----------|
| fix: `[cdkDropListGroup]` → `cdkDropListGroup` in board template (NG8002 on main) | δ post-merge observation | P0 override — build-breaking defect on main | P0 | none | **Selected** |
| gh #11 — create-issue in MatDialog (R6) | open backlog | maximum-leverage rule | P2 | none | Eligible after P0 fix |
| gh #12 — issue-detail redesign sidebar | open backlog | maximum-leverage rule | P2 | none | Eligible; wave continuation |

**Decisive clause:** P0 override — `ng build` fails on main (`[cdkDropListGroup]` NG8002). Deploying the app as-is is not possible; `ng build` must pass before continuing the feature wave.

**Next MCA:** fix: resolve NG8002 — `cdkDropListGroup` directive syntax in board template  
**Owner:** γ → α (next dispatch)  
**Branch:** `cycle/20` from `origin/main`  
**First AC:** `ng build --configuration=production` exits 0 with no NG8002 error; existing 61 web tests pass  
**MCI frozen until shipped?** no — defect fix, not a new MCI  
**Rationale:** `ng build` is broken on main. No further feature cycles should land until the build is green. Fix is trivial (2-char change in one template line) but must go through α per protocol.

After the fix is merged, next feature cycle: gh #11 (create-issue in MatDialog, R6).

---

## Hub Memory

### Daily reflection

**Path:** `cn-sigma/threads/reflections/daily/20260701.md`  
**Content:** Cycle 19 γ close-out — Kanban board + drag-and-drop shipped (AC1–AC5 PASS, 61 web tests, 3 review rounds). Post-merge defect: `ng build` fails (NG8002, `[cdkDropListGroup]` template syntax). Skill patches landed: β-rule for `ng build` + α-rule for diff-count sourcing. Next MCA: P0 fix cycle for `ng build`. After that: gh #11 (create-issue dialog).  
**cn-sigma push:** 403 — `origin/cn-sigma` denied; δ action required.

### Adhoc thread

**Thread:** `cn-sigma/threads/adhoc/20260617-cdd-protocol-findings-10cycles.md`  
**Content:** Cycle 19 note — 3 findings (A-1 mechanical, B-1/B-2 honest-claim); 3 rounds. Two skill patches landed: STACK.md §β-rule ng-build (cdd-skill-gap, AOT gate missing) + §α-rule diff counts (cdd-skill-gap, estimation vs derivation). CI tooling gap (ng build not in CI) deferred to δ. Pattern: honest-claim in §Diff scope is a 2-cycle recurring issue; patch addresses the root cause. Post-merge build failure is new failure class for this repo — no prior cycle had this.  
**cn-sigma push:** 403 (same as above — δ action required).

---

Cycle 19 closed. Next: cycle/20 — P0 fix for `ng build` (NG8002 `cdkDropListGroup`).
