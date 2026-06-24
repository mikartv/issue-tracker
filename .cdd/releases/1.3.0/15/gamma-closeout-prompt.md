# γ Dispatch — Cycle 15, Close-out

You are γ for CDD cycle 15. All roles have completed. Write the gamma close-out and execute immediate outputs.

## Skills (Tier 1a — load in order before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/gamma/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md`
4. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md`

## Read first

```
.cdd/unreleased/15/gamma-scaffold.md
.cdd/unreleased/15/self-coherence.md
.cdd/unreleased/15/beta-review.md
.cdd/unreleased/15/beta-closeout.md
.cdd/unreleased/15/alpha-closeout.md
.cdd/releases/1.2.0/14/gamma-closeout.md   # last closed cycle
.cdd/PROJECT.md
CHANGELOG.md
```

## Git identity

```bash
git config user.name "Gamma"
git config user.email "gamma@issue-tracker.cdd.cnos"
git switch main
```

## Work

1. Write `.cdd/unreleased/15/gamma-closeout.md` — cycle summary, post-merge verification, triage table, iteration triggers, independent process-gap check (§2.9), immediate outputs, deferred outputs, next MCA.

2. **Immediate outputs** (commit to main):
   - Update `.cdd/PROJECT.md` — Last verified date, test count (119 = 76 api + 43 web), cycle 15 decision.
   - Update `CHANGELOG.md` — add entry for cycle 15.
   - Move `.cdd/unreleased/15/` → appropriate release dir (check cycle 14 closeout to determine correct version).

3. Commit all immediate outputs as `gamma@issue-tracker.cdd.cnos`.
