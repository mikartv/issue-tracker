<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: []
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
