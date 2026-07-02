# α Dispatch Prompt — Cycle 23

You are α (implementer) for the issue-tracker project. Implement the work described in gh #13 on branch `cycle/23`.

## Skills (Tier 1a — load before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/alpha/SKILL.md`

## Read before implementing

```
gh issue view 13          # full contract: gap, ACs, non-goals
.cdd/PROJECT.md           # verified repo map + test baseline
.cdd/STACK.md             # pinned conventions
.cdd/unreleased/23/gamma-scaffold.md   # γ scaffold: surfaces, oracle, empirical anchors
```

## Branch

`cycle/23` (already exists on origin; `git switch cycle/23`)

## Issue

gh #13 — enhancement: global feedback — MatSnackBar toasts and consistent empty/error states

Mode: design-and-build | Priority: P2 | ACs: 3

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript strict |
| CLI integration target | N/A |
| Package scoping | `apps/web/` only |
| Existing-binary disposition | N/A |
| Runtime dependencies | Angular 17, Angular Material 17 (`MatSnackBar` already available via `provideAnimations()` in app.config.ts) |
| JSON/wire contract preservation | No API changes; UI-only cycle |
| Backward-compat invariant | N/A |

## Constraints

1. **`NotificationService` location:** `apps/web/src/app/shared/notification.service.ts` — injectable `providedIn: 'root'`, wraps `MatSnackBar`. Methods: `success(message: string, duration?: number)`, `error(message: string, duration?: number)`, `info(message: string, duration?: number)`. Use `panelClass: ['snack-success']` / `['snack-error']` for token-styled toasts.

2. **Panel class CSS:** Add `.snack-success` and `.snack-error` panel-class overrides in `apps/web/src/styles.scss` using AM17 MDC selectors (`.snack-success .mdc-snackbar__surface` or equivalent) with `var(--it-status-done)` / `var(--it-priority-critical)` backgrounds. Confirm the selector works with `ng build`; adjust if NG8XXX or visual inspection requires.

3. **`issue-detail` page-replacing error fix:** Rename the `error` property to `loadError` for initial load failures. Update the template `@else if (error)` → `@else if (loadError)` and wrap the error message inside a minimal layout container (e.g., a `<div class="error-container">` with a back-navigation link) so the page is not a bare `<p>` in the viewport. Action errors (save, status move, comment) go through `NotificationService.error()` — do NOT assign them to `loadError`.

4. **`editSuccessMessage` removal:** Remove the `editSuccessMessage` prop and the `<p class="success">{{ editSuccessMessage }}</p>` template node from `issue-detail`. Replace save success with `notification.success('Issue saved')`.

5. **Hardcoded `#c00` removal:** In `project-issues.component.ts`, replace `.error { color: #c00; }` and `.drop-error { color: #c00; }` with `var(--it-priority-critical)`. After fix, `rg '#c00|#0a0' apps/web/src/` must return 0 matches in feedback styles.

6. **Action routing:** Follow the γ scaffold action routing table. Key points:
   - `projects-list`: remove `createError` prop + template; remove `archiveErrors` prop + template spans; add toast calls in subscribe handlers.
   - `project-issues`: remove `dropError` prop + template node; add `notification.error(...)` in drop handler.
   - `create-issue-dialog`: remove `submitError` prop + template; keep `archivedError` inline (409 blocking state); add `notification.error(...)` for non-409 errors.
   - `issue-detail`: add error handlers to `moveToNextStatus()` and `submitComment()`; route all to `notification.error(...)`.

7. **Empty/loading pattern (AC3):** Add `.app-empty` to `styles.scss` with token-consistent styling (e.g., `color: rgba(0,0,0,0.5); font-style: italic; text-align: center; padding: var(--it-space-2) 0`). Apply `.app-empty` class to: the `<p class="empty-col">No issues</p>` nodes in `project-issues` board columns, and `<p class="comment-empty">No comments yet.</p>` in `issue-detail`. These two use per-component classes already; add `.app-empty` as an additional class or replace the per-component class.

8. **Tests:** In each modified spec, provide a `NotificationService` spy:
   ```typescript
   const notificationSpy = { success: jest.fn(), error: jest.fn(), info: jest.fn() };
   // in TestBed: providers: [{ provide: NotificationService, useValue: notificationSpy }]
   ```
   Write tests asserting:
   - `notificationSpy.success` called with expected message after success action
   - `notificationSpy.error` called after error action (no inline error text for routed actions)
   - AC2: `loadError` path in issue-detail keeps back link visible (or layout container)
   
   Remove or update assertions that checked for now-removed inline error/success template nodes.

9. **Self-coherence diff counts:** Per `STACK.md §α-rule: self-coherence diff counts`, derive all line counts from `git diff` at the **final committed state**. Never estimate. Run:
   ```bash
   git diff origin/main -- <file> | grep -c '^+'
   git diff origin/main -- <file> | grep -c '^-'
   ```

10. **`ng build` must exit 0:** Angular template changes are in scope. After implementation, run `cd apps/web && npx ng build --configuration=production`. Fix any NG8XXX errors before signaling review-readiness.

## Exit condition

When all of the following are true, commit `self-coherence.md` to `cycle/23` and signal review-readiness:

- [ ] AC1: `NotificationService` exists; action outcomes (create project, archive project, save issue, move status, add comment, drag-drop move, create issue non-409 error) surface via `notification.success()` / `notification.error()`; no inline `createError`, `archiveErrors`, `dropError`, `editSuccessMessage`, `submitError` props or template nodes remaining for routed outcomes.
- [ ] AC2: `rg '#c00|#0a0' apps/web/src/` returns 0 matches in feedback styles; `issue-detail` load error is in a layout container, not a bare page-replacing `<p>`.
- [ ] AC3: `.app-empty` class applied to board column empty-state and comment empty-state; consistent with token styling.
- [ ] `npm run test:web` passes (all tests green).
- [ ] `cd apps/web && npx ng build --configuration=production` exits 0.
- [ ] `self-coherence.md` committed to `cycle/23` with final diff counts from `git diff origin/main`.

Git identity for α commits: `alpha@issue-tracker.cdd.cnos`
