---
cycle: 17
issue: "gh #7 — enhancement: shared status/priority chip component + consolidated label maps"
role: α
artifact: self-coherence
branch: cycle/17
---

# Self-Coherence — Cycle 17

## Gap covered

**Issue:** gh #7 — enhancement: shared status/priority chip component + consolidated label maps  
**Version:** 1.5.0 (pending batch release; this cycle does not trigger a tag)  
**Mode:** design-and-build (4 ACs)

Gap: status/priority rendered as plain text; label maps duplicated and divergent between `project-issues` (broken: `resolved` instead of `done`) and `issue-detail` (correct). No shared chip component exists.

## Skills

**Tier 1:**
- `CDD.md` — lifecycle and role contract
- `alpha/SKILL.md` — α role surface
- `issue/SKILL.md` — AC boundary interpretation
- `post-release/SKILL.md` — post-release doctrine
- `operator/SKILL.md` — dispatch config §5.2

**Tier 2:** Angular + TypeScript conventions (from `.cdd/STACK.md`)

**Tier 3:** None beyond Tier 1/2 for this cycle (Angular standalone components, no new tooling)

## Component design decision

**Chosen shape:** Single combined component `<app-chip [kind]="'status'|'priority'" [value]="...">`.

**Why:** Both status and priority chips share identical logic — label lookup from a map keyed by value, background color bound to a CSS variable whose name is derived from the same value. A single component with a `kind` input is strictly cleaner: one class, one spec, one selector. Two separate components (`<app-status-chip>` / `<app-priority-chip>`) would duplicate the entire component body. The `kind` input has two values, making the logic trivially branchable with no code smell.

## AC outcomes

### AC1 — Shared chip component renders colored labels: PASS

Evidence:
- `apps/web/src/app/shared/chip.component.ts` created — standalone component with `@Input() kind` and `@Input() value`
- `label` getter: returns `STATUS_LABELS[value] ?? value` (kind=status) or `PRIORITY_LABELS[value] ?? value` (kind=priority) — human label or raw key fallback
- `colorVar` getter: returns `var(--it-status-{key})` or `var(--it-priority-{key})` where `key = value.replace(/_/g, '-')`
- Template: `<span class="chip" [style.background-color]="colorVar">{{ label }}</span>`
- Chip component spec: 3 tests pass (see AC1 chip spec below)
- Chip does NOT use `MatChipsModule` — plain `<span>` with inline component CSS per dispatch option

### AC2 — Canonical label maps match the entity enum exactly: PASS

Evidence:
- `apps/web/src/app/shared/issue-labels.ts` created
- `STATUS_LABELS`: `{ open: 'Open', in_progress: 'In Progress', done: 'Done', closed: 'Closed' }` — matches `IssueStatus` enum exactly; `done` present; `resolved` absent
- `PRIORITY_LABELS`: `{ low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' }` — matches `IssuePriority` enum exactly
- Cross-checked against `apps/api/src/entities/issue.entity.ts` enum values: `IssueStatus.OPEN='open'`, `IN_PROGRESS='in_progress'`, `DONE='done'`, `CLOSED='closed'`; `IssuePriority.LOW='low'`, `MEDIUM='medium'`, `HIGH='high'`, `CRITICAL='critical'`

### AC3 — project-issues consumes the shared chip; local maps deleted: PASS

Evidence:
- `ChipComponent` imported and added to `imports` array in `ProjectIssuesComponent`
- Template status cell: `<app-chip [kind]="'status'" [value]="issue.status" />`
- Template priority cell: `<app-chip [kind]="'priority'" [value]="issue.priority" />`
- `statusLabels` and `priorityLabels` property definitions deleted
- Verification: `grep -n "statusLabels\|priorityLabels" apps/web/src/app/projects/project-issues.component.ts` → no output ✓
- Spec updated: AC5 test now also asserts `app-chip` elements present in DOM (≥ issues.length * 2)

### AC4 — issue-detail consumes the shared chip; local maps deleted (view mode only): PASS

