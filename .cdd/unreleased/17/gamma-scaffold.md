---
cycle: 17
issue: "gh #7 — enhancement: shared status/priority chip component + consolidated label maps"
role: γ
artifact: gamma-scaffold
branch: cycle/17
---

# γ Scaffold — Cycle 17

## Selection Rationale

| Candidate | Source | Decisive rule | Dependency | Decision |
|-----------|--------|---------------|------------|----------|
| gh #7 — shared chip + label maps | cycle 16 γ-closeout deferred output ("File gh #7 for R4") | `cnos.cds/skills/cds/CDS.md §"Selection function" → §"Assessment-commitment default"` | R1 tokens shipped cycle 14 ✓ | **Selected** |

Decisive clause: cycle 16 gamma-closeout explicitly committed "File gh #7 for R4: migrate at least one routed view..." as the next-MCA deferred output. That issue was filed and this cycle executes the commitment. No P0 override candidates. No operational-infrastructure override. No MCI freeze (MCI/MCA balance declared healthy at 1.4.0 close).

## Mode

`design-and-build` — no pre-committed design doc or stable plan exists. α determines the component shape (one combined chip component with `kind: 'status' | 'priority'` input vs two separate chip components), implements, and ships in this cycle. Both ACs and non-goals are fully bounded; design discovery is limited to internal component structure.

## Dispatch Config

`§5.2` — δ=γ, single-session Claude Code.

- ACs: 4 (< §5.3 escalation threshold ≥7)
- New contract surface: none (internal Angular standalone component; no API changes)
- Cross-repo deliverables: none
- β rounds expected: ≤2

§5.2 configuration-floor applies to γ-axis grade.

## Peer Enumeration

### 1. Directories in the impact graph

```
apps/web/src/app/shared/          — does NOT exist
                                    confirmed: ls apps/web/src/app/shared/ → error (no such file)
apps/web/src/app/projects/        — contains project-issues.component.ts
apps/web/src/app/issues/          — contains issue-detail.component.ts
apps/web/src/styles.scss          — R1 token definitions (--it-status-*, --it-priority-*)
apps/api/src/entities/issue.entity.ts — canonical enum source (IssueStatus, IssuePriority)
```

### 2. Grep evidence for proposed surfaces

**Chip component — does not exist:**

```
$ grep -rn "chip\|StatusChip\|PriorityChip\|app-status-chip\|app-priority-chip\|ChipComponent" apps/web/src/
apps/web/src/app/projects/project-issues.component.ts:46:  {{ statusLabels[issue.status] }}
apps/web/src/app/projects/project-issues.component.ts:51:  {{ priorityLabels[issue.priority] }}
apps/web/src/app/issues/issue-detail.component.ts:50-51:  {{ statusLabels[...] }}  {{ priorityLabels[...] }}
```

No `ChipComponent`, `StatusChipComponent`, `PriorityChipComponent`, or `<app-*-chip>` selector
found anywhere. The grep hits are label-map usages only — the chip primitive is absent.

**statusLabels / priorityLabels / STATUS_LABELS / PRIORITY_LABELS:**

```
$ grep -rn "statusLabels\|priorityLabels\|STATUS_LABELS\|PRIORITY_LABELS" apps/web/src/
project-issues.component.ts:167  readonly statusLabels = { open:'Open', in_progress:'In Progress',
                                   resolved:'Resolved', closed:'Closed' }      ← broken: `resolved` not in enum; `done` missing
project-issues.component.ts:174  readonly priorityLabels = { low:'Low', medium:'Medium',
                                   high:'High', critical:'Critical' }           ← correct
issue-detail.component.ts:149    readonly statusLabels = { open:'Open', in_progress:'In Progress',
                                   done:'Done', closed:'Closed' }               ← correct
issue-detail.component.ts:156    readonly priorityLabels = { low:'Low', medium:'Medium',
                                   high:'High', critical:'Critical' }           ← correct
```

Two divergent inline maps confirmed. `project-issues` has `resolved` (not in `IssueStatus` enum)
and is missing `done` (causing `done` issues to fall back to raw key `"done"` in the table).
`issue-detail` is enum-aligned. No shared constants file exists anywhere.

**R1 semantic tokens — exist:**

