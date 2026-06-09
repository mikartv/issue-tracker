# Issue 5 — Comments API

**Mode:** design-and-build  
**Status:** open  
**Branch:** cycle/5

## Problem

**What exists:** Issues API without comments (cycle 4).  
**What is expected:** Add/list comments on issues with author from `X-User-Email`.  
**Where they diverge:** No discussion thread on issues.

## Source of truth

- `.cdd/SCOPE.md` — author stub, no edit/delete
- `.cdd/STACK.md` — `UserEmailMiddleware` / `req.userEmail`

## Acceptance Criteria

- [ ] AC1: `POST /api/v1/issues/:issueId/comments` — body `{ body }`; author = `req.userEmail`
- [ ] AC2: `GET /api/v1/issues/:issueId/comments` — ordered by `created_at` asc
- [ ] AC3: 404 if issue missing; empty array if no comments
- [ ] AC4: Missing `X-User-Email` → author `"anonymous"`
- [ ] AC5: Swagger documents comment routes
- [ ] AC6: Unit + e2e tests including anonymous and custom email header

## Non-goals

- Edit/delete comment
- Markdown rendering
- @mentions

## Closure

All AC met; tests green on `cycle/5`.
