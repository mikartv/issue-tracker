---
cycle: 16
issue: "gh #6 — enhancement: modern app shell — toolbar, brand, responsive content layout"
role: γ
artifact: gamma-scaffold
base-sha: f5f01ff60dd6e1fe56184ca64b2217d0f8abb370
---

# γ Scaffold — Cycle 16

## Selection rationale

**Decisive clause:** `cnos.cds/skills/cds/CDS.md §"Selection function" → §"Assessment-commitment default"`

Cycle 15 PRA §"Next Move" committed to gh #6 as the next MCA ("R3 redesign wave — select next component; natural candidate: `ProjectIssuesComponent` or `AppComponent` shell/header per weakest-axis rule"). δ filed gh #6 for the `AppComponent` shell — the correct selection by weakest-axis rule: `AppComponent` has no persistent chrome, no brand anchor, no global escape hatch; every routed screen currently re-implements its own `.container { max-width }`. The app shell frames all subsequent redesign-wave cycles (R4–R8).

**Alternatives considered and rejected:**
- `alpha/SKILL.md §2.6` row 16 patch (process gap, loaded-skill miss from cycle 15): landed in cnos at `a4b25e6` (2026-06-24); STATUS file confirms `landed`. Cross-repo bundle complete. No active CDD improvement outstanding — this candidate dissolves.
- `ProjectIssuesComponent` redesign: also a valid R3 candidate, but the shell wraps all screens and is the higher-leverage foundation.

## Mode

`design-and-build` — 3 ACs, 1 source file (`apps/web/src/app/app.component.ts`). No pre-existing stable design doc or plan doc; the issue body is the source of truth. MCA preconditions (stable design + stable plan at committed paths) are not met. Scope is bounded and small — no separate design cycle required.

## Dispatch config

**§5.2** (δ=γ, single-session Claude Code). Escalation criteria (§5.3) all negative:
- AC count: 3 (< 7 threshold)
- New contract surface: no (Angular-internal only; no API or cross-repo changes)
- β rounds expected: ≤2
- γ judgment calls expected mid-cycle: ≤1

## Peer enumeration (with grep evidence)

### 1. `MatToolbarModule` / `mat-toolbar`

```
rg "MatToolbarModule|mat-toolbar" apps/web/src/
```

**No matches.** `MatToolbarModule` does not exist anywhere in the codebase. This cycle is the first introduction. Additive framing confirmed — no existing surface to reconcile.

### 2. Responsive content frame in `AppComponent`

```
grep "app-content\|max-width\|app-shell" apps/web/src/app/app.component.ts
```

**No matches.** `AppComponent` has no responsive content frame. Current template is bare `<main><h1>Issue Tracker</h1><router-outlet /></main>`. The `<div class="app-content">` wrapper this cycle adds does not exist yet.

### 3. `RouterLink` in `AppComponent`

```
grep "RouterLink\|routerLink" apps/web/src/app/app.component.ts
```

**No matches.** `RouterLink` is imported in `projects-list.component.ts`, `project-issues.component.ts`, and `issue-detail.component.ts` (confirmed by existing cycles), but NOT in `AppComponent`. This cycle adds the first `RouterLink` import to AppComponent.

### 4. Per-view `max-width` containers (out of scope to remove)

```
grep -rn "max-width" apps/web/src/app/
```

**3 matches (pre-existing, out of scope):**
- `apps/web/src/app/projects/projects-list.component.ts`: `max-width: 960px` — per-view container
- `apps/web/src/app/projects/project-issues.component.ts`: `max-width: 1000px` — per-view container
- `apps/web/src/app/issues/issue-detail.component.ts`: `max-width: 800px` — per-view container

Per issue scope: "Removing per-view `.container` rules (screens migrate to the shell frame in R4/R5b/R7)" is explicitly out of scope. These do not conflict with the shell's `max-width` on the outer `app-content` container — they are inner per-view constraints.

### 5. `AppComponent` spec (existing tests)

```
find apps/web/src -name "app.component.spec.ts"
```

**Found:** `apps/web/src/app/app.component.spec.ts` — 2 existing tests:
- `should create the app` (truthy check)
- `should have title "issue-tracker"` (checks `app.title`)

These tests do not assert the DOM structure. Adding `MatToolbarModule` to AppComponent imports and updating the template will not break these tests, but α should update the spec to assert toolbar presence (AC1 verification surface). Known gap per issue proof plan: no responsive test (manual resize only).

## AC oracle table

| AC | Invariant | Oracle steps | Expected positive | Expected negative |
|----|-----------|--------------|-------------------|-------------------|
| AC1 | `<mat-toolbar>` unconditional on all routes | Navigate to `/projects`, `/projects/:id/issues`, `/issues/:id`; inspect DOM | `<mat-toolbar>` element present in DOM on all three routes | No route conditionally hides the toolbar |
| AC2 | Brand "Issue Tracker" as `routerLink="/projects"` anchor (no full reload) | Click brand anchor from `/issues/:id`; observe URL and page | Navigates to `/projects` via Angular router; no full page reload | No external `href`; no `<a href="/projects">` (which would reload) |
| AC3 | Routed content in centered container with token max-width; no body horizontal scroll at 375px | Load at 1440px and 375px viewport widths | Content centered at 1440px; fluid and non-overflowing at 375px; no horizontal `<body>` scrollbar | Horizontal scrollbar on `body` at 375px is absent |

## Surfaces γ expects α to touch

- `apps/web/src/app/app.component.ts` — primary; template + imports + inline styles
- `apps/web/src/app/app.component.spec.ts` — secondary; update spec to assert toolbar presence (1–2 new tests expected)

## Expected diff scope

- **Files changed:** 2 (`app.component.ts`, `app.component.spec.ts`)
- **`app.component.ts`:** ~+18 / ~-4 lines (add `MatToolbarModule`, `RouterLink` to imports; update template to `<mat-toolbar>` + `<div class="app-content">`; add `.app-content` CSS rule; remove bare `<h1>`)
- **`app.component.spec.ts`:** ~+8 / ~-3 lines (import `MatToolbarModule`; add 1–2 toolbar assertions)
- **Total estimate:** ~2 files, ~+26 / ~-7 lines
- **No new npm dependencies** — `MatToolbarModule` is in `@angular/material ~17.3.0` (already installed)
- **Test count:** 43 web (baseline) → 44–45 web (1–2 new toolbar/AC1 assertions); 76 api unchanged
- **Known gap per issue proof plan:** no component test for responsive layout at 375px — verified by manual resize only

## Dispatch config record

- **Mode:** §5.2 (δ=γ, single-session Claude Code; §5.2 ceiling applies to γ-axis grade)
- **α timeout budget:** `180s × 3 ACs = 540s` (small-change code cycle; heuristic floor per `operator/SKILL.md §5.2`)
- **β timeout budget:** `120s × 3 ACs = 360s`
- **Max fix rounds before escalation:** 2
