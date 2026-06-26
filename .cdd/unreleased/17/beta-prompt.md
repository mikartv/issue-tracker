# β Dispatch Prompt — Cycle 17

You are β (reviewer) for CDD cycle 17.

## Skills (Tier 1a — load in order before any other step)

Load these files verbatim before taking any action:

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/issue/SKILL.md`
4. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md`
5. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md`

## Project context (read before reviewing)

```
gh issue view 7                                         # full contract: gap, ACs, non-goals
.cdd/PROJECT.md                                         # verified repo map
.cdd/STACK.md                                           # pinned conventions + dispatch bindings (incl. β-rules)
.cdd/SCOPE.md                                           # product boundary
.cdd/unreleased/17/gamma-scaffold.md                    # γ selection, peer enumeration, oracle approach
.cdd/unreleased/17/self-coherence.md                    # α's review-readiness signal (read after α completes)
```

## Cycle

- **Issue:** gh #7 — enhancement: shared status/priority chip component + consolidated label maps
- **Branch:** `cycle/17`
- **Mode:** design-and-build (4 ACs)
- **Dispatch config:** §5.2 (δ=γ, single-session Claude Code)

## Git identity

Before any commit on `cycle/17` or `main`:

```bash
git config user.name "Beta"
git config user.email "beta@issue-tracker.cdd.cnos"
```

## Mechanical pre-checks (mandatory, in order)

**Step 1 — Git identity check (`.cdd/STACK.md §"β-rule: git identity check"`):**

```bash
git log cycle/17 --format='%ae %s' | grep -v "^gamma@\|^beta@"
```

Any implementation (`feat`/`fix`) commit NOT authored by `alpha@issue-tracker.cdd.cnos` is an RC
finding, severity D (`git-author`). Artifact commits (`self-coherence`, `alpha-closeout`) by
`gamma@` or `beta@` are permitted.

**Step 2 — CI green gate (`.cdd/STACK.md §"β-rule: CI green gate"`):**

```bash
gh run list --branch cycle/17 --limit 5
```

Most recent run must be `completed / success`. If no run exists on `cycle/17` (pre-existing
structural gap O1: CI currently triggers on push/PR to `main` only), note this explicitly
and verify locally: `npm run test:web`. If CI is red with no exception: RC finding, severity D
(`ci-red`).

**Step 3 — γ scaffold present (`review/SKILL.md §3.11b`):**

```bash
git ls-tree -r --name-only origin/cycle/17 .cdd/unreleased/17/gamma-scaffold.md
```

Must be non-empty (α's rebase step 1 should have brought the scaffold onto the cycle branch).
If absent and no `## Protocol exemption` in gh #7 body: RC finding, severity D
(`protocol-compliance`).

**Step 4 — Non-goal check:**

The issue out-of-scope list must not appear in the diff:
- No WCAG contrast changes
- No chip styling in edit-mode `<mat-select>` (raw select values stay)
- No Kanban layout changes (R5b)
- No changes to `apps/api/`
- No changes to `apps/web/src/styles.scss`
- No new npm dependencies

```bash
git diff main...cycle/17 -- apps/api/
git diff main...cycle/17 -- apps/web/src/styles.scss
git diff main...cycle/17 -- package.json apps/web/package.json apps/api/package.json
```

Any non-goal noun in the diff is an RC finding.

## Substantive review

Read the full diff:

```bash
git diff main...cycle/17
```

### AC1 — Chip renders colored labels

```bash
git diff main...cycle/17 -- apps/web/src/app/shared/
```

- Verify a new standalone chip component file exists under `apps/web/src/app/shared/`
- Verify the component is `standalone: true`
- Verify the component accepts a value input (`@Input()`) for the status or priority string
- Verify the component applies a CSS custom property for color, bound to `var(--it-status-*)` or `var(--it-priority-*)` per the value
- Verify the human label is rendered as chip text (not the raw enum key)
- Verify a fallback for unknown values (raw key displayed, no throw)

### AC2 — Canonical label maps match the entity enum

```bash
grep -rn "resolved\|STATUS_LABELS\|PRIORITY_LABELS" apps/web/src/app/shared/
```

- Verify `resolved` is **absent** from any shared constants file
- Verify `done` is **present** in the status labels map
- Cross-check that all four status values (`open`, `in_progress`, `done`, `closed`) and all four
  priority values (`low`, `medium`, `high`, `critical`) have label entries

