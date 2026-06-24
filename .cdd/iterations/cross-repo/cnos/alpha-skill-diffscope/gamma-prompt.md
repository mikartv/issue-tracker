# γ Dispatch — MCA: alpha/SKILL.md §2.6 row 16 (§Diff scope verification)

**Source:** issue-tracker cycle 15, loaded-skill miss trigger  
**Target:** `usurobor/cnos` — `src/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`  
**Type:** immediate output (skill patch, doc-only change)  
**Mode:** operator-as-γ, single-session Claude Code

---

## Context

Issue-tracker cycle 15 closed with a loaded-skill miss trigger:

> `alpha/SKILL.md §2.6 pre-review gate` does not require α to run
> `git show <impl-commit> --numstat` and verify that the output matches
> the §Diff scope table in `self-coherence.md` before signaling
> review-readiness.

This omission has produced honest-claim F-class findings across multiple
cycles (cycle 15 F-1, and earlier cycles per pattern noted in
`issue-tracker/.cdd/releases/1.3.0/15/gamma-closeout.md §Cycle Iteration
Triggers`). The fix is a single new row in the gate checklist.

**Evidence:**
- Cycle 15 `self-coherence.md §Diff scope` claimed `+110/−57`; actual
  (`git show 757a528 --numstat`) was `+93/−46` — 5 of 6 values wrong.
- Fix was documentation-only (`1afb6eb`); no code regression.
- β caught it via honest-claim check; cost: 1 extra review round.
- γ-closeout: "Diff-count mismatch in `self-coherence.md` is a recurring
  class: it has appeared in multiple cycles."
- Loaded-skill miss trigger fired; patch committed as next MCA.

---

## Work

Add **row 16** to `§2.6. Pre-review gate` in
`cnos/src/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`,
immediately after row 15 (the γ-side artifact presence row) and before
the **SHA citations** paragraph:

```
16. **§Diff scope counts verified via runner output.** Before signaling
review-readiness, run `git show <impl-commit> --numstat` (where
`<impl-commit>` is the SHA of the last implementation commit, not the
readiness-signal commit) and verify that the insertions and deletions in
every row of `self-coherence.md §Diff scope` match the `--numstat`
output exactly. Do not use estimated or preliminary counts. If any value
mismatches, update `self-coherence.md §Diff scope` before signaling. *Derives
from: issue-tracker cycle 15 F-1 (B, honest-claim) — §Diff scope stated
`+110/−57`; actual `git show 757a528 --numstat` was `+93/−46`; 5 of 6 values
wrong; β caught via honest-claim check; pattern confirmed across multiple
prior cycles. γ-closeout loaded-skill miss trigger fired 2026-06-24.*
```

**Peer enumeration before editing:**

1. `grep -n "Diff scope\|numstat\|diff.*count" src/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`
   — confirm no existing row covers this (expected: no match).
2. Check whether `beta/SKILL.md` or `review/SKILL.md` cross-reference
   §Diff scope verification — if so, note in commit message; no change
   needed to β/review (β's honest-claim check is the *detection* surface;
   this row is the *prevention* surface at α).
3. Confirm vendor copy in `cn-sigma` will need re-vendoring after this
   lands (note as debt in commit message; do not touch vendor copy directly).

**No other files change.** This is a documentation-only patch to one file.

---

## Artifacts

1. Commit the row 16 addition to `src/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`
   on `main` (or a branch — follow cnos operator convention).

   Suggested commit message:
   ```
   skill(alpha): add §2.6 row 16 — §Diff scope verification via git show --numstat

   Loaded-skill miss from issue-tracker cycle 15 (F-1, honest-claim):
   alpha/SKILL.md §2.6 pre-review gate had no row requiring mechanical
   verification of self-coherence.md §Diff scope counts against
   git show --numstat output. Pattern appeared in multiple cycles.
   Row 16 closes the gap.

   Source: issue-tracker/.cdd/iterations/cross-repo/cnos/alpha-skill-diffscope/
   ```

2. Note in `issue-tracker/.cdd/iterations/cross-repo/cnos/alpha-skill-diffscope/STATUS`
   (operator writes after commit):
   ```
   landed: <cnos-commit-sha> — row 16 committed to cnos main <date>
   ```

3. cn-sigma re-vendor of `cnos.cdd` is a separate deferred step (when
   cn-sigma next vendors from cnos).

---

## Done when

- `git show <cnos-commit> --stat` shows exactly one file changed:
  `src/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`
- Row 16 is present, contains the `git show --numstat` instruction, and
  carries the empirical anchor `*Derives from: issue-tracker cycle 15 F-1...*`
- No other files modified.
