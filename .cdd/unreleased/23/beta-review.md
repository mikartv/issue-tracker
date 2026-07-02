<!-- section-manifest
planned: [Verdict, Contract Integrity, Issue Contract, Findings, CI, Artifact]
completed: [Verdict, Contract Integrity, Issue Contract, Findings, CI, Artifact]
-->

# Beta Review — Cycle 23

**Verdict:** APPROVED

**Round:** 1
**Fixed this round:** n/a (first and only round)
**Branch CI state:** provisional (O1 gap — CI does not run on `cycle/23` push; local verification performed; see §CI Status)
**Merge instruction:** `git merge --no-ff cycle/23` into `main` with `Closes #13`

---

## §2.0.0 Contract Integrity

| Check | Result | Notes |
|---|---|---|
| Status truth preserved | yes | Issue §Status truth accurately lists shipped/not-shipped state; implementation matches expected state |
| Canonical sources/paths verified | yes | All file paths in self-coherence verified against actual diff |
| Scope/non-goals consistent | yes | Implementation stays within scope; no HTTP interceptor, no field-validation redesign |
| Constraint strata consistent | yes | TypeScript strict, Angular 17 standalone, no NgModules — all honored |
| Exceptions field-specific/reasoned | yes | Two partial notes (AC2 load error, AC3 projects-list exemption) explicitly reasoned in self-coherence |
| Path resolution base explicit | yes | All paths are repo-root relative and verified present |
| Proof shape adequate | yes | Each AC has oracle + positive + negative evidence chain |
| Cross-surface projections updated | yes | All 4 feedback-emitting components touched; peer enumeration complete |
| No witness theater / false closure | yes | Evidence is grep-verifiable code lines, not doc-only claims |
| PR body matches branch files | n/a | No PR body; dispatch prompt and self-coherence are the contract surfaces |
| γ artifacts present (gamma-scaffold.md) | yes | `git ls-tree -r --name-only origin/cycle/23 .cdd/unreleased/23/gamma-scaffold.md` → non-empty |

---

## §2.0 Issue Contract

### AC Coverage

| # | AC | In diff? | Status | Notes |
|---|----|----------|--------|-------|
| AC1 | Action outcomes use toasts | yes | MET | `NotificationService` created; 11 call sites across 4 components; spec assertions on `notificationSpy.success`/`notificationSpy.error` in all 4 component specs |
| AC2 | No page-replacing error; no hardcoded feedback hex | yes | MET | `loadError` rename + `error-container` with back link; `grep '#c00\|#0a0' apps/web/src/app/` → 0 matches |
| AC3 | Consistent empty/loading pattern | yes | MET | `.app-empty` rule in `styles.scss:109–114`; applied to board column empty state (`project-issues.component.ts:67`) and comment empty state (`issue-detail.component.ts:86`) |

### Named Doc Updates

| Doc / File | In diff? | Status | Notes |
|------------|----------|--------|-------|
| `apps/web/src/styles.scss` | yes | present | Snackbar panel-class rules + `.app-empty` added |
| `apps/web/src/app/shared/notification.service.ts` | yes | present | New service |

### CDD Artifact Contract

| Artifact | Required? | Present? | Notes |
|----------|-----------|----------|-------|
| `gamma-scaffold.md` | yes | yes | `1cfae65` on cycle/23 |
| `alpha-prompt.md` | yes | yes | present on branch |
| `beta-prompt.md` | yes | yes | present on branch |
| `self-coherence.md` | yes | yes | §Gap through §Review-readiness complete |
| `alpha-closeout.md` | yes | yes | `d542fb3`; marked provisional pending β |

### Active Skill Consistency

| Skill | Required by | Loaded? | Applied? | Notes |
|-------|-------------|---------|----------|-------|
| CDD.md | Tier 1a | yes | yes | Recursive coherence-cell protocol applied |
| beta/SKILL.md | Tier 1a | yes | yes | Pre-merge gate applied; identity set; γ artifact verified |
| review/SKILL.md | Tier 1a | yes | yes | Three-phase review executed |

---

## §Mandatory β Gates

### Gate 1 — Git Identity

`git log cycle/23 --format='%ae %s'` output:

- Implementation commit `a30b34a`: `alpha@issue-tracker.cdd.cnos` — PASS
- All CDD artifact commits: `alpha@issue-tracker.cdd.cnos` — PASS (CDD artifact commits authored by α or γ per protocol)
- γ-scaffold commit `1cfae65`: `gamma@issue-tracker.cdd.cnos` — PASS

No identity violations found.

### Gate 2 — CI Green

`gh run list --branch cycle/23 --limit 5` → empty (no CI runs on `cycle/23` push).

O1 gap confirmed (pre-existing; declared in α §Review-readiness row 10 and in `.cdd/STACK.md §CI`): GitHub Actions workflow `.github/workflows/ci.yml` triggers on `push` to `main` and PRs only — not on arbitrary branch pushes.

