# α Dispatch Prompt — Cycle 18

You are α (implementer) for issue-tracker cycle 18.

## Issue

gh issue view 9

(Full contract — gap, ACs, non-goals — is in the issue body.)

## Branch

`cycle/18` — already exists on origin. Start with:

```bash
git fetch origin
git rebase origin/main   # pick up any commits since branch creation
git switch cycle/18
```

## Cycle artifacts directory

`.cdd/unreleased/18/` — commit `self-coherence.md` here on `cycle/18`.
Commit section-by-section per `alpha/SKILL.md §2.5` (even for short documents).

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (strict) |
| CLI integration target | N/A |
| Package scoping | `apps/api/` only |
| Existing-binary disposition | N/A |
| Runtime dependencies | NestJS 10, TypeORM, PostgreSQL 16 |
| JSON/wire contract preservation | `/api/v1` prefix; error shape unchanged; UUID string IDs |
| Backward-compat invariant | Additive-only on projects; status endpoint relaxed (new 200 cases that were 400) |

## Skills to load (Tier 3, per issue §Skills)

None designated beyond Tier 1/2. The issue is backend-only with established NestJS + TypeORM + Jest patterns.

## What to implement

Per gh #9 scope (do not deviate):

### 1. `apps/api/src/issues/issues.service.ts`

- Remove the `TRANSITIONS` constant (lines 15–18)
- Remove `BadRequestException` from the import at the top (no longer needed after guard removal)
- In `updateStatus`: delete `const allowed = TRANSITIONS[issue.status]` and the `if (allowed === null || dto.status !== allowed)` throw block
- Keep: 404 for missing issue; `issue.status = dto.status`; save and return

### 2. `apps/api/src/issues/issues.controller.ts`

- Update `@ApiResponse({ status: 400, description: 'Invalid transition' })` on the status endpoint to `@ApiResponse({ status: 400, description: 'Invalid status value' })`

### 3. `apps/api/src/projects/projects.service.ts`

- Add `async findOne(id: string): Promise<Project>` — uses `this.projectRepository.findOneBy({ id })`; throws `NotFoundException(\`Project \${id} not found\`)` if null; returns the project

### 4. `apps/api/src/projects/projects.controller.ts`

- Add `@Get(':id')` route before the existing `@Patch(':id')` route
- Decorate with `@ApiResponse({ status: 200, description: 'Project found' })` and `@ApiResponse({ status: 404, description: 'Project not found' })`
- Method: `async findOne(@Param('id') id: string): Promise<unknown> { return this.projectsService.findOne(id); }`

### 5. `apps/api/src/issues/issues.service.spec.ts`

- Remove the 4 tests that assert `BadRequestException`:
  - `'rejects skip open → done with BadRequestException'`
  - `'rejects revert in_progress → open with BadRequestException'`
  - `'rejects same-status transition with BadRequestException'`
  - `'rejects any transition from closed (terminal) with BadRequestException'`
- Remove `BadRequestException` from the import at the top (no longer referenced)
- Add 2 new tests inside the `describe('updateStatus')` block:
  - `'allows skip: open → done'` — mock `findOneBy` returns issue with status OPEN; mock `save` returns issue with status DONE; call `service.updateStatus('i1', { status: IssueStatus.DONE })`; expect result.status to be `IssueStatus.DONE`
  - `'allows backward: done → in_progress'` — mock `findOneBy` returns issue with status DONE; mock `save` returns issue with status IN_PROGRESS; call `service.updateStatus('i1', { status: IssueStatus.IN_PROGRESS })`; expect result.status to be `IssueStatus.IN_PROGRESS`

### 6. `apps/api/src/issues/issues.e2e.spec.ts`

- Remove the 4 "400" tests that assert forward-only transition rejection:
  - `'400 — skip: open → done'`
  - `'400 — revert: advance to in_progress then try to revert to open'`
  - `'400 — same-status transition'`
  - `'400 — transition from closed (terminal)'`
- Add 2 new tests:
  - `'200 — skip: open → done'` — create issue (status open), POST status `done` → expect 200; body.status === 'done'
  - `'200 — backward: done → in_progress'` — create issue, advance open→in_progress→done (200 each), then POST status `in_progress` → expect 200; body.status === 'in_progress'
- Keep existing `'400 — invalid status value'` and `'404 — unknown issue id'` tests unchanged

### 7. `apps/api/src/projects/projects.service.spec.ts`

- Add `describe('findOne')` block with:
  - `'returns project when found'` — mock `findOneBy` returns a project; expect result to equal the project
  - `'throws NotFoundException when not found'` — mock `findOneBy` returns null; expect `service.findOne('missing')` to reject with `NotFoundException`

### 8. `apps/api/src/projects/projects.e2e.spec.ts`

- Add `describe('GET /api/v1/projects/:id')` block (after the existing GET / describe, before PATCH /:id):
  - `'200 — returns a single project'` — create project; GET `/api/v1/projects/${created.body.id}` → expect 200; body.id equals created.body.id; body.name is present
  - `'404 — unknown id'` — GET `/api/v1/projects/00000000-0000-0000-0000-000000000000` → expect 404

### 9. `.cdd/SCOPE.md`

- In §"In scope", update `Status workflow: open → in_progress → done → closed (forward-only; see constraints)` to `Status workflow: open | in_progress | done | closed (free transitions between any valid status)`
- In §"Active design constraints", replace the `Status transitions: forward-only along open → in_progress → done → closed. Skipping steps and reverting to a previous status are rejected with 400.` constraint with: `Status transitions: any transition between valid IssueStatus values is accepted. Invalid status values are rejected with 400 by DTO validation.`

## Self-coherence

Write `self-coherence.md` in `.cdd/unreleased/18/` on `cycle/18`. Commit section-by-section.

## Signal review-readiness

When all ACs are implemented and `npm test -w apps/api` passes:
- Ensure `self-coherence.md` is committed on `cycle/18`
- Push `cycle/18` to origin
- Signal review-readiness by committing a line to `.cdd/unreleased/18/self-coherence.md` §Status: `REVIEW_READY`
