---
cycle: 14
issue: "gh #4 — enhancement: design-system foundation — Material 3 theme + CSS design tokens"
role: γ
artifact: gamma-scaffold
---

# γ Scaffold — Cycle 14

## Selection

**Issue:** gh #4 — enhancement: design-system foundation — Material 3 theme + CSS design tokens
**Decisive clause:** `cnos.cds/skills/cds/CDS.md` §"Selection function" → maximum-leverage rule. gh #4 is the only open GitHub product issue at P1. It is the dependency root for R2–R8 redesign issues: no other product capability work is executable without this token layer. No P0 override applies; no operational-infrastructure override applies. 1.1.0 PRA (2026-06-19) recorded "pending selection at next γ session" — no prior-cycle MCA commitment was locked. MCI balance is healthy (not frozen).

**Rejected alternatives (non-obvious):**
- E2E automation (`smoke.e2e.spec.ts`) — process maturity gap, lower leverage than the token foundation; deferred since C10; no P1 designation.
- Automated root redirect test (`app.routes.spec.ts`) — debt closure, low effort, lowest leverage.
- ORM `@ManyToOne`/`@OneToMany` (D-CY2-4) — stale since C2, no converged design, low current product impact.

## Mode

**design-and-build** — palette values and typography decided in-cycle by α; no stable design doc or plan doc exists. Cycle scope sizing: 4 ACs, small-change band (1–4). Five-factor check: (a) 1 new file entry (styles.scss), no new module; (b) 2 files touched; (c) build-config + styles, single phase; (d) design-and-build by definition; (e) ships standalone. Keep whole.

## Peer Enumeration (§2.2a)

Impact graph directories: `apps/web/src/`, `apps/web/`.

**Grep evidence (run before authoring this scaffold):**
```
rg "indigo-pink|mat\.define-theme|--it-" apps/web/src/
→ 1 match: apps/web/src/styles.css:1:@import "@angular/material/prebuilt-themes/indigo-pink.css"
  No M3 theme surface and no --it-* tokens exist anywhere in the web source tree.

rg "scss" apps/web/angular.json
→ no matches — no SCSS builder configured.
```

**Gap framing:**
- M3 theme (`mat.define-theme`): does not exist — confirmed.
- CSS design tokens (`--it-*`): do not exist — confirmed.
- SCSS builder configuration in `angular.json`: does not exist — confirmed.

No overlap or consolidation required. Issue #4's gap assertion is empirically accurate.

## Surfaces γ Expects α to Touch

1. `apps/web/src/styles.css` → renamed/replaced by `apps/web/src/styles.scss`
2. `apps/web/angular.json` → `projects.web.architect.build.options.styles` updated from `src/styles.css` to `src/styles.scss`; SCSS preprocessor options added if Angular 17 builder requires explicit config
3. `apps/web/src/styles.scss` — new file replacing the CSS, containing:
   - `@use '@angular/material' as mat;` + `mat.define-theme(…)` with custom primary/tertiary palette and typography + `mat.all-component-themes($theme)` applied; indigo-pink prebuilt import removed
   - `:root` block: spacing scale (`--it-space-1..6`), radius (`--it-radius-sm/md/lg`), elevation (`--it-shadow-1/2`), surface/background, status tokens (4), priority tokens (4)
   - Global reset: `*, *::before, *::after { box-sizing: border-box; }` + `body { background: var(--it-surface); }`
   - Token comment block at the top of the `:root` section documenting token names

**Not expected:** any changes under `apps/api/`, `apps/web/src/app/**`, or component-level files. Applying tokens inside components is R2–R8 scope.

## AC Oracle Approach

**AC1 — App builds and runs on custom M3 theme:**
- Oracle: `npm run build -w apps/web` exits 0.
- Positive: build green; string `indigo-pink` absent from `styles.scss` and `angular.json`.
- Negative: if `indigo-pink` string remains → fail.
- Note: Angular dev-server visual inspection (non-indigo brand color) is the operator-visible projection; browser required.

**AC2 — Design tokens exposed on :root:**
- Oracle: `getComputedStyle(document.documentElement).getPropertyValue('--it-status-in-progress')` non-empty; all 4 status + 4 priority tokens resolved.
- Positive: 8 semantic tokens present.
- Negative: no component-specific hex literal in the token block.
- Known gap: browser required; no automated CSS-var assertion in the Jest suite.

**AC3 — Token keys match entity enums:**
- Oracle: cross-check token names against `apps/api/src/entities/issue.entity.ts`.
- Enum values → expected token names:
  - `open` → `--it-status-open`; `in_progress` → `--it-status-in-progress`; `done` → `--it-status-done`; `closed` → `--it-status-closed`
  - `low` → `--it-priority-low`; `medium` → `--it-priority-medium`; `high` → `--it-priority-high`; `critical` → `--it-priority-critical`
- Negative: no token for non-existent values (e.g. `--it-status-resolved`).
- Mechanical: β can grep token names in `styles.scss` and cross-reference the enum file directly.

**AC4 — Global reset and surface applied:**
- Oracle: computed `box-sizing` on an arbitrary element = `border-box`; computed `background` on `body` = surface token value.
- Browser required for computed-style inspection.
- Mechanical: `grep "box-sizing: border-box" styles.scss` and `grep "var(--it-surface)" styles.scss` (body block).

## Expected Diff Scope

- Files changed: 2 (`apps/web/angular.json` 1-line path update; `apps/web/src/styles.scss` new ~60–90 line SCSS file replacing 6-line CSS)
- git status: `styles.css` deleted, `styles.scss` added; `angular.json` modified
- API tests: unchanged (76 passing — no backend changes)
- Web tests: unchanged (42 passing — no component changes; SCSS token layer has no `.spec.ts`)
- Total expected: 118 tests pass, 0 regressions
