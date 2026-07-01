# β Dispatch Prompt — Cycle 20

You are β (reviewer). Project: issue-tracker.

## Skills (Tier 1a — load in order before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/review/SKILL.md`

## Issue

```
gh issue view 14 --json title,body,state
```

## Project context (read before reviewing)

```
.cdd/PROJECT.md
.cdd/STACK.md
.cdd/unreleased/20/gamma-scaffold.md
.cdd/unreleased/20/self-coherence.md
```

## Cycle

- **Issue:** gh #14
- **Cycle:** 20
- **Branch:** `cycle/20`

## Task

Review α's implementation on `cycle/20` against gh #14 and verify all ACs.

## Acceptance criteria to verify

1. `ng build --configuration=production` exits 0 (run from `apps/web/` directory) — no NG8002 or other diagnostic
2. All existing 61 web tests pass: `npm run test:web`

## β-rules from STACK.md (binding)

- **Git identity check:** `git log cycle/20 --format='%ae %s'` — any implementation commit by a non-α identity is RC (D-severity)
- **CI green gate:** `gh run list --branch cycle/20 --limit 5` — most recent run must be `completed / success`; if not, RC (D-severity, `ci-red`)
- **Angular ng build:** For any cycle modifying Angular component templates, β MUST run `cd apps/web && npx ng build --configuration=production` and verify it exits 0 with no NG8XXX errors. Non-zero exit or NG8XXX diagnostic → RC (D-severity, `aot-build-fail`). This is the primary AC for this cycle.

## Non-goals (do not flag as findings)

- No new tests required for this defect fix
- No API, style, or routing changes expected

## On APPROVE

Merge `cycle/20` into `main` and write `.cdd/unreleased/20/beta-closeout.md` on `main`.

## Notes

- Dispatch config §5.2: α ran in a separate sub-agent; this is β's independent review session
- `gamma-scaffold.md` exists on `cycle/20` — rule 3.11b satisfied
- Expected diff: 1 file, 1 line, 2-char removal of `[` and `]`
