# Issue 9 — Create/edit issue flows

**Mode:** design-and-build  
**Status:** closed  
**Branch:** cycle/9

## Problem

**What exists:** View and comment on issues (cycle 8); create only via API.  
**What is expected:** UI to create and edit issue fields from project context.  
**Where they diverge:** No form flows for issue CRUD in web.

## Source of truth

- `.cdd/SCOPE.md` — editable fields vs status (status via dedicated control only)

## Acceptance Criteria

- [ ] AC1: Create issue form on `/projects/:projectId/issues` (title required; description, priority, assignee optional)
- [ ] AC2: Edit title, description, priority, assignee on detail page (PATCH API)
- [ ] AC3: Block create when project archived (show message, no submit)
- [ ] AC4: Client-side validation mirrors API (title non-empty)
- [ ] AC5: Component tests for create/edit forms
- [ ] AC6: Success feedback (snackbar or inline message)

## Non-goals

- Delete issue
- Drag-and-drop priority
- Assignee autocomplete

## Closure

Full create/edit from UI works; tests green on `cycle/9`.
