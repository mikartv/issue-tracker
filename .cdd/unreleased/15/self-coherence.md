---
cycle: 15
issue: "gh #5 — enhancement: redesign Projects screen — card grid, empty + loading states"
role: α
artifact: self-coherence
---

# Self-Coherence — Cycle 15

## Gap Covered

`apps/web/src/app/projects/projects-list.component.ts` rendered a plain `mat-table`
with bare unstyled empty/error states and hardcoded `#c00`/`#ccc` color literals.
This cycle replaces the table with a responsive `mat-card` grid, adds a designed empty
state (icon + message + CTA), retains the existing loading spinner, and tokens all
hardcoded colors to R1 design tokens.

## AC Outcomes

| AC | Status | Evidence |
|----|--------|----------|
| AC1 — Responsive card grid | **PASS** | `<table mat-table>` removed; `<div class="projects-grid">` with `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` added; `@media (max-width: 767px)` forces single column; `MatTableModule` removed from imports; `MatCardModule` added |
| AC2 — Designed empty state | **PASS** | `<div class="empty-state">` with `<mat-icon>folder_open</mat-icon>`, `<p>No projects yet</p>`, and `<button mat-raised-button color="primary" (click)="scrollToCreate()">Create project</button>` replaces bare `<p>No projects yet.</p>` |
| AC3 — Loading state | **PASS** | `<mat-spinner diameter="40" />` inside `@if (loading)` retained; renders during initial load before API resolves |
| AC4 — Card actions preserved + token cleanup | **PASS** | `[routerLink]="['/projects', project.id, 'issues']"` on card link preserved; `archiveProject(project)` on Archive button preserved; 409 inline error via `archiveErrors[project.id]` preserved; create form intact with `scrollToCreate()` CTA linking to it; `.error` and `.inline-error` → `color: var(--it-priority-critical)`; `.archived-badge` background → `var(--it-surface)` with `color: var(--it-status-closed)` |

## Diff Scope

| File | Insertions | Deletions |
|------|-----------|-----------|
| `apps/web/src/app/projects/projects-list.component.ts` | +93 | −46 |
| `apps/web/src/app/projects/projects-list.component.spec.ts` | +17 | −11 |
| **Total** | **+110** | **−57** |

Commit: `757a528`

## Tests at Signal

| Suite | Count | Status |
|-------|-------|--------|
| API tests (CI / Postgres required) | 76 | Pass in CI (unchanged; no backend changes) |
| Web tests (local) | **43** | **Pass** |
| **Total** | **119** | **43 web verified locally; 76 api unaffected** |

Notes:
- Web test count: 43 (+1 vs 42 baseline) — added `AC1: renders mat-card elements and no mat-table` and `AC2: shows designed empty state with icon and CTA` tests (net +1 after replacing the stale `AC3: shows "No projects yet."` test with the updated `AC2` test)
- API tests require running Postgres (CI-only constraint — established precedent from cycles 13–14); 35 api unit tests pass locally; 76 api tests pass in CI; my changes are web-only

## Known Gaps / Debt

- **Grid responsiveness oracle:** AC1 grid layout is verified by test assertions (card count, link hrefs, no `<table>`) and code inspection. Visual multi-column vs single-column behavior at 1440px/375px requires manual browser verification — no automated viewport test exists (consistent with cycle 11 known gap pattern for routerLink).
- **`scrollIntoView` in tests:** `scrollToCreate()` uses `?.` optional chaining on `scrollIntoView` for JSDOM safety. No automated test verifies the scroll behavior itself (CTA button presence is tested; scroll is manual-verify only).
- **`displayedColumns` property removed:** The `readonly displayedColumns = ['name', 'actions']` class property was removed along with `MatTableModule`. No existing test referenced it directly; no regression.

## CDD Trace

| Step | Check | Result |
|------|-------|--------|
| 1 | Skills loaded (Tier 1a) | ✅ CDD.md, gamma/SKILL.md, issue/SKILL.md, post-release/SKILL.md, operator/SKILL.md all loaded at session start |
| 2 | Project context read | ✅ gh #5, PROJECT.md, STACK.md, SCOPE.md, gamma-scaffold.md all read before implementation |
| 3 | Tests present | ✅ 43 web tests pass; 35 api unit tests pass locally; 76 api tests pass in CI (unchanged) |
| 4 | Every AC has evidence | ✅ AC1–AC4 each have diff evidence + oracle result above |
| 5 | Known debt explicit | ✅ §Known Gaps documents grid responsiveness, scrollIntoView, displayedColumns removal |
| 6 | Schema/shape audit | ✅ Not applicable — no API contract or type schema changes |
| 7 | Peer enumeration completed | ✅ γ scaffold enumerated peers; α confirmed all 3 literal replacements per scaffold §Peer Enumeration item 5 |
| 8 | Harness audit | ✅ Not applicable — no schema-bearing contract changes |
| 9 | Git identity | ✅ `Alpha / alpha@issue-tracker.cdd.cnos` set before all commits |
| 10 | Branch | ✅ All commits on `cycle/15` |

## Review-Readiness Signal

All 4 ACs pass. 43 web tests pass. No regressions in web suite. API tests unchanged (web-only change).