Evidence:
- `ChipComponent` and `STATUS_LABELS` imported in `IssueDetailComponent`
- View mode status `<p>`: `<p><strong>Status:</strong> <app-chip [kind]="'status'" [value]="issue.status" /></p>`
- View mode priority `<p>`: `<p><strong>Priority:</strong> <app-chip [kind]="'priority'" [value]="issue.priority" /></p>`
- "Move to" button label: `Move to {{ getStatusLabel(nextStatus!) }}` where `getStatusLabel(key: string): string { return STATUS_LABELS[key] ?? key; }`
- Edit mode NOT modified (raw `<mat-select>` values remain — per issue non-goals)
- Local `statusLabels` and `priorityLabels` property definitions deleted
- Verification: `grep -n "statusLabels\|priorityLabels" apps/web/src/app/issues/issue-detail.component.ts` → no output ✓
- Spec updated: label-AC1 and label-AC2 tests now also assert `app-chip` is present in the status/priority `<p>` elements

## Diff scope

Implementation commit: `7ee531c`

```
git show 7ee531c --numstat

4	2	apps/web/src/app/issues/issue-detail.component.spec.ts
9	16	apps/web/src/app/issues/issue-detail.component.ts
4	1	apps/web/src/app/projects/project-issues.component.spec.ts
4	16	apps/web/src/app/projects/project-issues.component.ts
49	0	apps/web/src/app/shared/chip.component.spec.ts
40	0	apps/web/src/app/shared/chip.component.ts
13	0	apps/web/src/app/shared/issue-labels.ts

Total: 123 insertions, 35 deletions, 7 files changed
```

| File | Change | Insertions | Deletions |
|------|--------|-----------|-----------|
| `shared/chip.component.ts` | New — standalone chip component | 40 | 0 |
| `shared/issue-labels.ts` | New — STATUS_LABELS, PRIORITY_LABELS | 13 | 0 |
| `shared/chip.component.spec.ts` | New — 3 chip unit tests | 49 | 0 |
| `projects/project-issues.component.ts` | Modified — import chip, remove local maps, update template | 4 | 16 |
| `projects/project-issues.component.spec.ts` | Modified — add chip presence assertion | 4 | 1 |
| `issues/issue-detail.component.ts` | Modified — import chip+STATUS_LABELS, remove local maps, update view template | 9 | 16 |
| `issues/issue-detail.component.spec.ts` | Modified — add chip presence assertions | 4 | 2 |

## Tests at signal

```
Test Suites: 6 passed, 6 total
Tests:       47 passed, 47 total
Snapshots:   0 total
Time:        2.567 s
Ran all test suites.
```

Web: **47 passed** (baseline 44 + 3 new chip tests)  
API: 76 total (service tests: 35 pass; e2e tests require running Postgres — pre-existing infrastructure dependency, no API code changed)

## Known Gaps

1. **WCAG contrast not validated** — chip text (`color: #fff`) against the R1 token background colors has not been audited for WCAG AA contrast ratios. Deferred per issue non-goals: "WCAG contrast audit (named known gap)."

2. **`gamma-scaffold.md` on `origin/cycle/17`** — the file lives on `origin/main` and is accessible in the working tree via the rebase in Step 1. `git ls-tree -r --name-only origin/cycle/17 .cdd/unreleased/17/gamma-scaffold.md` returns empty because the file is committed to `main`, not directly to the cycle branch. The §5.1 γ-artifact path check is satisfied via the rebase: the file is present and readable locally. Known as expected behavior for this dispatch config.

## CDD Trace

