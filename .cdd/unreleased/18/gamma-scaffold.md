---
cycle: 18
issue: "gh #9 — relax issue status transitions; add GET /projects/:id"
role: γ
artifact: gamma-scaffold
dispatch-config: §5.2 (δ=γ, single-session Claude Code)
---

# γ Scaffold — Cycle 18

## Issue

gh #9 — enhancement: relax issue status transitions to allow any move; add GET /projects/:id

Mode: design-and-build (4 ACs)
Priority: P1 — unblocks Kanban board (gh #10)

## Surfaces γ expects α to touch

| Surface | Change |
|---------|--------|
| `apps/api/src/issues/issues.service.ts` | Remove `TRANSITIONS` constant and the forward-only guard in `updateStatus`; remove `BadRequestException` import (no longer used) |
| `apps/api/src/issues/issues.controller.ts` | Update `@ApiResponse({ status: 400 })` on status endpoint — description from "Invalid transition" to "Invalid status value" |
| `apps/api/src/projects/projects.service.ts` | Add `async findOne(id: string): Promise<Project>` (uses `findOneBy`; throws `NotFoundException` if null) |
| `apps/api/src/projects/projects.controller.ts` | Add `@Get(':id')` route calling `projectsService.findOne(id)`; add `@ApiResponse` 200/404 |
| `apps/api/src/issues/issues.service.spec.ts` | Remove 4 "rejects" tests (skip/revert/same-status/closed-terminal); add 2 new tests (skip open→done → resolves; backward done→in_progress → resolves); remove `BadRequestException` import if no longer used |
| `apps/api/src/issues/issues.e2e.spec.ts` | Remove 4 "400" tests (skip, revert, same-status, closed-terminal); add 2 new "200" tests (skip open→done; backward done→in_progress) |
| `apps/api/src/projects/projects.service.spec.ts` | Add unit tests for `findOne`: 200 (returns project), 404 (throws NotFoundException) |
| `apps/api/src/projects/projects.e2e.spec.ts` | Add e2e tests for `GET /api/v1/projects/:id`: 200 (returns project), 404 (unknown id) |
| `.cdd/SCOPE.md` | Update §"Status workflow" and §"Active design constraints" to reflect free transitions |

## Peer enumeration (γ §2.2a — pre-dispatch)

Confirmed before dispatch (no grep evidence == issue claims false):

| Claim | Command | Result |
|-------|---------|--------|
| `TRANSITIONS` constant exists at `issues.service.ts:15` | read file | ✅ confirmed at L15–18 |
| `updateStatus` guard at L74 | read file | ✅ confirmed at L78–82 |
| No `GET /projects/:id` in `projects.controller.ts` | read file | ✅ confirmed — only GET / (list) |
| No `findOne(id)` in `ProjectsService` | read file | ✅ confirmed — no such method |
| "Cannot transition" string in source only, NOT in spec assertions | `rg 'Cannot transition'` | ✅ only in service source |
| Invalid-transition "400" tests exist in specs | read spec files | ✅ confirmed — 4 tests each in unit + e2e |

## AC oracle approach

- AC1 (free transitions): unit test `updateStatus` with skip (`open→done`) and backward (`done→in_progress`) → resolves to Issue; e2e: same scenarios → 200 + persisted status
- AC2 (invalid value rejected): existing e2e test `400 — invalid status value` kept unchanged; DTO `@IsEnum` unchanged
- AC3 (GET /projects/:id): e2e `GET /projects/:knownId` → 200 with project fields; `GET /projects/:randomUuid` → 404
- AC4 (suite green): `npm test -w apps/api` passes; no "Cannot transition" assertion survives in any spec

## Expected diff scope

~8 files, ~60 line net delta (removals of ~30 forward-only lines + additions of ~30 new test/route lines).

No migration needed. No DTO changes. No frontend changes.

## Protocol exemption

None. `gamma-scaffold.md` is the canonical γ artifact for cycle 18. No wave manifest applies.
