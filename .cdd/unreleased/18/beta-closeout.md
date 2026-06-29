---
cycle: 18
issue: "gh #9 — relax issue status transitions; add GET /projects/:id"
role: β
artifact: beta-closeout
merge-sha: ad44c4c5551f2d629a79266ff091b5a980ef9863
---

# β Closeout — Cycle 18

## Merge SHA

`ad44c4c5551f2d629a79266ff091b5a980ef9863`

Merged `cycle/18` into `main` with `--no-ff` on 2026-06-29.

## Mechanical Gate

- **Git identity:** All implementation commits on `cycle/18` are authored by `alpha@issue-tracker.cdd.cnos`. PASS.
- **CI:** This project's `.github/workflows/ci.yml` triggers on push/PR to `main` only — no CI runs on `cycle/*` branches is expected and correct. CI will run on the merge commit pushed to `main`.
- **Scaffold present:** `.cdd/unreleased/18/gamma-scaffold.md` confirmed present on `origin/cycle/18`. PASS.

## AC Verdicts

### AC1 — Any valid status transition is accepted: PASS

Evidence:
- `issues.service.ts`: `TRANSITIONS` constant removed; forward-only guard (`if (allowed === null || dto.status !== allowed)`) removed; `updateStatus` persists any `IssueStatus` target.
- `BadRequestException` removed from import in service.
- Unit spec (`issues.service.spec.ts`): 4 `rejects.toThrow(BadRequestException)` tests replaced with 2 new tests — `'allows skip: open → done'` and `'allows backward: done → in_progress'` — both resolve successfully.
- E2e spec (`issues.e2e.spec.ts`): 4 "400" forward-only tests replaced with `'200 — skip: open → done'` and `'200 — backward: done → in_progress'` tests; both assert 200 and correct persisted status.

### AC2 — Invalid status value still rejected: PASS

Evidence:
- `update-issue-status.dto.ts` unchanged — `@IsEnum(IssueStatus)` still present.
- E2e `'400 — invalid status value'` test retained and passes.
- `@ApiResponse({ status: 400, description: 'Invalid status value' })` on status endpoint in `issues.controller.ts` (description updated from "Invalid transition").

### AC3 — GET /projects/:id returns one project: PASS

Evidence:
- `projects.service.ts`: `async findOne(id: string): Promise<Project>` added; uses `findOneBy({ id })`; throws `NotFoundException` if null.
- `projects.controller.ts`: `@Get(':id')` route added before `@Patch(':id')`; `@ApiResponse` 200 and 404 present; calls `projectsService.findOne(id)`.
- Unit spec (`projects.service.spec.ts`): `describe('findOne')` block with `'returns the project when found'` and `'throws NotFoundException when project does not exist'` — both pass.
- E2e spec (`projects.e2e.spec.ts`): `describe('GET /api/v1/projects/:id')` block with `'200 — returns a single project'` (creates project, GETs by id, verifies id and name) and `'404 — unknown id'` (UUID zero → 404) — both pass.

### AC4 — Suite green: PASS

Oracle: `DATABASE_URL=postgresql://issue_tracker:issue_tracker@localhost:5432/issue_tracker npm test -w apps/api`

Result: **9 suites, 76 tests — all pass.** No surviving assertion that 400 is returned for a transition between valid statuses.

## Non-goals confirmed

- No `apps/web/` modifications in diff. PASS.
- No new migration file. PASS.
- No transition audit trail. PASS.

## SCOPE.md

- §"In scope" status workflow updated from `open → in_progress → done → closed (forward-only)` to free-transitions description. PASS.
- §"Active design constraints" status transitions constraint updated to reflect any valid transition accepted. PASS.

## Review rounds

1

## Notable observations

- Alpha's implementation is minimal and correct: 14 lines removed from `issues.service.ts` (TRANSITIONS constant + guard), 8 lines added to `projects.service.ts`, 7 lines added to `projects.controller.ts`. Net delta well within gamma's estimated ~60 lines.
- The `'200 — backward: done → in_progress'` e2e test correctly advances open→done first, then transitions backward — providing genuine regression coverage.
- The `findOne` route is correctly placed before `@Patch(':id')` in the controller, avoiding NestJS route ambiguity.

## CI

CI will run on merge SHA `ad44c4c5551f2d629a79266ff091b5a980ef9863` via the `push` to `main` trigger. Local run confirmed green (76/76).
