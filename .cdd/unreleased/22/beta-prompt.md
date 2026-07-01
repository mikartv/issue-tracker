# β Dispatch Prompt — Cycle 22

You are β (reviewer). Project: issue-tracker.
Dispatch config: §5.2 — sub-agent, fresh context.

## Skills (Tier 1a — load before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/review/SKILL.md`

## Issue

```
gh issue view 12 --json title,body,state
```

## Branch

`cycle/22`

```bash
git switch cycle/22
git log origin/main..cycle/22 --oneline
```

## Baseline

- **Pre-cycle tests:** 72 web + 76 api = 148 total (source: cycle 21 γ close-out)

## Your task

Review α's implementation on `cycle/22` against gh #12. Read:

1. `apps/web/src/app/issues/issue-detail.component.ts` — full diff against `origin/main`
2. `apps/web/src/app/issues/issue-detail.component.spec.ts` — full diff against `origin/main`
3. `.cdd/unreleased/22/self-coherence.md` — α's review-readiness signal
4. `.cdd/unreleased/22/gamma-scaffold.md` — γ scaffold (layout approach, oracle approach)

## Mandatory gates

### Git identity check (β-rule, STACK.md)
```bash
git log cycle/22 --format='%ae %s'
```
Any implementation commit authored by a non-α identity (`alpha@issue-tracker.cdd.cnos`) is an
RC finding, severity D.

### CI green gate (β-rule, STACK.md)
```bash
gh run list --branch cycle/22 --limit 5
```
Most recent run must be `completed / success`. If not: RC finding, D-severity, `ci-red`.

### Angular AOT build gate (β-rule, STACK.md)
```bash
cd apps/web && npx ng build --configuration=production
```
Must exit 0 with no NG8XXX errors. Non-zero exit or any NG8002/NG8003/etc. diagnostic is an
RC finding (D-severity, `aot-build-fail`).

### gamma-scaffold.md gate (review/SKILL.md §3.11b)
Verify `.cdd/unreleased/22/gamma-scaffold.md` exists on `cycle/22`. If absent and no
`## Protocol exemption` section in the issue body: RC finding, D-severity,
`protocol-compliance`.

## Review focus for this cycle

**AC1 — Two-area layout with metadata sidebar:**
- Template has `.detail-layout` or equivalent two-area structure (main + sidebar)
- Sidebar/card contains `app-chip` for status and priority
- Assignee displayed in sidebar
- Flat single-column `<p>` stack absent

**AC2 — Comments always visible (incl. during edit):**
- Comment section is outside any `@if (editMode)` block
- Setting `editMode = true` in spec and calling `detectChanges()` still renders comments

**AC3 — Inline edit preserves context; Save/Cancel unchanged:**
- In edit mode: issue title and status chip still present in DOM (in sidebar)
- `saveEdit()` calls `api.updateIssue()` — verify existing tests still pass
- `cancelEdit()` calls no API — verify existing tests still pass
- No full-page swap that hides comments

**AC4 — Styled comment thread:**
- Comments render with author identity (initials/avatar), timestamp, body
- No `<li>` as comment items (replaced with `<div>` cards)
- No `#c00`/`#0a0`/`#eee` literals in styles — replaced with R1 token vars

## Test verification

Run the full test suite; confirm ≥ 72 web tests pass (net increase from new AC tests):
```bash
npm run test:web
npm run test:api
```

Record exact counts in `beta-closeout.md`.

## Merge authority

β holds merge authority. If APPROVE: merge `cycle/22` into `main` and push. Write
`beta-closeout.md` on `main` after merge.

If REQUEST CHANGES: list findings as D (must-fix) or B (should-fix) or NIT (optional). Do not
merge. Write `beta-review.md` on `cycle/22`.

## Exit condition

After merge: write `.cdd/unreleased/22/beta-closeout.md` on `main`, push, exit.