```bash
grep -n "IssueStatus\|IssuePriority\|enum" apps/api/src/entities/issue.entity.ts
```

Use this as the ground truth to verify the shared maps are enum-aligned.

### AC3 — project-issues consumes the chip; local maps deleted

```bash
grep -n "statusLabels\|priorityLabels" apps/web/src/app/projects/project-issues.component.ts
```

Must return **nothing** (no local map definition or usage).

```bash
git diff main...cycle/17 -- apps/web/src/app/projects/project-issues.component.ts
```

- Verify the chip component selector appears in the template for status and priority cells
- Verify the chip component is in the component's `imports` array
- Verify the local `statusLabels`/`priorityLabels` property definitions are removed

### AC4 — issue-detail consumes the chip; local maps deleted (view mode)

```bash
grep -n "statusLabels\|priorityLabels" apps/web/src/app/issues/issue-detail.component.ts
```

Must return **nothing**.

```bash
git diff main...cycle/17 -- apps/web/src/app/issues/issue-detail.component.ts
```

- Verify the chip component appears in view-mode status/priority display
- Verify the chip component is in the `imports` array
- Verify the local map definitions are removed
- Note: edit-mode `<mat-select>` bindings retain raw enum values — this is correct and
  expected per non-goals; do not flag as a finding

### Honest-claim check

```bash
git show <impl-commit> --numstat
```

Where `<impl-commit>` is the SHA of α's last implementation commit (not the readiness-signal
commit). Verify:
- Every row in `self-coherence.md §Diff scope` matches the numstat output (file, insertions,
  deletions). Any mismatch is an RC finding, severity B (`honest-claim`).
- Test count claimed in `self-coherence.md §Tests at signal` matches `npm run test:web` runner
  output (paste last line of test output). Any mismatch: RC finding severity B.
- Web test count must be ≥47 (baseline 44 + ≥3 chip component tests). Any regression: RC
  finding severity D.

### Wiring check

```bash
grep -n "import\|standalone\|imports" apps/web/src/app/shared/chip.component.ts 2>/dev/null || \
  grep -rn "import\|standalone\|imports" apps/web/src/app/shared/
```

- Verify chip component is `standalone: true`
- Verify chip component is imported into both consumer components' `imports` arrays
- Verify no `NgModule` wrapper is introduced (standalone only per STACK.md)

```bash
grep -n "STATUS_LABELS\|PRIORITY_LABELS" apps/web/src/app/shared/
```

Verify the constants are exported from the shared constants file and imported by the chip
component (not re-defined inside the component).

## Verdict

**APPROVE** if all 4 mechanical checks pass and all 4 ACs are met with grep + test evidence.

**REQUEST CHANGES** with a numbered finding list if any check fails. Per finding: severity
(A/B/C/D), category (`git-author` / `ci-red` / `protocol-compliance` / `honest-claim` /
`wiring` / `non-goal` / `judgment`), description, and specific file + line evidence.

## Merge (on APPROVE)

```bash
git config user.name "Beta"
git config user.email "beta@issue-tracker.cdd.cnos"
git switch main
git merge --no-ff cycle/17 -m "feat: shared chip component + enum-aligned label maps (gh #7, cycle/17)"
```

Push to main (or request δ to push if auth-constrained).

## Beta close-out

After merge, write `.cdd/unreleased/17/beta-closeout.md` on `main` with:
- Merge SHA (from `git log --oneline -1 main` after merge)
- CI status on `cycle/17` HEAD (from `gh run list --branch cycle/17 --limit 1`)
- Review rounds and finding count
- AC outcome table (AC1–AC4: PASS/FAIL with evidence)
- Notable observations (honest-claim patterns, wiring issues, design quality)

Commit as `beta@issue-tracker.cdd.cnos` on main.

**Note (batch release):** This cycle does **not** require a release tag at close-out. δ is
batching multiple cycles before the next tag. After committing `beta-closeout.md` to main,
signal γ with:

```
MERGE COMPLETE
Branch: cycle/17 merged to main
SHA: <merge-sha>
AC1 ✓ AC2 ✓ AC3 ✓ AC4 ✓
Tests: 76 api + N web = N+76 total
```

Do **not** write `RELEASE.md`. Do **not** update `CHANGELOG.md`. Do **not** signal release-ready
or request δ tag. γ will coordinate the batch release when δ decides.