Local verification performed:
- `npm run test:web` → 84 passed, 84 total, 8 suites. Exit 0.
- `cd apps/web && npx ng build --configuration=production` → exit 0, no NG8XXX errors. Bundle size warning (pre-existing D4 debt).

**CI status verdict:** provisional-pass on local verification; O1 gap recorded.

### Gate 3 — ng build

`cd apps/web && npx ng build --configuration=production` → exit 0. No NG8XXX errors. One pre-existing bundle size warning (`830 kB > 500 kB budget`) — tracked in §Debt D4, not introduced by this cycle. PASS.

### Gate 4 — gamma-scaffold.md exists

`git ls-tree -r --name-only origin/cycle/23 .cdd/unreleased/23/gamma-scaffold.md` → `.cdd/unreleased/23/gamma-scaffold.md`. PASS.

---

## §AC Verification (code-first, Rule 6)

### AC1 — Action outcomes use toasts

**NotificationService structure verified:**
- `apps/web/src/app/shared/notification.service.ts`: thin wrapper, `providedIn: 'root'`, `inject(MatSnackBar)`. Methods `success`/`error`/`info` call `this.snackBar.open(message, 'Dismiss', {...})`. No business logic in service. PASS.

**Call sites verified against self-coherence table:**
- `projects-list.component.ts:202` — `notification.success('Project created')` ✓
- `projects-list.component.ts:206` — `notification.error(err.message ?? 'Failed to create project')` ✓
- `projects-list.component.ts:215` — `notification.success('Project archived')` ✓
- `projects-list.component.ts:219` — `notification.error(err.message ?? 'Failed to archive project')` ✓
- `project-issues.component.ts:284` — `notification.error('Failed to move issue to …')` ✓
- `create-issue-dialog.component.ts:133` — `notification.error(err.message ?? 'Failed to create issue')` ✓ (non-409 path only; 409 → `archivedError` inline — correct)
- `issue-detail.component.ts:313` — `notification.error(err.message ?? 'Failed to update status')` ✓
- `issue-detail.component.ts:343` — `notification.success('Issue saved')` ✓
- `issue-detail.component.ts:349` — `notification.error(err.message ?? 'Failed to save issue')` ✓
- `issue-detail.component.ts:363` — `notification.success('Comment added')` ✓
- `issue-detail.component.ts:368` — `notification.error(err.message ?? 'Failed to add comment')` ✓

**Note on AC1 deviation:** `issue-detail` adds a `moveToNextStatus` error toast (`issue-detail.component.ts:313`) which the γ-scaffold action routing table marked as "no toast needed — sidebar chip refreshes." The implementation adds an error path toast (not a success toast). This is a strictly-correct extension: success path has no toast (visual update is the feedback), but error path gets toast. Within AC1 scope. Not a violation.

**Removed props verified — grep returns 0:**
- `createError`, `archiveErrors`, `dropError`, `editSuccessMessage`, `submitError` — 0 matches in `apps/web/src/app/`.

**Spec assertions verified:**
- `projects-list.component.spec.ts`: `notificationSpy.success` called with `'Project created'` (line 132); `notificationSpy.error` called on create error (line 148); on archive error (line 163). ✓
- `project-issues.component.spec.ts`: `notificationSpy.error` called on drop error (line 285); `.drop-error` element absent from DOM (line 286). ✓
- `issue-detail.component.spec.ts`: `notificationSpy.success` called with `'Issue saved'` (line 275). ✓
- `create-issue-dialog.component.spec.ts`: `notificationSpy.error` called on non-409 error (line 176); `archivedError` remains false for non-409. ✓

AC1 verdict: MET.

### AC2 — No page-replacing error; no hardcoded feedback hex

**loadError rename verified:**
- `issue-detail.component.ts:246`: `loadError: string | null = null;` — renamed from `error`. ✓
- Template `@else if (loadError)` at line 47. The `@else if` branch shows `<div class="error-container">` with back `routerLink="/projects"` (lines 48–51). ✓
- `saveEdit()` error at line 349 routes to `notification.error(...)` — not `this.loadError`. ✓
- `moveToNextStatus()` error at line 313 routes to `notification.error(...)` — not `this.loadError`. ✓

**error-container spec verified:**
- `issue-detail.component.spec.ts` line 183–211: `'AC2-loadError: non-404 load error shows error-container with back link'` — asserts `.error-container` present, back link present, `.detail-layout` absent. ✓

**Hardcoded hex verified:**
- `grep -r '#c00\|#0a0' apps/web/src/app/` → 0 matches. ✓
- `styles.scss` uses `var(--it-status-done)` for success and `var(--it-priority-critical)` for error. ✓

AC2 verdict: MET.

### AC3 — Consistent empty/loading pattern