| Step | Action | Artifact |
|------|--------|---------|
| 1. Receive | Loaded all Tier 1a skills; read issue gh #7; read gamma-scaffold.md, PROJECT.md, STACK.md | dispatch prompt, skill files |
| 2. Rebase | `git fetch origin && git switch cycle/17 && git rebase origin/main` — brought gamma-scaffold into working tree | `cycle/17` branch at `7ee531c` |
| 3. Read context | Read gh #7 (full), gamma-scaffold.md, issue.entity.ts, project-issues.component.ts, issue-detail.component.ts, both spec files | all listed files |
| 4. Gap confirmed | Gap: divergent label maps (`resolved` bug), no chip component, no shared constants | gh #7 §Problem |
| 5. Design decision | Single `<app-chip [kind] [value]>` component chosen over two separate components | self-coherence §Component design decision |
| 6. Implement (in artifact order) | Created issue-labels.ts (AC2), chip.component.ts (AC1), chip.component.spec.ts, updated project-issues (AC3), issue-detail (AC4), updated specs | `7ee531c` — 7 files, 123+35 |
| 7. Pre-review gate | All 14 gate rows checked (see §Review-readiness) | self-coherence §Review-readiness |

## Self-check

- Every AC maps to concrete diff evidence — ✓
- No ambiguity pushed onto β — design decision (one vs two components) is documented and implemented; β can verify against the stated rationale
- Tests prove the actual claims: chip labels, colorVar computation, unknown fallback — not just happy paths
- Peer enumeration: all consumers of the new chip are enumerated (project-issues, issue-detail); no other components in `apps/web/src/` reference `statusLabels` or `priorityLabels` (grep-verified pre-implementation via gamma-scaffold)
- The `resolved` bug fix is structural (deleting the broken map, replacing with shared correct map) — not patch-over

## Review-readiness

**Round:** 1  
**Implementation SHA:** `7ee531c`  
**Base SHA (origin/main at rebase):** `f44a349`

| Row | Check | Result |
|-----|-------|--------|
| 1 | `origin/cycle/17` rebased onto current `origin/main` | `git fetch origin && git rebase origin/main` completed at session start; `origin/main` HEAD = `f44a349`; no drift during α work (no concurrent pushes to main) |
| 2 | `self-coherence.md` carries CDD Trace through step 7 | ✓ — §CDD Trace above covers steps 1–7 |
| 3 | Tests present and passing | `Tests: 47 passed, 47 total` (last line of `npm run test:web` output above) |
| 4 | Every AC has evidence | ✓ — AC1–AC4 each with file evidence in §AC outcomes |
| 5 | Known debt explicit | ✓ — §Known Gaps: WCAG, gamma-scaffold path note |
| 6 | Schema/shape audit | N/A — no backend contract changes; API types unchanged; `type Issue` in api.service.ts not modified |
| 7 | Peer enumeration | ✓ — chip consumers enumerated (project-issues, issue-detail); grep confirmed no other consumers before implementation |
| 8 | Harness audit | N/A — no schema-bearing contract changed |
| 9 | Post-patch re-audit | N/A — single round, no mid-review patches |
| 10 | Branch CI green | Local: `npm run test:web` → 47 pass; API service tests: 35 pass; CI on push pending (no local CI runner) |
| 11 | Artifact enumeration matches diff | ✓ — all 7 files in `git show 7ee531c --numstat` mentioned in §Diff scope and §AC outcomes |
| 12 | Caller-path trace for new modules | `ChipComponent` — callers: `project-issues.component.ts` (template `<app-chip>`); `issue-detail.component.ts` (template `<app-chip>`). `STATUS_LABELS` / `PRIORITY_LABELS` — callers: `chip.component.ts` (import); `issue-detail.component.ts` (`getStatusLabel` method) |
| 13 | Test assertion count from runner output | Pasted above: `Tests: 47 passed, 47 total` |
| 14 | Commit author email | `git log -1 --format='%ae' HEAD` = `alpha@issue-tracker.cdd.cnos` ✓ |
| 15 | γ-artifact presence | `gamma-scaffold.md` present at `f44a349` on `origin/main` (committed by γ in cycle/17 scaffold step). Path: `.cdd/unreleased/17/gamma-scaffold.md`. Rebase brought it into working tree. Configuration: §5.1 canonical dispatch — file present at canonical path. |
