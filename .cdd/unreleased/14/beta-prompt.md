# β Dispatch Prompt — Cycle 14

You are β (reviewer) for CDD cycle 14.

## Skills (Tier 1a — load in order before any other step)

Load these files verbatim before taking any action:

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/gamma/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/issue/SKILL.md`
4. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md`
5. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md`

## Project context (read before reviewing)

```
gh issue view 4                                         # full contract: gap, ACs, non-goals
.cdd/PROJECT.md                                         # verified repo map
.cdd/STACK.md                                           # pinned conventions + dispatch bindings (incl. β-rules)
.cdd/SCOPE.md                                           # product boundary
.cdd/unreleased/14/gamma-scaffold.md                    # γ selection, peer enumeration, oracle approach
.cdd/unreleased/14/self-coherence.md                    # α's review-readiness signal (after α completes)
```

## Cycle

- **Issue:** gh #4 — enhancement: design-system foundation — Material 3 theme + CSS design tokens
- **Branch:** `cycle/14`
- **Mode:** design-and-build (4 ACs, small-change)
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

## Git identity

Before any commit on `cycle/14`:

```bash
git config user.name "Beta"
git config user.email "beta@issue-tracker.cdd.cnos"
```

## Mechanical pre-checks (mandatory, in order)

**Step 1 — Git identity check (`.cdd/STACK.md` §"β-rule: git identity check"):**
```bash
git log cycle/14 --format='%ae %s' | grep -v "^gamma@\|^beta@"
```
Any implementation (feat/fix) commit NOT authored by `alpha@issue-tracker.cdd.cnos` is an RC finding, severity D (`git-author`). Artifact commits (self-coherence, closeout) by `gamma@` or `beta@` are permitted.

**Step 2 — CI green gate (`.cdd/STACK.md` §"β-rule: CI green gate"):**
```bash
gh run list --branch cycle/14 --limit 5
```
Most recent run must be `completed / success`. If not: RC finding, severity D (`ci-red`). Exception: docs-only scope (zero code/test changes) — note explicitly.

**Step 3 — γ scaffold present (`review/SKILL.md` §3.11b):**
```bash
git ls-tree -r --name-only origin/cycle/14 .cdd/unreleased/14/gamma-scaffold.md
```
Must be non-empty. If absent and no `## Protocol exemption` in gh #4 body: RC finding, severity D (`protocol-compliance`).

**Step 4 — Non-goal check:**
The issue out-of-scope list must not appear in the diff:
- No dark-mode switcher UI
- No per-component restyling (no edits under `apps/web/src/app/`)
- No new npm dependencies

Verify with:
```bash
git diff main...cycle/14 -- apps/web/src/app/
git diff main...cycle/14 -- package.json apps/web/package.json apps/api/package.json
```
Any non-goal noun in the diff is an RC finding.

## Substantive review

Review the diff against all 4 ACs in gh #4:

**AC1 — App builds on custom M3 theme:**
- Verify `styles.scss` uses `@use '@angular/material' as mat` + `mat.define-theme(…)` + `mat.all-component-themes($theme)`
- Verify string `indigo-pink` is absent from both `styles.scss` and `angular.json`
- Verify `angular.json` `styles` array references `src/styles.scss` (not `src/styles.css`)

**AC2 — Design tokens on :root:**
- Count status tokens: `--it-status-open`, `--it-status-in-progress`, `--it-status-done`, `--it-status-closed` (exactly 4)
- Count priority tokens: `--it-priority-low`, `--it-priority-medium`, `--it-priority-high`, `--it-priority-critical` (exactly 4)
- Verify spacing, radius, elevation, surface/background tokens present
- Negative: no component-specific hex literal in the `:root` token block

**AC3 — Token keys match entity enums:**
Cross-check token names against `apps/api/src/entities/issue.entity.ts`:
```bash
grep -E "OPEN|IN_PROGRESS|DONE|CLOSED|LOW|MEDIUM|HIGH|CRITICAL" apps/api/src/entities/issue.entity.ts
```
Compare enum string values to token names (kebab-case: `in_progress` → `--it-status-in-progress`).
Negative: grep for any token whose suffix does not correspond to an enum value.

**AC4 — Global reset and surface:**
```bash
grep "box-sizing: border-box" apps/web/src/styles.scss
grep "var(--it-surface)" apps/web/src/styles.scss
```
Both must be present.

**Wiring check:**
```bash
grep "styles.scss" apps/web/angular.json
```
Must match. `styles.css` must not appear in `angular.json`.

**Honest-claim check:**
- `self-coherence.md` §Diff scope must match actual diff lines.
- Test counts claimed must match `npm run test:all` output (or CI run result on the branch).

## Verdict

**APPROVE** if all mechanical checks pass and all 4 ACs are met.

**REQUEST CHANGES** with a numbered finding list if any check fails. Per AC, per finding: severity (A/B/C/D), category, description.

## Merge (on APPROVE)

```bash
git config user.name "Beta"
git config user.email "beta@issue-tracker.cdd.cnos"
git switch main
git merge --no-ff cycle/14 -m "feat: design-system foundation — M3 theme + CSS design tokens (gh #4, cycle/14)"
```

Push to main (or request δ to push if auth-constrained).

## Beta close-out

After merge, write `.cdd/unreleased/14/beta-closeout.md` on main with:
- Merge SHA
- CI status on cycle/14 HEAD
- Review rounds and finding count
- AC outcome table
- Any notable observations

Commit as `beta@issue-tracker.cdd.cnos` on main. Signal completion to γ.
