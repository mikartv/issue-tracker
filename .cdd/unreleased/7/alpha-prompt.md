# α Dispatch Prompt — Cycle 7

Activate as cn-sigma. Role: α ONLY.  
Hub (skill source): ../cn-sigma  
Working directory: /home/mihail/Projects/usurobor/issue-tracker  
Branch: cycle/7 (already checked out)

Issue: Read `.cdd/issues/7/ISSUE.md` from repo root (full contract: gap, ACs, non-goals).  
Scaffold: Read `.cdd/unreleased/7/gamma-scaffold.md` — surfaces, oracle approach, expected diff scope.  
Project map: Read `.cdd/PROJECT.md` — verified repo map, build/test commands, conventions.  
Stack: Read `.cdd/STACK.md` — pinned versions, layout, Material introduction rule.

---

## Implementation contract (pinned by γ; α MUST NOT improvise)

| Axis | Pinned value |
|------|--------------|
| Language | TypeScript strict (`strict: true` in `apps/web/tsconfig.json`) |
| CLI integration target | N/A |
| Package scoping | `apps/web/` only; no changes to `apps/api/` |
| Existing-binary disposition | Extend cycle-6 Angular shell; replace placeholder components; additive only |
| Runtime dependencies | Angular 17, `@angular/material ~17.x`, `@angular/cdk ~17.x` (first Material cycle) |
| JSON/wire contract preservation | API consumer only; existing `ApiService` interfaces (`Project`, `Issue`) preserved as-is |
| Backward-compat invariant | Additive UI; existing routes in `app.routes.ts` unchanged |

---

## Instructions

1. Load α/SKILL.md from the hub before acting.
2. Read the issue, scaffold, PROJECT.md, and STACK.md as listed above.
3. Implement all 6 ACs. Do not implement non-goals (issue detail page, create-issue form, dark theme).
4. Angular Material is not yet installed — add `@angular/material` and `@angular/cdk` (~17.x) to `apps/web/package.json` and wire a pre-built theme. Run `npm install` from repo root after.
5. `ApiService` (`apps/web/src/app/api/api.service.ts`) needs `createProject(name: string)` and `archiveProject(id: string)` — add them; preserve existing methods and interfaces.
6. Replace both placeholder components with working Material implementations. Components are standalone; use `imports: [...]` per Angular 17 standalone pattern.
7. Write component tests (`*.spec.ts`) using TestBed and `HttpClientTestingModule`. Verify with `npm run test:web` before signaling review-readiness.
8. Archive action: POST `/projects/:id/archive`; on 409 response show an inline error — do not navigate away.
9. Archived projects must be visually distinct (e.g. greyed text, badge, strikethrough) — pick one consistent treatment.
10. Loading and error states required on both list components (AC4).
11. Produce `.cdd/unreleased/7/self-coherence.md` before signaling review-readiness. Map every AC to file+line evidence.
12. `npm run test:all` must pass (api tests unaffected by this cycle's changes; confirm they still pass).
