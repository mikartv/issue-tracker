---
cycle: 23
issue: "gh #13 — enhancement: global feedback — MatSnackBar toasts and consistent empty/error states"
mode: design-and-build
dispatch-config: §5.2 (δ=γ, single-session Claude Code)
---

# γ Scaffold — Cycle 23

## Issue

**gh #13** — enhancement: global feedback — MatSnackBar toasts and consistent empty/error states

- Mode: design-and-build
- ACs: 3 (small band)
- Priority: P2

## Peer enumeration (§2.2a)

Surfaces γ surveyed before scoping:

- `rg 'NotificationService|SnackBar|MatSnackBar' apps/web/src/` → **0 matches** — `NotificationService` does not exist.
- `rg '#c00|#0a0' apps/web/src/app/` → **2 matches only in `project-issues.component.ts`** (lines 103 `.error { color: #c00; }` and 106 `.drop-error { color: #c00; }`). `projects-list` has no hardcoded hex. `issue-detail` replaced them in cycle 22 (`.error { color: var(--it-priority-critical); }`, `.success { color: var(--it-status-done); }`).
- `rg '@else if.*error\|} @else if' apps/web/src/app/issues/issue-detail.component.ts` → line 46: `} @else if (error) {` — this is the page-replacing load-error path.
- `find apps/web/src/app/shared/ -type f` → `chip.component.ts`, `chip.component.spec.ts`, `issue-labels.ts` — no `NotificationService`, no empty-state component.

## Surfaces α is expected to touch

### New
| File | Role |
|------|------|
| `apps/web/src/app/shared/notification.service.ts` | `NotificationService` — thin `MatSnackBar` wrapper; methods: `success(msg, duration?)`, `error(msg, duration?)`, `info(msg, duration?)`. `providedIn: 'root'`. Uses `panelClass: ['snack-success']` / `['snack-error']`. |
| `apps/web/src/app/shared/notification.service.spec.ts` | Unit tests for `NotificationService` (spy on `MatSnackBar.open`; verify panelClass and duration). |

### Modified
| File | Expected change |
|------|----------------|
| `apps/web/src/app/projects/projects-list.component.ts` | Inject `NotificationService`; route `createProject` success → `success('Project created')`, error → `error('Failed to create project')`; `archiveProject` success → `success('Project archived')`, error → `error('Failed to archive project')`; remove `createError` / `archiveErrors` props and template nodes. Keep load `error` inline (not action outcome — load error is not transient). |
| `apps/web/src/app/projects/project-issues.component.ts` | Inject `NotificationService`; route `dropError` → `error('Failed to move issue to …')`; remove `dropError` prop and `<p class="drop-error">` template node; remove hardcoded `#c00` from `.error` and `.drop-error` styles — replace with `var(--it-priority-critical)`. |
| `apps/web/src/app/issues/issue-detail.component.ts` | (a) Rename `error` → `loadError` for initial load failure only; update template `@else if (loadError)` to show error inside a layout-consistent container (not bare full-page replace); (b) Route `saveEdit` success → `success('Issue saved')`, error → `error('Failed to save issue')` — remove `editSuccessMessage` prop and template node, remove `this.error` assignment in save handler; (c) `moveToNextStatus` — add error handler → `error('Failed to update status')`; (d) `submitComment` — add error handler → `error('Failed to add comment')`, optionally add success → `success('Comment added')`. |
| `apps/web/src/app/projects/create-issue-dialog.component.ts` | Inject `NotificationService`; route non-409 `submitError` → `error(err.message ?? 'Failed to create issue')` — remove `submitError` prop and template node. Keep `archivedError` inline (blocking state, not transient). |
| `apps/web/src/styles.scss` | (a) Add panel-class CSS for `MatSnackBar` toasts: `.snack-success` and `.snack-error` using AM17 MDC selectors to apply `var(--it-status-done)` / `var(--it-priority-critical)` backgrounds; (b) Add shared `.app-empty` CSS class for empty-state text (consistent color, font-style). |

