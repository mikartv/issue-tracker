<!-- section-manifest
planned: [Review Summary, Implementation Assessment, Technical Review, Process Observations, Release Notes]
completed: [Review Summary, Implementation Assessment, Technical Review, Process Observations, Release Notes]
-->

# Beta Close-out — Cycle 23

**Cycle:** 23
**Issue:** gh #13 — enhancement: global feedback — MatSnackBar toasts and consistent empty/error states
**Branch:** `cycle/23`
**Merge commit:** `5ef5197` (merge: cycle/23 → main)
**β identity:** `beta@issue-tracker.cdd.cnos`
**Review rounds:** 1
**Verdict:** APPROVED

---

## §Review Summary

Single-round review. All four mandatory β gates passed. AC1–AC3 verified by code-first grep and spec inspection. No findings at any severity.

| Gate | Result |
|------|--------|
| Gate 1 — Git identity | PASS — implementation commit `a30b34a` authored by `alpha@issue-tracker.cdd.cnos`; γ-scaffold `1cfae65` authored by `gamma@issue-tracker.cdd.cnos`; all CDD artifacts by α |
| Gate 2 — CI green | PASS (provisional) — O1 gap: no CI on branch pushes; `npm run test:web` → 84 passed, exit 0; `ng build --configuration=production` → exit 0, no NG8XXX |
| Gate 3 — ng build | PASS — exit 0, no NG8XXX errors; pre-existing bundle size warning (D4 debt) |
| Gate 4 — gamma-scaffold exists | PASS — `gamma-scaffold.md` present on `origin/cycle/23` |

---

## §Implementation Assessment

### What shipped

A thin `NotificationService` (`apps/web/src/app/shared/notification.service.ts`) wrapping `MatSnackBar` with three methods — `success`, `error`, `info`. The service is `providedIn: 'root'`, uses Angular 17 `inject()` pattern, and delegates to `snackBar.open()` with typed panelClass values (`['snack-success']` / `['snack-error']`).

All four feedback-emitting components were updated:
- `projects-list`: create/archive success+error → toasts; load error stays inline
- `project-issues`: drag-drop error → toast; board update on success is the visual feedback
- `issue-detail`: save/status-move/comment success+error → toasts; load error renamed to `loadError` with `error-container` wrapping and back link
- `create-issue-dialog`: non-409 submit error → toast; 409 → `archivedError` inline (blocking state, correctly retained)

`styles.scss` gained AM17 MDC panel-class overrides for snackbar success/error, and the `.app-empty` shared empty-state class.

### AC verdict

| AC | Verdict |
|----|---------|
| AC1: Action outcomes use toasts | MET — 11 call sites across 4 components; spec assertions confirm spy called with expected messages |
| AC2: No page-replacing error; no hardcoded hex | MET — `loadError` rename + `error-container` with back link; `grep '#c00\|#0a0'` → 0 matches |
| AC3: Consistent empty/loading pattern | MET — `.app-empty` applied to board column + comment empty states (scoped per γ-scaffold oracle) |

### Implementation contract

All 7 axes conformed: TypeScript strict, `apps/web/src` scoping, Angular Material 17.3, no wire contract change, no new npm packages.

---

## §Technical Review

**Role separation:** `NotificationService` is a thin wrapper — no business logic, no error classification. Components call it with literal strings. This is the correct design: the service owns delivery mechanics (panelClass, duration, position), components own message content. Clean.

**loadError scoping:** `loadError` is strictly load-time. Save, status-move, and comment errors all route to `notification.error(...)`. Zero cases of `this.loadError` outside the `loadIssue` error handler. The rename was surgical and complete.

**Removed props:** `createError`, `archiveErrors`, `dropError`, `editSuccessMessage`, `submitError` — all removed cleanly. Grep confirms 0 references in templates or TypeScript.

**Panel-class styles:** `.snack-success .mdc-snackbar__surface` and `.snack-error .mdc-snackbar__surface` use the correct AM17 MDC selector. `!important` is a known AM17 theming limitation (§Debt D1) — not a new debt class.

**Test coverage:** 84 tests pass (up from 76 at cycle 22 entry). Each of the 5 specs (including the new `notification.service.spec.ts`) provides the `NotificationService` spy via `TestBed.providers`. Assertions are specific: `toHaveBeenCalledWith('Issue saved')` etc.

**γ-scaffold deviation noted and accepted:** `moveToNextStatus` error in `issue-detail` adds a toast that the scaffold marked as optional ("sidebar chip refreshes"). The implementation adds the error path only — success path is correctly silent. This is a strictly-correct extension within AC1 scope.

**Debt forward-carried:** D1 (CSS `!important` AM17 workaround), D2 (no issue-create success toast — acceptable per γ-scaffold decision), D3 (alpha-closeout provisional — resolved by this APPROVE), D4 (pre-existing AM18 upgrade, bundle size warning, CI ng-build gap, root redirect spec).

---

## §Process Observations

**Cycle health:** Clean first-round approval. No RC loop. α's self-coherence was thorough — both partial notes (AC2 load-error scope, AC3 projects-list exemption) were explicitly stated with reasoning, making β verification straightforward.

**Test count growth:** 76 → 84 (+8 tests). Growth is healthy and concentrated in the new `NotificationService` spec (+5 tests) and component spec additions (+3 tests across 4 files).

**O1 gap:** The pre-existing gap (CI does not run on branch pushes) was correctly declared by α and handled by local verification at β. The gap does not affect this cycle's correctness — both test and build checks pass locally. This is the third consecutive cycle where O1 is declared without resolution. γ should consider whether cycle 24 or a dedicated infra cycle addresses it.

**D3 provisionality closed:** α wrote the alpha-closeout pre-β per `alpha/SKILL.md §2.8` provisional fallback. This β APPROVE closes the provisionality. The alpha-closeout content accurately reflects the cycle outcome.

---

## §Release Notes

**gh #13 — global feedback via NotificationService**

Added a shared `NotificationService` wrapping Angular Material `MatSnackBar`. Action outcomes (project create/archive, issue save/status-move/comment) now surface as transient toasts instead of per-component inline text. Hardcoded `#c00`/`#0a0` feedback colors removed from all components. The `issue-detail` non-404 load error is now contained in a layout wrapper with a back link. Empty states in board columns and the comment section use the new `.app-empty` shared class.

**Breaking changes:** None.
**New surfaces:** `NotificationService` at `apps/web/src/app/shared/notification.service.ts`.
**Modified surfaces:** `projects-list`, `project-issues`, `issue-detail`, `create-issue-dialog` components; `styles.scss`.
