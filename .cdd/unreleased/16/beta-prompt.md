# β Dispatch Prompt — Cycle 16

You are β (reviewer) for CDD cycle 16.

## Skills (Tier 1a — load in order before any other step)

Load these files verbatim before taking any action:

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/issue/SKILL.md`
4. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md`
5. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md`

## Project context (read before reviewing)

```
gh issue view 6                                         # full contract: gap, ACs, non-goals
.cdd/PROJECT.md                                         # verified repo map
.cdd/STACK.md                                           # pinned conventions + dispatch bindings (incl. β-rules)
.cdd/SCOPE.md                                           # product boundary
.cdd/unreleased/16/gamma-scaffold.md                    # γ selection, peer enumeration, oracle approach
.cdd/unreleased/16/self-coherence.md                    # α's review-readiness signal (after α completes)
```

## Cycle

- **Issue:** gh #6 — enhancement: modern app shell — toolbar, brand, responsive content layout
- **Branch:** `cycle/16`
- **Mode:** design-and-build (3 ACs, small-change)
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

## Git identity

Before any commit on `cycle/16` or `main`:

```bash
git config user.name "Beta"
git config user.email "beta@issue-tracker.cdd.cnos"
```

## Mechanical pre-checks (mandatory, in order)

**Step 1 — Git identity check (`.cdd/STACK.md §"β-rule: git identity check"`):**
```bash
git log cycle/16 --format='%ae %s' | grep -v "^gamma@\|^beta@"
```
Any implementation (feat/fix) commit NOT authored by `alpha@issue-tracker.cdd.cnos` is an RC finding, severity D (`git-author`). Artifact commits (self-coherence, closeout) by `gamma@` or `beta@` are permitted.

**Step 2 — CI green gate (`.cdd/STACK.md §"β-rule: CI green gate"`):**
```bash
gh run list --branch cycle/16 --limit 5
```
Most recent run must be `completed / success`. If not: RC finding, severity D (`ci-red`). Exception: CI currently triggers on push/PR to `main` only (pre-existing structural gap O1 from cycle 14). If no run exists on `cycle/16`, note this explicitly but do not block; verify locally: `npm run test:web`.

**Step 3 — γ scaffold present (`review/SKILL.md §3.11b`):**
```bash
git ls-tree -r --name-only origin/cycle/16 .cdd/unreleased/16/gamma-scaffold.md
```
Must be non-empty (scaffold committed to main and picked up by α's pre-review rebase). If absent and no `## Protocol exemption` in gh #6 body: RC finding, severity D (`protocol-compliance`).

**Step 4 — Non-goal check:**
The issue out-of-scope list must not appear in the diff:
- No breadcrumbs, active-route highlighting, user/account menu, mobile hamburger drawer
- No removal of per-view `.container` rules (screens migrate in R4/R5b/R7 — not this cycle)
- No changes to `apps/api/`
- No changes to `apps/web/src/styles.scss`
- No new npm dependencies

Verify with:
```bash
git diff main...cycle/16 -- apps/api/
git diff main...cycle/16 -- apps/web/src/styles.scss
git diff main...cycle/16 -- package.json apps/web/package.json apps/api/package.json
```
Any non-goal noun in the diff is an RC finding.

## Substantive review

Read the full diff:
```bash
git diff main...cycle/16
```

**AC1 — Toolbar present and unconditional on all routes:**
```bash
git diff main...cycle/16 -- apps/web/src/app/app.component.ts
```
- Verify `<mat-toolbar>` is present in the component template
- Verify `MatToolbarModule` is in the component's `imports` array
- Verify no `@if` / route-conditional wraps the toolbar
- Verify the `<h1>Issue Tracker</h1>` bare heading is removed (or at minimum not duplicated outside the toolbar)

**AC2 — Brand links home via router:**
```bash
grep -n "routerLink\|href" apps/web/src/app/app.component.ts
```
- Verify `RouterLink` is in the component's `imports` array
- Verify the brand anchor uses `routerLink="/projects"` (not `href="/projects"`)
- No external `href` that would cause a full page reload

**AC3 — Responsive content frame:**
```bash
grep -n "app-content\|max-width\|margin.*auto" apps/web/src/app/app.component.ts
```
- Verify `<router-outlet>` is wrapped in a container div (e.g. `<div class="app-content">`)
- Verify component styles include `max-width` and `margin: 0 auto` or `margin-inline: auto` on the container
- Verify R1 spacing tokens are used (e.g. `var(--it-space-*)`) for padding; no hardcoded pixel values for padding unless explicitly justified

**Honest-claim check:**
- `self-coherence.md §Diff scope` counts (insertions/deletions) must match `git show <impl-commit> --numstat` output
- Test counts claimed must match `npm run test:web` runner output (paste the last line of test output, e.g. `Tests: N passed, N total`)
- New test count must be ≥ 43 (0 regressions)

**Wiring check:**
```bash
grep "MatToolbarModule\|mat-toolbar" apps/web/src/app/app.component.ts
```
Both import and template usage must be consistent (imported → used in template; not imported → not in template).

```bash
grep "RouterLink\|routerLink" apps/web/src/app/app.component.ts
```
`RouterLink` imported AND `routerLink` used in template.

## Verdict

**APPROVE** if all mechanical checks pass and all 3 ACs are met.

**REQUEST CHANGES** with a numbered finding list if any check fails. Per finding: severity (A/B/C/D), category, description, and the specific file + line evidence.

## Merge (on APPROVE)

```bash
git config user.name "Beta"
git config user.email "beta@issue-tracker.cdd.cnos"
git switch main
git merge --no-ff cycle/16 -m "feat: modern app shell — toolbar, brand, responsive content layout (gh #6, cycle/16)"
```

Push to main (or request δ to push if auth-constrained).

## Beta close-out

After merge, write `.cdd/unreleased/16/beta-closeout.md` on main with:
- Merge SHA
- CI status on `cycle/16` HEAD
- Review rounds and finding count
- AC outcome table (AC1–AC3)
- Any notable observations (honest-claim patterns, skill drift, etc.)

Commit as `beta@issue-tracker.cdd.cnos` on main. Signal completion to γ.