```
$ grep -n "it-status\|it-priority" apps/web/src/styles.scss
L71  --it-status-open:        #1565c0
L72  --it-status-in-progress: #e65100
L73  --it-status-done:        #2e7d32
L74  --it-status-closed:      #616161
L77  --it-priority-low:       #43a047
L78  --it-priority-medium:    #fb8c00
L79  --it-priority-high:      #e53935
L80  --it-priority-critical:  #b71c1c
```

Eight tokens (4 status + 4 priority) covering all enum values exactly. Available for chip styling.

**IssueStatus / IssuePriority enums:**

```
apps/api/src/entities/issue.entity.ts:
  enum IssueStatus  { OPEN='open', IN_PROGRESS='in_progress', DONE='done', CLOSED='closed' }
  enum IssuePriority{ LOW='low', MEDIUM='medium', HIGH='high', CRITICAL='critical' }
```

Canonical enum values: status = `open/in_progress/done/closed`; priority = `low/medium/high/critical`.
Gap framing: `shared/` chip + constants do not exist (new territory). `statusLabels`/`priorityLabels`
partially closed (issue-detail correct; project-issues broken). This cycle creates the shared primitive
and consolidates to a single source.

## AC Oracle Table

| AC | Oracle | Positive | Negative | Surface |
|----|--------|----------|----------|---------|
| AC1 — chip renders colored labels | Render chip with `status='in_progress'`; inspect component CSS binding | Chip label "In Progress" rendered; background bound to `var(--it-status-in-progress)` (#e65100); same pattern for `priority='critical'` → `var(--it-priority-critical)` (#b71c1c) | Raw key `in_progress` as displayed text; chip has no color treatment (plain unstyled text) | `apps/web/src/app/shared/` chip component |
| AC2 — canonical label maps match entity enum | Cross-check shared constants file vs `issue.entity.ts` enum string values | `done` present; every value in `open/in_progress/done/closed` and `low/medium/high/critical` has a label entry | `resolved` key present; any IssueStatus/IssuePriority enum value missing from the shared map | shared constants file (`issue-labels.ts` or equivalent) |
| AC3 — project-issues consumes chip; local maps deleted | `grep -n "statusLabels\|priorityLabels" apps/web/src/app/projects/project-issues.component.ts`; open view with a `done` issue | Grep returns no local map definition; status cell shows colored "Done" chip | Old local `statusLabels`/`priorityLabels` still defined in component; raw string `"done"` renders |  `apps/web/src/app/projects/project-issues.component.ts` |
| AC4 — issue-detail consumes chip; local maps deleted | `grep -n "statusLabels\|priorityLabels" apps/web/src/app/issues/issue-detail.component.ts`; open issue with `status='in_progress'`, `priority='critical'` in view mode | Grep returns no local map definition; amber "In Progress" chip + red "Critical" chip in view mode | Plain-text status/priority; old local maps still defined | `apps/web/src/app/issues/issue-detail.component.ts` view-mode branch |

## Expected Diff Scope

| File | Change | Est. Δ lines |
|------|--------|-------------|
| `apps/web/src/app/shared/chip.component.ts` (or `status-chip/priority-chip`) | New — standalone chip component; `@Input() kind`, `@Input() value`; CSS var binding | +60–80 |
| `apps/web/src/app/shared/issue-labels.ts` | New — `STATUS_LABELS`, `PRIORITY_LABELS` constants; enum-aligned | +20–25 |
| `apps/web/src/app/shared/chip.component.spec.ts` | New — chip unit tests (≥3: label render, color token, unknown-value fallback) | +35–50 |
| `apps/web/src/app/projects/project-issues.component.ts` | Modified — import chip; remove local maps; update template bindings | −15, +8 |
| `apps/web/src/app/projects/project-issues.component.spec.ts` | Modified — update TestBed, adjust assertions for chip | −5, +8 |
| `apps/web/src/app/issues/issue-detail.component.ts` | Modified — import chip; remove local maps; update template | −15, +8 |
| `apps/web/src/app/issues/issue-detail.component.spec.ts` | Modified — update TestBed, adjust assertions | −5, +8 |

**Estimated total:** ~180–200 lines added, ~40 deleted.
**Test count at signal:** ≥47 web (baseline 44 + ≥3 chip component tests).
**API tests:** unchanged (76).
