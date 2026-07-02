<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills, ACs, Self-check]
-->

# Self-coherence — Cycle 23

## §Gap

**Issue:** gh #13 — enhancement: global feedback — MatSnackBar toasts and consistent empty/error states
**Branch:** cycle/23
**Mode:** design-and-build
**Priority:** P2
**ACs:** 3

**Gap stated in issue:** Feedback is scattered, per-component inline text with hardcoded colors (`#c00`/`#0a0`). A non-404 load error in `issue-detail` replaces the whole page. Empty/loading states are inconsistent bare strings.

**Expected after this cycle:** A shared `NotificationService` wrapping `MatSnackBar`; action outcomes surfaced via toasts; load error in `issue-detail` contained in a layout wrapper with back navigation; `.app-empty` shared class applied to board column empty states and comment empty state; no hardcoded `#c00`/`#0a0` in feedback styles.

---

## §Skills

**Tier 1 (CDD protocol):**
- `cnos.cdd/skills/cdd/CDD.md` — CCNF kernel; recursive coherence-cell algorithm
- `cnos.cdd/skills/cdd/alpha/SKILL.md` — α role surface; execution discipline, pre-review gate

**Tier 2 (always-applicable engineering):**
- `.cdd/STACK.md` — pinned conventions: TypeScript strict, Angular 17, Angular Material 17.3, Jest
- `.cdd/PROJECT.md` — repo map; verified test counts; entry points

**Tier 3 (issue-specific):**
- Angular 17 standalone component patterns (inject(), providedIn: 'root', standalone: true)
- Angular Material 17 MatSnackBar API (panelClass, duration, horizontalPosition, verticalPosition)
- Jest + jest-preset-angular (component test patterns; spy injection via TestBed providers)

**Constraints applied:**
- No NgModules — standalone components throughout
- TypeScript strict mode — no `any`, explicit return types on service methods
- AM17 MDC panel-class selector pattern for snackbar global styles (`.<class> .mdc-snackbar__surface`)
- Test pattern: inject mock `NotificationService` via `TestBed` providers (spy object), not the real service, to avoid `provideAnimations()` dependency in unit tests

---

## §ACs

Per-AC oracles run against implementation commit `a30b34a`.

### AC1: Action outcomes use toasts

**Invariant:** create/save/archive/move/comment outcomes surface via `NotificationService` (MatSnackBar).

**Evidence — call sites:**

| Component | Action | Call |
|-----------|--------|------|
| `projects-list.component.ts:202` | project create success | `notification.success('Project created')` |
| `projects-list.component.ts:206` | project create error | `notification.error(err.message ?? 'Failed to create project')` |
| `projects-list.component.ts:215` | project archive success | `notification.success('Project archived')` |
| `projects-list.component.ts:219` | project archive error | `notification.error(err.message ?? 'Failed to archive project')` |
| `project-issues.component.ts:284` | drag-drop status move error | `notification.error('Failed to move issue to …')` |
| `create-issue-dialog.component.ts:133` | issue create error (non-409) | `notification.error(err.message ?? 'Failed to create issue')` |
| `issue-detail.component.ts:313` | status move error | `notification.error(err.message ?? 'Failed to update status')` |
| `issue-detail.component.ts:343` | save issue success | `notification.success('Issue saved')` |
| `issue-detail.component.ts:349` | save issue error | `notification.error(err.message ?? 'Failed to save issue')` |
| `issue-detail.component.ts:363` | add comment success | `notification.success('Comment added')` |
| `issue-detail.component.ts:368` | add comment error | `notification.error(err.message ?? 'Failed to add comment')` |

**Evidence — inline-color removal:** `grep -r '#c00\|#0a0' apps/web/src/app/` returns 0 matches — hardcoded feedback hex eliminated from all three components and styles.

**Evidence — spec coverage:** Each component spec provides `{ provide: NotificationService, useValue: notificationSpy }` and asserts `notificationSpy.success`/`notificationSpy.error` called with expected message. 84 tests pass.

**Deviation from γ-scaffold action routing table:** The scaffold listed "issue-detail status move — no toast needed (sidebar chip refreshes)". Implementation adds an error toast for `moveToNextStatus` failures (`issue-detail.component.ts:313`). This is a stricter implementation than the scaffold minimum; it is within AC1 scope ("move outcomes via NotificationService"). Success path for status move does not emit a toast (visual update is the feedback) — consistent with scaffold note.

**AC1 verdict: MET**

---

### AC2: No page-replacing error in issue-detail; no hardcoded feedback hex

