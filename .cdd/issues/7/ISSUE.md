# Issue 7 — Issue list + project views (Material)

**Mode:** design-and-build  
**Status:** open  
**Branch:** cycle/7

## Problem

**What exists:** Routed shell without real data UI (cycle 6).  
**What is expected:** Project list and per-project issue list using Angular Material.  
**Where they diverge:** User cannot browse projects/issues in browser.

## Source of truth

- `.cdd/STACK.md` — Angular Material introduced in this cycle
- API contracts from cycles 3–4

## Implementation contract (pinned by δ; α MUST NOT improvise)

| Axis | Pinned value |
|------|--------------|
| Language | TypeScript strict |
| CLI integration target | N/A |
| Package scoping | `apps/web/` only (no api changes unless CORS/proxy fix required) |
| Existing-binary disposition | extend cycle-6 Angular shell; additive UI |
| Runtime dependencies | Angular 17, **@angular/material**, **@angular/cdk** (first Material cycle) |
| JSON/wire contract preservation | preserve as-is (API consumer only) |
| Backward-compat invariant | additive UI; existing routes unchanged |

## Acceptance Criteria

- [ ] AC1: `/projects` — Material table or list of projects; create project form (name)
- [ ] AC2: `/projects/:projectId/issues` — issue list with status, priority, title columns
- [ ] AC3: Archive action on project (calls API); archived projects visually distinct; handle 409 on archive-again
- [ ] AC4: Loading and error states for failed API calls
- [ ] AC5: Component tests for list components (TestBed + HttpClientTestingModule)
- [ ] AC6: Responsive enough for desktop browser (mobile not required)

## Non-goals

- Issue detail page (cycle 8)
- Create issue form (cycle 9)
- Dark theme

## Closure

Manual browse works against running api; tests green on `cycle/7`.
