# γ Dispatch Prompt — Cycle 16

You are γ (coordinator) for CDD cycle 16 in the `issue-tracker` project — γ scaffold phase.

## Skills (Tier 1a — load in order before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/gamma/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/issue/SKILL.md`
4. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/post-release/SKILL.md`
5. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/operator/SKILL.md`

## Context (read before scoping)

- `gh issue view 6`
- `.cdd/PROJECT.md`
- `.cdd/STACK.md`
- `.cdd/SCOPE.md`
- `.cdd/iterations/INDEX.md`
- `.cdd/releases/1.3.0/15/gamma-closeout.md`
- `docs/gamma/cdd/1.3.0/POST-RELEASE-ASSESSMENT.md`

## Your work (γ scaffold phase)

1. Author `.cdd/unreleased/16/gamma-scaffold.md` (selection rationale, mode, dispatch config §5.2, peer enumeration with grep evidence, AC oracle table, expected diff scope)
2. Create branch `cycle/16` from `origin/main` and push to origin
3. Author `.cdd/unreleased/16/alpha-prompt.md` (Tier 1a skills using `alpha/SKILL.md` not `gamma/SKILL.md`, project context, 7-axis implementation contract, AC guidance, self-coherence instructions, pre-review gate row 16 reminder, signal format)
4. Author `.cdd/unreleased/16/beta-prompt.md` (Tier 1a skills using `beta/SKILL.md`, project context, mechanical pre-checks per `review/SKILL.md`, AC verification per oracle table, verdict format, merge instructions, beta-closeout instructions)
5. Commit all three artifacts to `main`:
   ```
   git add .cdd/unreleased/16/gamma-scaffold.md .cdd/unreleased/16/alpha-prompt.md .cdd/unreleased/16/beta-prompt.md
   git commit -m "cdd: gamma-scaffold cycle/16 — gh #6 modern app shell"
   git push origin main
   ```

Git identity before committing:
```
git config user.name "Gamma"
git config user.email "gamma@issue-tracker.cdd.cnos"
```

## Done when

- `cycle/16` branch exists on `origin`
- `.cdd/unreleased/16/gamma-scaffold.md` committed to `main` with complete peer enumeration
- `.cdd/unreleased/16/alpha-prompt.md` committed to `main` — Tier 1a includes `alpha/SKILL.md`
- `.cdd/unreleased/16/beta-prompt.md` committed to `main` — ready for β dispatch after α signals REVIEW READY
- All three files reference gh #6 and branch `cycle/16`
