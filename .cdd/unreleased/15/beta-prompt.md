# β Dispatch Prompt — Cycle 15

You are β (reviewer) for CDD cycle 15.

## Skills (Tier 1a — load in order before any other step)

Load these files verbatim before taking any action:

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/gamma/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/issue/SKILL.md`
4. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md`
5. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md`

## Project context (read before reviewing)

```
gh issue view 5                                         # full contract: gap, ACs, non-goals
.cdd/PROJECT.md                                         # verified repo map
.cdd/STACK.md                                           # pinned conventions + dispatch bindings (incl. β-rules)
.cdd/SCOPE.md                                           # product boundary
.cdd/unreleased/15/gamma-scaffold.md                    # γ selection, peer enumeration, oracle approach
.cdd/unreleased/15/self-coherence.md                    # α's review-readiness signal (after α completes)
```

## Cycle

- **Issue:** gh #5 — enhancement: redesign Projects screen — card grid, empty + loading states
- **Branch:** `cycle/15`
- **Mode:** design-and-build (4 ACs, small-change)
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

## Git identity

Before any commit on `cycle/15`:

```bash
git config user.name "Beta"
git config user.email "beta@issue-tracker.cdd.cnos"
```

## Mechanical pre-checks (mandatory, in order)

**Step 1 — Git identity check (`.cdd/STACK.md` §"β-rule: git identity check"):**
```bash
git log cycle/15 --format='%ae %s' | grep -v "^gamma@\|^beta@"
```
Any implementation (feat/fix) commit NOT authored by `alpha@issue-tracker.cdd.cnos` is an RC finding, severity D (`git-author`). Artifact commits (self-coherence, closeout) by `gamma@` or `beta@` are permitted.

**Step 2 — CI green gate (`.cdd/STACK.md` §"β-rule: CI green gate"):**
```bash
gh run list --branch cycle/15 --limit 5
```
Most recent run must be `completed / success`. If not: RC finding, severity D (`ci-red`). Exception: CI currently triggers on push/PR to `main` only (pre-existing structural gap noted in cycle 14 closeout O1) — if no run exists on `cycle/15`, note this explicitly but do not block on it. Verify tests locally if needed: `npm run test:web`.

**Step 3 — γ scaffold present (`review/SKILL.md` §3.11b):**
```bash
git ls-tree -r --name-only origin/cycle/15 .cdd/unreleased/15/gamma-scaffold.md
```
Must be non-empty. If absent and no `## Protocol exemption` in gh #5 body: RC finding, severity D (`protocol-compliance`).

**Step 4 — Non-goal check:**
The issue out-of-scope list must not appear in the diff:
- No project rename UI (no new rename input/form)
- No search, filter, or pagination controls
- No changes to `apps/api/`
- No changes to `apps/web/src/styles.scss` (tokens applied inline in component styles only)

Verify with:
```bash
git diff main...cycle/15 -- apps/api/
git diff main...cycle/15 -- apps/web/src/styles.scss
git diff main...cycle/15 -- package.json apps/web/package.json apps/api/package.json
```
Any non-goal noun in the diff is an RC finding.

## Substantive review

Read the full diff:
```bash
git diff main...cycle/15
```

**AC1 — Responsive card grid:**
```bash
git diff main...cycle/15 -- apps/web/src/app/projects/projects-list.component.ts
```
- Verify `<table mat-table>` is absent from the template
- Verify `mat-card` elements are present in the template
- Verify `MatTableModule` is removed from imports array
- Verify `MatCardModule` is present in imports array
- Verify component styles contain a CSS grid layout rule
- Verify `displayedColumns` property is removed (or at least unused)

**AC2 — Designed empty state:**
- Verify the `@else if (projects.length === 0)` (or `@if`) branch renders more than a bare `<p>No projects yet.</p>`
- Required: an icon or visual element, a text message, and a "Create project" CTA element
- Negative: `No projects yet.` as a raw unstyled string must not be the only content in the empty branch

**AC3 — Loading state:**
- Verify `@if (loading)` branch renders a spinner or skeleton element (not an empty block)
- The existing `<mat-spinner>` or equivalent must be present

**AC4 — Actions preserved + token cleanup:**
- Verify card name links use `[routerLink]="['/projects', project.id, 'issues']"`
- Verify Archive button calls `archiveProject(project)` and the 409 inline error path is intact
- Verify create project form is still present and functional (inline or dialog)
- Verify `#c00` and `#ccc` literals are absent from component styles:
  ```bash
  grep -n "#c00\|#ccc" apps/web/src/app/projects/projects-list.component.ts
  ```
  Must return no matches.
- Verify replacement uses `var(--it-*)` tokens from R1:
  ```bash
  grep "var(--it-" apps/web/src/app/projects/projects-list.component.ts
  ```
  Must return at least 2 matches (for the two error color replacements and the archived-badge replacement).

**Honest-claim check:**
- `self-coherence.md` §Diff scope must match actual diff lines (insertions/deletions count)
- Test counts claimed must match `npm run test:web` output (or CI run result)
- New test count must be ≥ 42 (0 regressions)

**Wiring check:**
```bash
grep "mat-card\|MatCardModule" apps/web/src/app/projects/projects-list.component.ts
```
Both the import and template usage must be consistent (imported → used; not imported → not used).

## Verdict

**APPROVE** if all mechanical checks pass and all 4 ACs are met.

**REQUEST CHANGES** with a numbered finding list if any check fails. Per finding: severity (A/B/C/D), category, description.

## Merge (on APPROVE)

```bash
git config user.name "Beta"
git config user.email "beta@issue-tracker.cdd.cnos"
git switch main
git merge --no-ff cycle/15 -m "feat: redesign Projects screen — card grid, empty + loading states (gh #5, cycle/15)"
```

Push to main (or request δ to push if auth-constrained).

## Beta close-out

After merge, write `.cdd/unreleased/15/beta-closeout.md` on main with:
- Merge SHA
- CI status on `cycle/15` HEAD
- Review rounds and finding count
- AC outcome table (AC1–AC4)
- Any notable observations

Commit as `beta@issue-tracker.cdd.cnos` on main. Signal completion to γ.
