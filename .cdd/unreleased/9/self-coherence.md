## §Gap

**Issue:** #9 — Create/edit issue flows  
**Mode:** design-and-build  

The gap was the absence of any UI form flows for creating or editing issues. Before this cycle, issues could only be created via direct API calls, and the issue detail page was read-only. This cycle closes that gap by adding a create-issue form on the project-issues page and an inline edit mode on the issue-detail page, both wired to existing API endpoints (`POST /api/v1/projects/:projectId/issues` and `PATCH /api/v1/issues/:id`).