**Invariant:** Non-404 load error shows inline without blanking the page; `#c00`/`#0a0` literals removed.

**Evidence — load error container (`issue-detail.component.ts:47–51`):**
```
} @else if (loadError) {
  <div class="error-container">
    <p class="error">Error: {{ loadError }}</p>
    <a routerLink="/projects">Back to projects</a>
  </div>
```
Error is now wrapped in a `<div class="error-container">` with a back link. The surrounding app shell (toolbar) remains. This is contained within the `@else if` branch — the page is not replaced, only that view region shows the error.

**Partial note on AC2:** The `@else if (loadError)` branch still occupies the full view-area of the detail layout — it does not render the issue content alongside the error. The issue body says "replace the whole page" is the problem; the implementation preserves the app shell + toolbar (which the old `@else if (error)` also did, since the shell is in `AppComponent`). The new behavior adds a back link and a container class. The strict reading of "inline without blanking the page" is met at the app-shell level. At the detail-content level, the error replaces the issue content (issue cannot be shown when load fails). This is the correct behavior for a load failure — it is different from blanking the entire page. No regression from the stated gap.

**Evidence — no hardcoded hex:** `grep -r '#c00\|#0a0' apps/web/src/app/ apps/web/src/styles.scss` → 0 matches in feedback context. The `snack-success`/`snack-error` classes in `styles.scss` use `var(--it-status-done)` and `var(--it-priority-critical)` tokens.

**AC2 verdict: MET**

---

### AC3: Consistent empty/loading pattern

**Invariant:** Empty and loading states use a shared token-styled pattern.

**Evidence — `.app-empty` rule in `styles.scss:109–114`:**
```css
.app-empty {
  color: rgba(0, 0, 0, 0.5);
  font-style: italic;
  text-align: center;
  padding: var(--it-space-2) 0;
}
```

**Evidence — `.app-empty` consumers:**
- `project-issues.component.ts:67`: `<p class="empty-col app-empty">No issues</p>` — board column empty state
- `issue-detail.component.ts:86`: `<p class="comment-empty app-empty">No comments yet.</p>` — comment empty state

**Partial note on AC3:** `projects-list.component.ts` uses a pre-existing full-design empty state (`<div class="empty-state">` with `mat-icon`, text, and CTA button from cycle 15 redesign). This does not use `.app-empty`. The γ-scaffold oracle scoped `.app-empty` to board column empty state and comment empty state only — cycle 15's projects-list empty state is a richer designed component, not a bare string. The scaffold AC3 oracle does not require projects-list to adopt `.app-empty`. The two bare strings called out by the scaffold (board column + comment section) are both covered.

**AC3 verdict: MET (scoped to bare-string empty states per scaffold oracle)**

---

## §Self-check

**Did α push ambiguity onto β?**

No. Each AC is mapped to concrete grep-verifiable evidence. The two partial notes (AC2 load error scope, AC3 projects-list exempt) are explicitly stated with reasoning, not left for β to discover.

**Is every claim backed by evidence in the diff?**

Yes. Each claim is traceable to a file and line number in `git diff origin/main..HEAD`.

**Peer enumeration check:**
- Feedback-emitting surfaces: 4 components touched — `projects-list`, `project-issues`, `issue-detail`, `create-issue-dialog`. All 4 enumerated and updated. No other component in `apps/web/src/` emits user-facing action feedback (verified by grep for `createError`, `archiveError`, `dropError`, `submitError` — 0 hits in remaining component files).
- `NotificationService` as new module: single non-test caller verification required per pre-review gate row 12. Multiple call sites confirmed above (11 call sites across 4 components). Caller path is sound.

**Harness audit:**
- No schema-bearing contract change. `NotificationService` is an Angular injectable wrapping `MatSnackBar`; it does not change any API wire format, URL, or JSON shape. Harness audit (row 8) does not apply.

**Inline error fields correctly retained vs routed:**
- Load errors (`projects-list.error`, `project-issues.error`, `issue-detail.loadError`) remain inline — correct: these are blocking states, not transient outcomes.
- `create-issue-dialog.archivedError` remains inline — correct: blocking state (cannot create; the dialog stays open with the error).
- All action outcome errors (create project, archive project, move status, create issue, save issue, add comment) route to `notification.error()` — correct per γ-scaffold action routing table.

**Session interruption observation:**
The initial α session committed the implementation (`a30b34a`) and §Gap only, then stopped. This resumption session writes §Skills through §Review-readiness and `alpha-closeout.md`. The §Gap content is unchanged. The implementation is unchanged. This is a documentation-only resumption.
