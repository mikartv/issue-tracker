# β Dispatch Prompt — Cycle 18

You are β (reviewer) for issue-tracker cycle 18.

## Issue

gh issue view 9

(Full contract — gap, ACs, non-goals — is in the issue body.)

## Branch

`cycle/18`

## Pre-review mechanical gate (mandatory before any other step)

```bash
git fetch origin
git log cycle/18 --format='%ae %s' | head -20
gh run list --branch cycle/18 --limit 5
```

1. **Git identity check (STACK.md β-rule):** Any implementation (feat/fix) commit authored by a non-α identity is an RC finding, severity D.
2. **CI green gate (STACK.md β-rule):** If the most recent run on `cycle/18` is not `completed / success`, return REQUEST CHANGES (D-severity, `ci-red`). Exception: documentation-only cycle (zero code/test changes) — note explicitly.
3. **Scaffold present (review/SKILL.md §3.11b):** `git ls-tree -r --name-only origin/cycle/18 .cdd/unreleased/18/gamma-scaffold.md` must be non-empty. If absent and no `## Protocol exemption` exists in the issue body, return REQUEST CHANGES (D-severity, `protocol-compliance`).

## What to review

Per gh #9 ACs:

### AC1 — Any valid status transition is accepted

- `issues.service.ts`: `TRANSITIONS` constant removed; `updateStatus` no longer throws for skip/backward/same-status/closed transitions
- `BadRequestException` removed from import in service (no longer used)
- Unit spec: no surviving `rejects.toThrow(BadRequestException)` assertions for transition between valid statuses; new `allows skip` and `allows backward` tests present
- E2e spec: no surviving `400 — skip/revert/same-status/closed` test assertions; new `200 — skip` and `200 — backward` tests present and green

### AC2 — Invalid status value still rejected

- `update-issue-status.dto.ts` unchanged — `@IsEnum(IssueStatus)` remains
- E2e `400 — invalid status value` test still present and green
- `@ApiResponse({ status: 400, description: 'Invalid status value' })` on status endpoint (description updated from "Invalid transition")

### AC3 — GET /projects/:id returns one project

- `projects.service.ts`: `findOne(id)` method added — returns project or throws `NotFoundException`
- `projects.controller.ts`: `@Get(':id')` route added; `@ApiResponse` 200/404 present; method calls `projectsService.findOne(id)`
- Unit spec: `describe('findOne')` block with 200 and 404 cases
- E2e spec: `describe('GET /api/v1/projects/:id')` block with 200 and 404 cases

### AC4 — Suite green, specs updated

- Oracle: `npm test -w apps/api` passes
- No `rejects.toThrow(BadRequestException)` for transition-between-valid-statuses in any spec
- New tests: 2 in unit spec (skip, backward), 2 in e2e spec (skip, backward), 2 in projects unit spec (findOne 200/404), 2 in projects e2e spec (GET :id 200/404)

### Non-goals check

- No frontend changes (verify no `apps/web/` modifications in diff)
- No migration (verify no new migration file)
- No transition audit trail

### SCOPE.md

- §"In scope" status workflow constraint updated
- §"Active design constraints" status transitions constraint updated

## Verdict

If all ACs pass and CI is green: `APPROVE`

If any RC finding: `REQUEST CHANGES` — list findings with severity (RC / D / C / B / A).

On APPROVE: merge `cycle/18` into `main`, write `beta-closeout.md` in `.cdd/unreleased/18/` on `main`.