**`.app-empty` rule verified in `styles.scss:109–114`:**
```css
.app-empty {
  color: rgba(0, 0, 0, 0.5);
  font-style: italic;
  text-align: center;
  padding: var(--it-space-2) 0;
}
```
Token-styled (uses `--it-space-2`), not bare browser default. ✓

**Consumers verified:**
- `project-issues.component.ts:67`: `<p class="empty-col app-empty">No issues</p>` ✓
- `issue-detail.component.ts:86`: `<p class="comment-empty app-empty">No comments yet.</p>` ✓

**projects-list exemption confirmed:** The projects-list uses a pre-existing designed empty state (`div.empty-state` with `mat-icon`, text, CTA — from cycle 15). γ-scaffold AC3 oracle scopes `.app-empty` to the two bare-string empty states only. No regression. ✓

Note: `project-issues.component.ts` retains a local `.empty-col` style that sets `color: #999; font-size: 0.85em; text-align: center; padding: 8px 0;`. This is additive with `.app-empty` — `.app-empty` provides the shared token-styled base (color via opacity, font-style italic, padding via token), and `.empty-col` adds font-size override. The combination is not harmful; the shared token is present and takes precedence on the shared properties. Not a finding.

AC3 verdict: MET.

---

## §Focus Area Review

### Role separation (NotificationService)

Confirmed: service is a thin wrapper — `snackBar.open()` delegate only. No business logic, no conditional routing, no error classification. Components call it with literal message strings. ✓

### loadError rename scope

Confirmed: `loadError` is strictly load-time only. Lines 289–293 (`loadIssue` error handler) assign `this.loadError`. `saveEdit`, `moveToNextStatus`, `submitComment` all route errors to `notification.error(...)`. Zero cases of `this.loadError` outside the `loadIssue` error handler. ✓

### Removed props

`createError`, `archiveErrors`, `dropError`, `editSuccessMessage`, `submitError` — 0 references in TypeScript or templates across all app source. ✓

### Panel classes

`styles.scss:87–103` — `.snack-success .mdc-snackbar__surface` and `.snack-error .mdc-snackbar__surface` use correct AM17 MDC selector. Background colors use `var(--it-status-done)` and `var(--it-priority-critical)` token values. `!important` used per §Debt D1 (AM17 theming limitation — known and declared). ✓

### Tests

84 tests, 8 suites. All 5 component/service specs provide `NotificationService` spy. Assertions match new behavior. ✓

---

## §Implementation Contract Verification (Rule 7)

| Axis | Pinned value | Diff conforms? |
|---|---|---|
| Language | TypeScript (strict) | yes — all new/modified files are `.ts` with strict patterns |
| CLI integration target | N/A | n/a |
| Package scoping | `apps/web/src` | yes — all changes in `apps/web/src/app/` and `apps/web/src/styles.scss` |
| Existing-binary disposition | N/A | n/a |
| Runtime dependencies | Node 20, Angular 17, Angular Material 17.3 | yes — `MatSnackBar` from `@angular/material/snack-bar` (already in project); no new packages added |
| JSON/wire contract preservation | N/A (web-only) | n/a — no API wire contract changed |
| Backward-compat invariant | N/A | n/a |

Implementation contract: fully conforms.

---

## §CI Status

O1 gap (pre-existing, declared in STACK.md and self-coherence §Review-readiness row 10): GitHub Actions CI does not run on `cycle/23` branch pushes. Last 5 CI runs are all on `main`.

Local verification (β-side):
- `npm run test:web` → 84 passed, 84 total, exit 0.
- `cd apps/web && npx ng build --configuration=production` → exit 0, no NG8XXX errors.

O1 gap is a pre-existing process gap, not introduced by this cycle. Recorded here per dispatch Gate 2 instruction.

---

## §Artifact Completeness

`gamma-scaffold.md` present at `.cdd/unreleased/23/gamma-scaffold.md` on `origin/cycle/23` (commit `1cfae65`). Rule 3.11b satisfied.

---

## Findings

| # | Finding | Evidence | Severity | Type |
|---|---------|----------|----------|------|
| — | No findings | All gates pass; AC1–AC3 met; contract intact | — | — |

No findings at any severity. APPROVED is not qualified or conditional.

---

## Notes

- Cycle 23 implements AC1–AC3 cleanly with clean role separation in `NotificationService`.
- The `moveToNextStatus` error toast is a correct extension beyond the γ-scaffold minimum — error path covered, success path correctly silent (visual feedback sufficient). Within AC1 scope.
- D1 debt (`!important` in panel-class CSS) is acknowledged and correctly traced to AM17 MDC theming limitation. Not a new debt class.
- Bundle size warning is pre-existing (D4); not introduced by this cycle.
- O1 gap (no CI on branch pushes) is pre-existing; local verification substitutes.
- `alpha-closeout.md` marked provisional pending β (D3); this β APPROVE closes that provisionality.
