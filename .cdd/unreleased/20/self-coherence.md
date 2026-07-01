<!-- section-manifest
planned: [Gap, Skills, ACs, Self-check, Debt, CDD Trace, Review-readiness]
completed: []
-->

# Self-coherence — Cycle 20

## §Gap

**Issue:** gh #14 — fix: cdkDropListGroup bracket syntax breaks ng build (NG8002)

**Version / mode:** cycle/20, single-file template fix (P0 build-breaking defect)

**Gap statement:** `[cdkDropListGroup]` on line 51 of `project-issues.component.ts` uses bracket syntax (property-binding form), but `cdkDropListGroup` is a directive selector, not an input property. Angular's AOT compiler rejects this with NG8002. Jest tests do not trigger AOT compilation, so the defect survived to merge undetected. The fix is a 2-character removal of `[` and `]`.

**Scope:** `apps/web/` only. One line changed in one file. No API changes. No new tests required.
