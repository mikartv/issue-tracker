# α Dispatch Prompt — Cycle 15

You are α (implementer) for CDD cycle 15.

## Skills (Tier 1a — load in order before any other step)

Load these files verbatim before taking any action:

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/gamma/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/issue/SKILL.md`
4. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md`
5. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md`

## Project context (read before implementing)

```
gh issue view 5                                         # full contract: gap, ACs, non-goals
.cdd/PROJECT.md                                         # verified repo map
.cdd/STACK.md                                           # pinned conventions + dispatch bindings
.cdd/SCOPE.md                                           # product boundary
.cdd/unreleased/15/gamma-scaffold.md                    # γ selection, peer enumeration, oracle approach
.cdd/iterations/INDEX.md                                # prior protocol findings
.cdd/releases/1.2.0/14/gamma-closeout.md                # last closed cycle
```

## Cycle

- **Issue:** gh #5 — enhancement: redesign Projects screen — card grid, empty + loading states
- **Branch:** `cycle/15`
- **Mode:** design-and-build (4 ACs, small-change)
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

## Git identity

Before any commit on `cycle/15`:

```bash
git config user.name "Alpha"
git config user.email "alpha@issue-tracker.cdd.cnos"
```

Switch to the branch before committing:

```bash
git switch cycle/15
```

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) — inline component CSS (no new SCSS files) |
| CLI integration target | N/A (standalone Angular SPA) |
| Package scoping | `apps/web/src/app/projects/projects-list.component.ts` and its spec file only |
| Existing-binary disposition | N/A |
| Runtime dependencies | `@angular/material ~17.3.0` (already installed; `MatCardModule`, `MatIconModule` available from it — no new npm deps) |
| JSON/wire contract preservation | API contract unchanged; no backend changes |
| Backward-compat invariant | All existing routes/behaviors preserved; 118 tests (76 api + 42 web) must pass with 0 regressions |

## Work

Implement all 4 ACs in gh #5 on branch `cycle/15`.

**AC1 — Responsive card grid:**
- Remove `MatTableModule` from imports array and `template`
- Add `MatCardModule` to imports
- Replace the `<table mat-table>` block with a card-container div + one `mat-card` per project
- Container uses CSS grid: multi-column at ≥768px (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`), single column at mobile — no horizontal overflow at any width
- Each card shows: project name (as `[routerLink]="['/projects', project.id, 'issues']"`), archived treatment (dimming/badge on archived cards), "Archive" button (primary action when not archived), and the existing per-project inline error

**AC2 — Designed empty state:**
- Replace the bare `<p>No projects yet.</p>` at `projects.length === 0` with a designed empty-state block
- Required elements: a recognizable icon (e.g. `<mat-icon>folder_open</mat-icon>` from `MatIconModule`), a short message ("No projects yet"), and a "Create project" CTA that triggers the create form or scrolls to it
- The bare unstyled string must not survive in the template

**AC3 — Loading state:**
- The existing `<mat-spinner diameter="40" />` inside `@if (loading)` already satisfies the oracle — retain it unless upgrading to card skeletons. If α upgrades to skeletons, ensure the spinner import is also clean. The invariant is: something renders during load, not a blank screen.

**AC4 — Card actions preserved + token cleanup:**
- Card name links to `/projects/:id/issues` (as before)
- Archive action calls `archiveProject(project)` with the existing 409 "Already archived" inline error
- Create project form remains functional (inline or dialog — α decides; creating projects must work)
- Replace all three hardcoded color literals in component styles with R1 tokens:
  - `.error { color: #c00 }` → `color: var(--it-status-closed)` (or a dedicated error token — use judgment; `--it-status-closed` is `#616161`, which may be too grey for errors; if so, use `--it-priority-critical: #b71c1c` — α decides which token best conveys error)
  - `.inline-error { color: #c00 }` → same reasoning
  - `.archived-badge { background: #ccc }` → `background: var(--it-surface)` or a muted token — α decides

## Self-coherence

Write `.cdd/unreleased/15/self-coherence.md` on `cycle/15` before signaling review-readiness. Use the standard CDD self-coherence form. Include:
- Gap covered, AC outcomes (PASS/FAIL per AC)
- Diff scope (files changed, insertions, deletions)
- Tests at signal (api + web counts)
- Any Known Gaps or Debt
- CDD Trace

## Signal

After all ACs pass and self-coherence is committed to `cycle/15`:

```
REVIEW READY
Branch: cycle/15
ACs: AC1 ✓ AC2 ✓ AC3 ✓ AC4 ✓
Tests: 76 api + N web = N+76 total
```

Do not merge. Do not push to main. β will review.
