---
cycle: 18
issue: "gh #9 — relax issue status transitions; add GET /projects/:id"
role: α
artifact: alpha-closeout
merge-sha: ad44c4c5551f2d629a79266ff091b5a980ef9863
---

# α Closeout — Cycle 18

## §Implementation Summary

### Files changed (9 surfaces)

1. `apps/api/src/issues/issues.service.ts` — removed `TRANSITIONS` constant and the forward-only guard (`if (allowed === null || dto.status !== allowed)` throw block); removed `BadRequestException` from import; `updateStatus` now persists any valid `IssueStatus` target.
2. `apps/api/src/issues/issues.controller.ts` — updated `@ApiResponse({ status: 400 })` description from `'Invalid transition'` to `'Invalid status value'` on the status endpoint.
3. `apps/api/src/projects/projects.service.ts` — added `async findOne(id: string): Promise<Project>` using `findOneBy({ id })`; throws `NotFoundException` if null.
4. `apps/api/src/projects/projects.controller.ts` — added `@Get(':id')` route before `@Patch(':id')`; decorated with `@ApiResponse` 200/404; delegates to `projectsService.findOne(id)`.
5. `apps/api/src/issues/issues.service.spec.ts` — removed 4 `BadRequestException` transition tests; added `'allows skip: open → done'` and `'allows backward: done → in_progress'` unit tests; removed `BadRequestException` from import.
6. `apps/api/src/issues/issues.e2e.spec.ts` — removed 4 "400 — invalid transition" tests; added `'200 — skip: open → done'` and `'200 — backward: done → in_progress'` e2e tests; retained `'400 — invalid status value'` and `'404 — unknown issue id'` unchanged.
7. `apps/api/src/projects/projects.service.spec.ts` — added `describe('findOne')` block with `'returns project when found'` and `'throws NotFoundException when not found'` tests.
8. `apps/api/src/projects/projects.e2e.spec.ts` — added `describe('GET /api/v1/projects/:id')` block with `'200 — returns a single project'` and `'404 — unknown id'` tests.
9. `.cdd/SCOPE.md` — updated §"In scope" status workflow description and §"Active design constraints" status-transitions constraint to reflect free transitions.

### AC satisfaction

- **AC1 (any valid status transition accepted):** `TRANSITIONS` constant and guard removed from `IssuesService.updateStatus`. Skip (open→done) and backward (done→in_progress) transitions now return 200. Confirmed by 2 new unit tests and 2 new e2e tests.
- **AC2 (invalid status value still rejected):** `UpdateIssueStatusDto` with `@IsEnum(IssueStatus)` unchanged. `'400 — invalid status value'` e2e test retained and passes.
- **AC3 (GET /projects/:id returns one project):** `ProjectsService.findOne` added with 404 guard; `GET /projects/:id` route wired in `ProjectsController`. 200/404 e2e coverage confirmed.
- **AC4 (specs updated, suite green):** All prior "Cannot transition" assertions removed. Final suite: **9 suites, 76 tests — all pass** (`npm test -w apps/api` with `DATABASE_URL`).

### Test count

| Point in time | Count |
|---|---|
| Before cycle/18 (pre-implementation) | 74 |
| After cycle/18 | 76 |

Net: +2 (−4 removed `BadRequestException` tests in issues, +2 new free-transition tests in issues, +4 new `findOne` tests in projects).

---

## §Self-assessment

**Quality:** High. The implementation is minimal and correct — 14 lines removed from `issues.service.ts` (guard + constant), ~15 lines added across `projects.service.ts` and `projects.controller.ts`. No regressions; no dead code left. The `@Get(':id')` route is correctly placed before `@Patch(':id')` in the controller to avoid NestJS route ambiguity.

**Known issues:** None. The `'200 — backward: done → in_progress'` e2e test correctly advances open→in_progress→done before reversing, providing genuine regression coverage rather than a toy assertion.

**Shortcuts:** None taken. All 9 surfaces specified in the dispatch were addressed exactly.

**Commit discipline:** `self-coherence.md` was committed section-by-section on `cycle/18` per `alpha/SKILL.md §2.5`:
- `2cafaab` — §Gap
- `5acd8fd` — §Mode
- `1c714f8` — §ACs
- `8b0bb3d` — §Known Gaps
- `5803f6f` — §Status
- `b7fd158` — §Friction Log

Section-by-section protocol was followed throughout.

---

## §Friction Log

- **Database not running:** `docker compose up -d db` was required before e2e tests would pass. This is existing project infrastructure behavior — not introduced by this cycle. The `.github/workflows/ci.yml` sets `DATABASE_URL` via environment; local runs require manual DB start.
- **No implementation friction:** All 9 surfaces matched the dispatch contract exactly. The NestJS/TypeORM/Jest patterns were established and required no discovery work.

**For γ (process improvement):** No process gaps identified for this cycle. The dispatch contract was precise enough that implementation was mechanical. Consider noting in the scaffold template that e2e tests require `docker compose up -d db` as a pre-flight step, since it is easy to forget after a cold start.

---

## §Known Gaps

### Explicit non-goals honored

- **No frontend changes:** `apps/web/` is untouched. The Kanban board UI still renders whatever status it receives; no chip-color or label changes were made (non-goal R5b).
- **No DB migration:** Free transitions require no schema changes. No migration file was created.
- **No transition audit trail:** No history or event log for status changes was added.
- **No auth/permission checks on transitions:** Role-based gating of status changes is out of scope for this cycle.
- **`POST /issues/:id/status` route shape unchanged:** The endpoint contract is additive-only (new 200 cases that were previously 400).

### Gaps discovered (not covered by this cycle)

None identified. The scope was well-bounded and fully covered by the 4 ACs.
