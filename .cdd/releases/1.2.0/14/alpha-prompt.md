# α Dispatch Prompt — Cycle 14

You are α (implementer) for CDD cycle 14.

## Skills (Tier 1a — load in order before any other step)

Load these files verbatim before taking any action:

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/gamma/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/issue/SKILL.md`
4. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md`
5. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md`

## Project context (read before implementing)

```
gh issue view 4                                         # full contract: gap, ACs, non-goals
.cdd/PROJECT.md                                         # verified repo map
.cdd/STACK.md                                           # pinned conventions + dispatch bindings
.cdd/SCOPE.md                                           # product boundary
.cdd/unreleased/14/gamma-scaffold.md                    # γ selection, peer enumeration, oracle approach
.cdd/iterations/INDEX.md                                # prior protocol findings
.cdd/releases/1.1.0/13/gamma-closeout.md               # last closed cycle
docs/gamma/cdd/1.1.0/POST-RELEASE-ASSESSMENT.md        # 1.1.0 PRA
```

## Cycle

- **Issue:** gh #4 — enhancement: design-system foundation — Material 3 theme + CSS design tokens
- **Branch:** `cycle/14`
- **Mode:** design-and-build (4 ACs, small-change)
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

## Git identity

Before any commit on `cycle/14`:

```bash
git config user.name "Alpha"
git config user.email "alpha@issue-tracker.cdd.cnos"
```

Switch to the branch before committing:

```bash
git switch cycle/14
```

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) — SCSS for styles |
| CLI integration target | N/A (standalone Angular SPA) |
| Package scoping | `apps/web/src/styles.scss`, `apps/web/angular.json` only |
| Existing-binary disposition | N/A |
| Runtime dependencies | `@angular/material ~17.3.0` (already installed — M3 `mat.define-theme` ships with it); no new npm deps |
| JSON/wire contract preservation | API contract unchanged; no backend changes |
| Backward-compat invariant | App must still render all existing routes; 118 tests (76 api + 42 web) must pass |

## Work

Implement all 4 ACs in gh #4 on branch `cycle/14`:

**AC1 — Custom M3 theme:**
- Rename `apps/web/src/styles.css` to `apps/web/src/styles.scss` (delete old, create new)
- Update `apps/web/angular.json` `projects.web.architect.build.options.styles` from `"src/styles.css"` to `"src/styles.scss"`
- In `styles.scss`: `@use '@angular/material' as mat;` + `mat.define-theme(…)` with a custom primary/tertiary palette and typography, then `@include mat.all-component-themes($theme)`. Remove the indigo-pink prebuilt import entirely.

**AC2 — Design tokens on :root:**
- Add a `:root` block declaring:
  - Spacing: `--it-space-1` through `--it-space-6`
  - Radius: `--it-radius-sm`, `--it-radius-md`, `--it-radius-lg`
  - Elevation: `--it-shadow-1`, `--it-shadow-2`
  - Surface/background: at minimum `--it-surface` and `--it-background`
  - Status semantics: `--it-status-open`, `--it-status-in-progress`, `--it-status-done`, `--it-status-closed`
  - Priority semantics: `--it-priority-low`, `--it-priority-medium`, `--it-priority-high`, `--it-priority-critical`
- Add a short comment block above `:root` documenting the token vocabulary

**AC3 — Token keys match entity enums:**
- Token names must be kebab-cased from the `IssueStatus` / `IssuePriority` enum values in `apps/api/src/entities/issue.entity.ts`
- `in_progress` → `--it-status-in-progress` (underscore → hyphen)
- No token for values not in the enums (e.g. no `--it-status-resolved`)

**AC4 — Global reset and surface:**
- `*, *::before, *::after { box-sizing: border-box; }`
- `body { margin: 0; background: var(--it-surface); font-family: Roboto, "Helvetica Neue", sans-serif; }`

## Self-coherence

Write `.cdd/unreleased/14/self-coherence.md` on `cycle/14` before signaling review-readiness. Use the template at `docs/gamma/cdd/SELF-COHERENCE-TEMPLATE.md` (or the standard CDD self-coherence form). Include:
- Gap covered, AC outcomes (PASS/FAIL per AC)
- Diff scope (files changed, insertions, deletions)
- Tests at signal (api + web counts)
- Any Known Gaps or Debt
- CDD Trace

## Signal

After all ACs pass and self-coherence is committed to `cycle/14`:

```
REVIEW READY
Branch: cycle/14
ACs: AC1 ✓ AC2 ✓ AC3 ✓ AC4 ✓
Tests: 76 api + 42 web = 118 total
```

Do not merge. Do not push to main. β will review.
