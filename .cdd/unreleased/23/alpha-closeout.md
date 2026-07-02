# α Close-out — Cycle 23

**[provisional — pending β outcome]**

**Issue:** gh #13 — enhancement: global feedback — MatSnackBar toasts and consistent empty/error states
**Branch:** cycle/23
**Implementation commit:** `a30b34a`
**Date:** 2026-07-02

---

## Cycle summary

**Gap closed:** Feedback was scattered per-component inline text with hardcoded `#c00`/`#0a0` hex literals across three components. A non-404 load error in `issue-detail` replaced the entire view area. Empty states were bare unstyled strings.

**Implementation approach:**
1. New `NotificationService` (`apps/web/src/app/shared/notification.service.ts`) — thin `providedIn: 'root'` wrapper around `MatSnackBar`; three methods: `success`, `error`, `info`, each with AM17 panel-class and 4-second default duration.
2. Four components injected with `NotificationService`: `projects-list`, `project-issues`, `issue-detail`, `create-issue-dialog`. Per-component inline feedback fields (`createError`, `archiveError`, `dropError`, `submitError`, `editSuccessMessage`) removed; action outcomes routed to `notification.success()`/`notification.error()` calls.
3. `issue-detail` load error: renamed `error` → `loadError`, wrapped in `<div class="error-container">` with back link. Non-404 error no longer produces a bare full-area replacement — it is contained with navigation out.
4. `.app-empty` shared class added to `styles.scss` (token-styled: `rgba(0,0,0,0.5)`, italic, centered); applied to board-column empty state (`project-issues`) and comment empty state (`issue-detail`).
5. Snackbar panel-class styles in `styles.scss`: `.snack-success` (token `--it-status-done`) and `.snack-error` (token `--it-priority-critical`) via AM17 MDC selector pattern.

**ACs:**
- AC1 (action outcomes via toasts): MET — 11 call sites across 4 components; hardcoded `#c00`/`#0a0` eliminated.
- AC2 (no page-replacing error; no hardcoded hex): MET — load error contained in wrapper with back link; 0 hardcoded feedback hex remaining.
- AC3 (consistent empty/loading pattern): MET — `.app-empty` applied to the two bare-string empty states; projects-list uses pre-existing richer empty-state design from cycle 15 (out of AC3 scope per scaffold oracle).

**Test count:** 84 web tests pass, 8 suites (up from 76 tests, 6 suites before cycle 23).

---

## Implementation observations

**What went smoothly:**
- `MatSnackBar` injection and the `NotificationService` wrapper followed the established `inject()` pattern used by `ChipComponent` and other standalone components — no setup friction.
- The AM17 MDC panel-class CSS selector pattern (`.<class> .mdc-snackbar__surface`) required `!important` for background override, consistent with AM17 theming limitations documented in cycle 14.
- Providing a spy `NotificationService` in tests (rather than the real service) cleanly avoids `provideAnimations()` across 4 component test modules — this is the pattern the γ-scaffold anticipated.
- The `loadError` rename in `issue-detail` was clean: the old `error` field was overloaded (used for both load errors and save errors); separating load vs action errors produced a simpler template control flow.

**What surprised:**
- The γ-scaffold action routing table listed status-move success as "no toast needed (sidebar chip refreshes)". The implementation adds an error toast for status-move failures nonetheless, which is within AC1 scope. The success path correctly omits a toast. No functional deviation, but the implemented error coverage is slightly stricter than the scaffold minimum.
- Test count grew from 76 to 84 (+8), somewhat higher than the scaffold estimate of ~79–82. The notification service spec contributed 8 tests covering `success`, `error`, `info` methods and duration defaults; component spec updates added the balance.

---

## Friction log

**Mid-session stop requiring re-dispatch:**
The initial α session committed the implementation at `a30b34a` and wrote §Gap of `self-coherence.md`, then stopped before completing the remaining sections. This re-dispatch was required to complete §Skills, §ACs, §Self-check, §Debt, §CDD Trace, and §Review-readiness, and to write this close-out.

Process observation: the α session boundary fell between implementation commit and self-coherence completion. The resumption protocol (α/SKILL.md §4) handled this correctly — §Gap was verified intact, and the resumption continued from §Skills without rewriting completed sections. The session split did not require any implementation changes.

No self-coherence content was lost. No implementation changes were required during resumption.

---

## Engineering-level reading

**L5 (implementation):** Single-service abstraction over `MatSnackBar` is the correct pattern for this scope. Four-component adoption in one cycle removes the scattered inline feedback pattern entirely rather than partially. The `archivedError` inline retention in the dialog (blocking state, not transient) is the correct discriminator.

**L6 (architecture):** The `providedIn: 'root'` service correctly sits in `shared/` alongside `ChipComponent`. Load errors (blocking: user cannot proceed) vs action errors (transient: user can retry) are now structurally distinct — load errors remain inline in the template control flow; action errors route through `NotificationService`. This distinction is an architectural improvement, not just a visual one.

**L7 (process):** The γ-scaffold's action routing table was authoritative and accurate — it pre-decided the load-vs-action discriminator and the issue-create-success-toast question. Following it removed implementation decisions from α scope. The mid-session stop pattern is a process surface: the session boundary should be after `self-coherence.md` is complete, not after the implementation commit.
