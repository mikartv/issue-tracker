# α Dispatch — Cycle 13

**Role:** α (implementer)

## Load order (Tier 1a — mandatory, in order, before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`

## Project context (read before implementation)

- `gh issue view 3` — full contract (gap, ACs, non-goals)
- `.cdd/PROJECT.md` — verified repo map
- `.cdd/STACK.md` — pinned conventions + dispatch bindings
- `.cdd/unreleased/13/gamma-scaffold.md` — γ scope contract (surfaces, oracle, diff scope)
- `.cdd/SCOPE.md` — product boundary

## Branch

`cycle/13` (created from `origin/main` at `b3cb456`). Switch before any commit:

```bash
git switch cycle/13
```

## Git identity

Set before any commit:

```bash
git config user.name "Alpha"
git config user.email "alpha@issue-tracker.cdd.cnos"
```

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) |
| CLI integration target | N/A — standalone web app |
| Package scoping | `apps/web/` |
| Existing-binary disposition | N/A — additive change only |
| Runtime dependencies | Node 20, Angular 17 |
| JSON/wire contract preservation | No API changes; no existing route removed or modified |
| Backward-compat invariant | Additive-only; all three existing routes unchanged |

## Task

Implement AC1 from gh #3 per the γ scaffold:

1. Add `{ path: '', redirectTo: 'projects', pathMatch: 'full' }` as the **first** entry in
   the `routes` array in `apps/web/src/app/app.routes.ts`.
2. Run `npm run test:web` — must pass (42 tests, zero regressions).
3. Write `.cdd/unreleased/13/self-coherence.md` per `alpha/SKILL.md` and commit to `cycle/13`.
4. Set `review-ready: true` in `self-coherence.md` to signal review-readiness.

No new automated test is required. Manual smoke (`http://localhost:4200/` → `/projects`) is
the AC1 oracle per the proof plan Known Gap. A unit test is optional; if added, commit it
before signaling review-readiness.
