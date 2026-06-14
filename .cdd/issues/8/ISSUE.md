# Issue 8 — Issue detail + comments UI

**Mode:** design-and-build  
**Status:** closed  
**Branch:** cycle/8

## Problem

**What exists:** List views only (cycle 7).  
**What is expected:** Issue detail with status display, comment thread, add comment.  
**Where they diverge:** Cannot view or comment on a single issue in UI.

## Source of truth

- API contracts from cycles 4–5
- Material patterns from cycle 7

## Acceptance Criteria

- [ ] AC1: `/issues/:issueId` shows title, description, status, priority, assignee, project link
- [ ] AC2: Status change control respects forward-only workflow (disable illegal next states)
- [ ] AC3: Comment list chronological; add comment form posts to API
- [ ] AC4: Sends `X-User-Email` header when set in localStorage or dev input (simple text field ok)
- [ ] AC5: Component tests for detail + comment form
- [ ] AC6: 404-friendly view when issue id invalid

## Non-goals

- Edit issue fields (cycle 9)
- Rich text comments
- Real-time refresh

## Closure

Manual flow: open issue → add comment → change status; tests green on `cycle/8`.
