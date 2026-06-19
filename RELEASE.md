# release 1.1.0 — issue-tracker

## Outcome

Coherence delta: C_Σ A (`α A`, `β A`, `γ A-`) · **Level:** `L5`

Three small-change cycles (11–13) eliminate all four "Known Issues" from v1.0.0: the
Angular SPA is now fully navigable via routerLink, status/priority display as human-readable
labels in every view, and the root URL redirects to `/projects` instead of showing a blank page.

## Why it matters

v1.0.0 shipped a functional but partially unusable SPA — users could not navigate between views
without typing URLs manually, the root URL showed a blank page, and enum values were exposed as
raw strings (`in_progress`, `critical`). All four documented known issues from v1.0.0 are
resolved. The application can now be evaluated end-to-end — open browser, land on projects
list, click through to issues and issue detail — without any URL manipulation.

## Fixed

- **Blank page at `/`** (#3, cycle 13): `{ path: '', redirectTo: 'projects', pathMatch: 'full' }`
  added as first entry in `app.routes.ts`. Navigating to `/` now redirects to `/projects`.
- **Raw enum values in IssueDetail** (#2, cycle 12): `statusLabels` and `priorityLabels` maps
  added to `IssueDetailComponent`; status display, priority display, and "Move to" button label
  are now human-readable.
- **Raw enum values in ProjectIssues** (#1, cycle 11): `statusLabels` and `priorityLabels` maps
  in `ProjectIssuesComponent` replace raw enum strings in the issue list.
- **Full-page hide on create error** (#1, cycle 11): inline `createError` field replaces
  `@else if (error)` — page content no longer hidden on non-409 form submit errors.

## Added

- **routerLink navigation** (#1, cycle 11): project rows in `ProjectsListComponent` navigate to
  `/projects/:id/issues`; issue rows in `ProjectIssuesComponent` navigate to `/issues/:id`.
- **Empty-state text** (#1, cycle 11): "No projects yet." and "No issues yet." messages when
  lists are empty.

## Validation

- 42 web tests (5 suites), 76 API tests — 118 total — CI green on merge SHA for each cycle:
  - Cycle 11: merge `a544fb1` → CI green on `308fd7d`
  - Cycle 12: merge `b26efd1` → CI green on `664b225`
  - Cycle 13: merge `5af970b` → CI green (actions/runs/27825866088)
- Manual smoke: open `/` → redirects to `/projects` → click project row → navigates to
  `/projects/:id/issues` → click issue row → navigates to `/issues/:id` → status and
  priority display human-readable labels.

## Known Issues

- No automated Angular router navigation test (`app.routes.spec.ts`) — AC1 oracle for cycle 13
  is manual smoke only.
- Pre-existing dead code: `resolved` key in `project-issues.component.ts` L171 (no issue has
  `resolved` status; candidate for future cleanup).
- E2E automation remains manual (`docs/SMOKE.md`).
- ORM `@ManyToOne`/`@OneToMany` relations deferred from cycle 2 (D-CY2-4).