### Test files (update)
| File | Expected change |
|------|----------------|
| `apps/web/src/app/projects/projects-list.component.spec.ts` | Provide `NotificationService` spy; update create/archive error tests to assert `notificationSpy.error` called; remove assertions on removed template nodes. |
| `apps/web/src/app/projects/project-issues.component.spec.ts` | Provide `NotificationService` spy; update drop-error test to assert `notificationSpy.error` called; remove `<p class="drop-error">` template assertions. |
| `apps/web/src/app/issues/issue-detail.component.spec.ts` | Provide `NotificationService` spy; update save-success test to assert `notificationSpy.success('Issue saved')`; update save-error test; update load-error test (now uses `loadError`). |
| `apps/web/src/app/projects/create-issue-dialog.component.spec.ts` | Provide `NotificationService` spy; update submit-error test to assert `notificationSpy.error` called; remove assertion on `submitError` template node. |

## Action routing table

| Component | Action | Success | Error |
|-----------|--------|---------|-------|
| projects-list | project create | `success('Project created')` | `error(err.message)` |
| projects-list | project archive | `success('Project archived')` | `error(err.message)` |
| project-issues | drag-drop status move | (no toast needed — board updates visually) | `error('Failed to move issue to …')` |
| create-issue-dialog | issue create | (dialog closes; no toast — visual feedback is the dialog disappearing + list reload) | `error(err.message)` for non-409 |
| issue-detail | save issue | `success('Issue saved')` | `error(err.message)` |
| issue-detail | status move | (no toast — board updates visually in issue-detail too; sidebar chip refreshes) | `error(err.message)` |
| issue-detail | add comment | `success('Comment added')` | `error(err.message)` |

> Note on issue-create success toast: The dialog closes and the list reloads — the visual feedback is already clear. A success toast is optional; the issue scope says "issue create (R6)" appears in the route list. α should add a success toast on dialog close from `ProjectIssuesComponent.afterClosed()` (not inside the dialog itself, since the dialog is already closed by then), OR have the dialog emit a message for the host to toast. The simpler path: skip issue-create success toast (the dialog closing is unambiguous UX); the error toast is mandatory per AC1.

## AC oracle approach

**AC1:** In each spec, provide `{ provide: NotificationService, useValue: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }`. Trigger the action. Assert the spy method was called with the expected message. Verify no surviving `.error` / `.success` inline text for routed action outcomes.

**AC2:** 
- `rg '#c00|#0a0' apps/web/src/` returns 0 matches in feedback styles.
- Load error in `issue-detail` is inside a layout container (has back link or wrapping div), not bare `<p>` at root.
- Simulate `loadError` = 'some error' in spec: the full detail layout is NOT replaced by a bare error string; the error appears inside the page structure.

**AC3:**
- Apply `.app-empty` to the two bare empty strings: `<p class="empty-col">No issues</p>` in board columns and `<p class="comment-empty">No comments yet.</p>` in issue-detail comments.
- Add `.app-empty` CSS rule to `styles.scss` (token-color, font-style).
- Oracle: view each empty location → consistent visual treatment; not bare browser-default text.

## Empirical anchors

- `provideAnimations()` is in `apps/web/src/app/app.config.ts` — `MatSnackBar` is injectable without additional setup.
- AM17 MDC snackbar panel class target: `.<panel-class> .mdc-snackbar__surface` in `styles.scss` (global, not component-scoped). α confirms selector via `ng build` and visual smoke.
- The existing `chip.component.ts` pattern (standalone, `inject()` for deps) is the style model for `NotificationService`.
- Test pattern for `MatSnackBar` in specs: provide a mock `NotificationService` (spy object) rather than the real one, to avoid needing `provideAnimations()` in every test module.

## Expected diff scope

| File | Rough ± lines |
|------|--------------|
| `notification.service.ts` (new) | +~30 |
| `notification.service.spec.ts` (new) | +~35 |
| `projects-list.component.ts` | −~20, +~10 |
| `project-issues.component.ts` | −~20, +~10 |
| `issue-detail.component.ts` | −~15, +~20 |
| `create-issue-dialog.component.ts` | −~10, +~5 |
| `styles.scss` | +~15 |
| 4 spec files (update) | −~15, +~25 |

Estimated: ~+150 added, −~80 removed. Net +~70 lines. Test count: +2–3 new (NotificationService spec), ≤5 removed from component specs, ~5 added — expect 76 → ~79–82 web tests.
