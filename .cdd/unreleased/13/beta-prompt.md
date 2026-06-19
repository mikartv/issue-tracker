# β Dispatch — Cycle 13

**Role:** β (reviewer)

## Load order (Tier 1a — mandatory, in order, before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/review/SKILL.md`

## Project context (read before review)

- `gh issue view 3` — full contract (gap, ACs, non-goals)
- `.cdd/PROJECT.md` — verified repo map
- `.cdd/STACK.md` — pinned conventions + dispatch bindings (incl. β-rules)
- `.cdd/unreleased/13/gamma-scaffold.md` — γ scope contract (surfaces, oracle, diff scope)
- `.cdd/unreleased/13/self-coherence.md` — α review-readiness signal and self-assessment
- `.cdd/SCOPE.md` — product boundary

## Branch

`cycle/13`

## Git identity

Set before any commit:

```bash
git config user.name "Beta"
git config user.email "beta@issue-tracker.cdd.cnos"
```

## Task

Review α's implementation on `cycle/13` against gh #3 and the γ scaffold.

1. **Mechanical gate — git identity** (`STACK.md §β-rule: git identity check`):
   ```bash
   git log cycle/13 --format='%ae %s'
   ```
   Any implementation (feat/fix) commit not authored by `alpha@issue-tracker.cdd.cnos` is
   RC finding severity D.

2. **Mechanical gate — CI green** (`STACK.md §β-rule: CI green gate`):
   ```bash
   gh run list --branch cycle/13 --limit 5
   ```
   Most recent run must be `completed / success`; if not, REQUEST CHANGES (D-severity, `ci-red`).

3. **Scope check** (γ scaffold §Surfaces α Will Touch):
   - Diff touches only `apps/web/src/app/app.routes.ts`.
   - No component, spec, or API file changed.
   - Redirect entry `{ path: '', redirectTo: 'projects', pathMatch: 'full' }` is present as
     the first entry in the `routes` array.

4. **AC1 verification:**
   - Redirect entry uses `pathMatch: 'full'` (not `prefix`) — required for exact empty-path match.
   - `redirectTo` value is `'projects'` (matches existing route exactly).
   - All three pre-existing routes remain present and unmodified.

5. **Test suite:** `npm run test:web` — 42 tests pass (or 43 if α added optional unit test).

6. Issue verdict:
   - `APPROVE` → merge `cycle/13` into `main`; write `.cdd/unreleased/13/beta-closeout.md`;
     commit to `main`; exit.
   - `REQUEST CHANGES` → write `beta-review.md` with structured findings (severity, class,
     AC/surface, description, required action); exit. δ re-dispatches α for fix round.
