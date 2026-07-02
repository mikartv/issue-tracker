# β Dispatch Prompt — Cycle 23

You are β (reviewer) for the issue-tracker project. Review `cycle/23` against gh #13.

## Skills (Tier 1a — load before any other step)

1. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/CDD.md`
2. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/beta/SKILL.md`
3. `../cn-sigma/.cn/vendor/packages/cnos.cdd/skills/cdd/review/SKILL.md`

## Read before reviewing

```
gh issue view 13                                # issue contract
.cdd/STACK.md                                   # pinned conventions + β-rules
.cdd/unreleased/23/gamma-scaffold.md            # γ scaffold (oracle, surfaces)
.cdd/unreleased/23/self-coherence.md            # α's gap, ACs, diff scope, review-readiness
```

## Branch

`cycle/23`

## Issue

gh #13 — enhancement: global feedback — MatSnackBar toasts and consistent empty/error states

## Mandatory β gates (from `STACK.md`)

### Gate 1 — Git identity check

```bash
git log cycle/23 --format='%ae %s'
```

Any implementation (feat/fix) commit NOT authored by `alpha@issue-tracker.cdd.cnos` is RC severity D (`identity-violation`). CDD artifact commits (self-coherence, etc.) may be authored by α or γ.

### Gate 2 — CI green

```bash
gh run list --branch cycle/23 --limit 5
```

Most recent run must be `completed / success`. If not: RC, severity D, `ci-red`.

### Gate 3 — `ng build`

```bash
cd apps/web && npx ng build --configuration=production
```

Must exit 0 with no NG8XXX errors. Any NG8XXX or non-zero exit: RC, severity D, `aot-build-fail`.

### Gate 4 — `gamma-scaffold.md` exists

```bash
git ls-tree -r --name-only origin/cycle/23 .cdd/unreleased/23/gamma-scaffold.md
```

Must be non-empty. If absent and no `## Protocol exemption` in issue body: RC, severity D, `protocol-compliance`.

## AC verification

### AC1 — Action outcomes use toasts

- `NotificationService` exists at `apps/web/src/app/shared/notification.service.ts`; wraps `MatSnackBar`; methods `success/error/info`
- Confirmed call sites: `projects-list` (create + archive), `project-issues` (drop), `issue-detail` (save + comment; optionally status-move), `create-issue-dialog` (non-409 error)
- No surviving `createError`, `archiveErrors`, `dropError`, `editSuccessMessage`, `submitError` props or template nodes for routed outcomes
- Spec assertions: `notificationSpy.success/error` called with expected messages

### AC2 — No page-replacing error; no hardcoded feedback hex

- `rg '#c00|#0a0' apps/web/src/` returns 0 in feedback styles (check manually if `rg` not available: grep for these strings in the three component files)
- `issue-detail.component.ts`: the load-error path is wrapped in a layout container (not bare `<p>` at root); `@else if` uses `loadError` (or equivalent renamed prop)
- Test: on loadError, detail layout container is present in DOM

### AC3 — Consistent empty/loading pattern

- `.app-empty` class (or equivalent shared style) exists in `styles.scss`
- Applied to board column empty states and comment empty state
- Not bare browser-default-styled text

## Focus areas for substantive review

1. **Role separation:** `NotificationService` is a thin wrapper; no business logic in service; component calls it with literal message strings.
2. **`loadError` rename:** Confirm `error` property in `issue-detail` is properly scoped to load-time only; save/status/comment errors go through `notification.*`, not `this.loadError`.
3. **Removed props:** Verify all removed props (`createError`, `archiveErrors`, `dropError`, `editSuccessMessage`, `submitError`) have no remaining references in templates or TypeScript.
4. **Panel classes:** `snack-success`/`snack-error` added to `styles.scss`; no NG-build errors from template changes.
5. **Tests:** Each component spec provides `NotificationService` spy; assertions match new behavior; test count in `self-coherence.md` matches actual `npm run test:web` output.

## Exit

- **APPROVE** when all gates pass and AC1–AC3 are met with code evidence.
- **REQUEST CHANGES** listing severity-tagged findings when any gate or AC fails.

After merge: write `.cdd/unreleased/23/beta-closeout.md` on `main`. Git identity: `beta@issue-tracker.cdd.cnos`.
