# β — Cycle 4 review

Issue: Read `.cdd/issues/4/ISSUE.md` from repo root  
Branch: `cycle/4`  
Scaffold: `.cdd/unreleased/4/gamma-scaffold.md`  
α artifact: `.cdd/unreleased/4/self-coherence.md`

## Role

You are β. Review α's implementation of Issue #4 — Issues API + status rules — on branch `cycle/4`.

Read before inspecting code. Your verdict governs merge.

## Load order

1. `.cdd/issues/4/ISSUE.md` — AC contract; non-goals
2. `.cdd/unreleased/4/gamma-scaffold.md` — surfaces expected, oracle approach, diff scope
3. `.cdd/unreleased/4/self-coherence.md` — α's coverage claims
4. `git diff main...cycle/4` — actual diff; verify claims against code

## Review checklist

### Protocol

- [ ] R0: `gamma-scaffold.md` exists on `cycle/4` (rule 3.11b; D-severity if missing)
- [ ] R1: `self-coherence.md` exists and has a `## Review-readiness` section

### AC coverage

- [ ] AC1: `POST /api/v1/projects/:projectId/issues` — service creates issue with `status=open`, `priority=medium`; 409 when project `archived=true`; e2e case covers both paths
- [ ] AC2: `GET /api/v1/projects/:projectId/issues` — returns array; e2e case present
- [ ] AC3: `GET /api/v1/issues/:id` — returns single issue including `project_id`; 404 on missing; e2e case present
- [ ] AC4: `PATCH /api/v1/issues/:id` — updates title/description/priority/assignee; `status` field absent from `UpdateIssueDto` (not settable via PATCH); e2e case present
- [ ] AC5: `POST /api/v1/issues/:id/status` — forward transitions return 200; skip (e.g. `open→done`) returns 400; revert (e.g. `in_progress→open`) returns 400; e2e covers all three
- [ ] AC6: Swagger at `/api/docs` includes issue routes (verify `@ApiTags`, `@ApiResponse` decorators on controller)
- [ ] AC7: `npm run test:api` passes; test count in `self-coherence.md` matches grep counts

### Regression

- [ ] Projects API routes and shapes unchanged (`/api/v1/projects/*` — list, create, rename, archive)
- [ ] Existing 25 tests from cycle 3 still pass

### Honest-claim

- [ ] Test counts per file in `self-coherence.md` match `grep -c "it(" <file>` on the branch
- [ ] Route list in `self-coherence.md` matches controller decorators
- [ ] AC evidence references real code locations, not hypothetical ones

### Constraint adherence

- [ ] No new migration created or run (issue table exists from cycle 2)
- [ ] No status field in `UpdateIssueDto`
- [ ] Status transition logic uses an explicit transition map, not numeric enum index comparison
- [ ] Error shape `{ statusCode, message, error }` — no custom envelope

### Non-goal check

- [ ] No comments routes or comment entity usage
- [ ] No search/filter/pagination
- [ ] No Angular changes

## Verdict format

Write `.cdd/unreleased/4/beta-review.md`:

```markdown
# β Review — Cycle 4

## Round N

**Verdict:** APPROVED | REQUEST CHANGES

### Findings

| ID | Severity | Kind | Summary | Evidence | Required action |
|----|----------|------|---------|----------|-----------------|

Severity: RC (request changes required), A (advisory), D (process/protocol)

### Round summary

<2–3 sentences: what was found, what must change before APPROVED>
```

If APPROVED: no findings table required; round summary states which ACs were verified and test count confirmed.
