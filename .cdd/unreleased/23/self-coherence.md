<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: [Gap, Skills]
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
