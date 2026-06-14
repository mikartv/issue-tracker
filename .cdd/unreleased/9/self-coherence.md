## §Skills

**Tier 1:**
- `CDD.md` — canonical lifecycle and role contract
- `alpha/SKILL.md` — α role surface (this file)

**Tier 2:**
- `eng/typescript` — TypeScript authoring constraints (strict mode, type safety)
- `eng/angular` — Angular 17 standalone components, OnPush CD, template syntax

**Tier 3 (issue-specific):**
- None declared in issue; implementation contract fully specifies technology (Angular 17 + Angular Material, TypeScript strict)

---

## §Gap

**Issue:** #9 — Create/edit issue flows  
**Mode:** design-and-build  

The gap was the absence of any UI form flows for creating or editing issues. Before this cycle, issues could only be created via direct API calls, and the issue detail page was read-only. This cycle closes that gap by adding a create-issue form on the project-issues page and an inline edit mode on the issue-detail page, both wired to existing API endpoints (`POST /api/v1/projects/:projectId/issues` and `PATCH /api/v1/issues/:id`).
