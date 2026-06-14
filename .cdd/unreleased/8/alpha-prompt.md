# α Dispatch — Cycle 8

Issue: Read `.cdd/issues/8/ISSUE.md` from repo root (full contract: gap, ACs, non-goals).  
Scaffold: Read `.cdd/unreleased/8/gamma-scaffold.md` (surfaces, AC oracle, transition logic — read before implementing).  
Branch: cycle/8 (already exists — run `git switch cycle/8`; do not create a new branch).

## Implementation contract

| Axis | Value |
|------|-------|
| Language | TypeScript (`strict: true` in both apps) |
| CLI integration target | N/A |
| Package scoping | `apps/web/` only; root workspace scripts (`npm run test:web`) |
| Existing-binary disposition | N/A |
| Runtime dependencies | Angular 17, Angular Material (already in project deps from cycle 7), `HttpClient` |
| JSON/wire contract preservation | `/api/v1` global prefix; UUID string IDs; existing error shape unchanged; no API files modified |
| Backward-compat invariant | Routes `/projects` and `/projects/:projectId/issues` and their components must remain unaffected |

## What to implement

### 1. Extend `ApiService` (`apps/web/src/app/api/api.service.ts`)

Add the `Comment` interface (after the existing `Issue` interface):

```typescript
export interface Comment {
  id: string;
  issue_id: string;
  author: string;
  body: string;
  created_at: string;
}
```

Add three methods:

- `getComments(issueId: string): Observable<Comment[]>` — `GET /api/v1/issues/:issueId/comments`
- `addComment(issueId: string, body: string, userEmail?: string): Observable<Comment>` — `POST /api/v1/issues/:issueId/comments` with body `{ body }`; when `userEmail` is non-empty set request header `X-User-Email: <userEmail>`
- `updateIssueStatus(issueId: string, status: string): Observable<Issue>` — `POST /api/v1/issues/:issueId/status` with body `{ status }`

### 2. Replace `IssueDetailComponent` (`apps/web/src/app/issues/issue-detail.component.ts`)

Replace the placeholder stub entirely. The component must:

**Lifecycle:**
- Inject `ActivatedRoute`, `ApiService`, `ChangeDetectorRef`; implement `OnInit`
- On init: read `issueId` from `route.snapshot.paramMap.get('issueId')`; call `getIssue(issueId)` and on success call `getComments(issueId)`
- If `getIssue` returns an HTTP 404 error (`HttpErrorResponse` with `status === 404`), set a `notFound = true` flag; render a "Issue not found" message for AC6
- For other errors, set a generic `error` string

**Display (AC1):**
- Title, description (or "—" when null), status badge, priority, assignee (or "—" when null)
- Project link: `[routerLink]="['/projects', issue.project_id, 'issues']"` — navigates to the issues list for the issue's project

**Status change control (AC2):**
- Compute the legal next status client-side: `open→in_progress`, `in_progress→done`, `done→closed`, `closed→null`
- When a legal next state exists: render a `<button mat-raised-button>` labeled `"Move to [nextStatus]"`; on click call `updateIssueStatus(issue.id, nextStatus)` then re-fetch the issue
- When current status is `closed`: omit the button entirely (or `[disabled]="true"` is acceptable)

**Comment thread (AC3):**
- Render comments chronologically (API already returns `ASC` by `created_at`)
- Each comment: author, body, `created_at` formatted as a readable date string

**Add-comment form (AC3 + AC4):**
- `<textarea>` for body text
- Simple text `<input>` labeled "Your email (X-User-Email)" for the dev identity field; persist its value to `localStorage` under key `userEmail` on each change; initialize from `localStorage.getItem('userEmail') ?? ''` on component init
- Submit button; on click: call `addComment(issue.id, bodyValue, emailValue || undefined)` then re-fetch comment list and clear the textarea

**Angular Material imports:** use `MatProgressSpinnerModule`, `MatCardModule`, `MatButtonModule`, `MatInputModule`, `MatFormFieldModule`, `RouterLink` from `@angular/router`. Standalone component. `ChangeDetectionStrategy.OnPush` + `ChangeDetectorRef.markForCheck()` consistent with cycle 7 pattern.

### 3. Write `apps/web/src/app/issues/issue-detail.component.spec.ts` (new file, AC5)

TestBed specs covering:

- **AC1**: mock `ApiService.getIssue` returning a fixture issue; after `detectChanges()` verify title text, status text, and `routerLink` on the project link
- **AC2a**: fixture issue with `status: 'open'` → "Move to in_progress" button present
- **AC2b**: fixture issue with `status: 'closed'` → status button absent or disabled
- **AC3**: mock `getComments` returning two fixture comments; verify list renders two items; trigger form submit; verify `addComment` called once
- **AC4**: after setting `localStorage.setItem('userEmail', 'tester@example.com')`, trigger `addComment`; use `HttpTestingController` or spy to assert the `X-User-Email` header equals `tester@example.com`
- **AC6**: mock `getIssue` returning an `HttpErrorResponse` with `status: 404`; verify "Issue not found" text in DOM

### 4. Extend `apps/web/src/app/api/api.service.spec.ts`

Add specs for the three new methods following the existing `HttpTestingController` pattern:
- `getComments()` — verify `GET .../issues/:id/comments`
- `addComment()` — verify `POST .../issues/:id/comments`; assert `X-User-Email` header set when email provided; absent when not provided
- `updateIssueStatus()` — verify `POST .../issues/:id/status` with body `{ status }`

## Constraints (binding)

- Do NOT edit any file under `apps/api/`.
- Do NOT modify `apps/web/src/app/app.routes.ts`.
- Do NOT introduce NgModules; standalone components only.
- Do NOT remove or change the `ProjectsListComponent` or `ProjectIssuesComponent`.
- `npm run test:web` must exit 0 before signaling review-readiness. Run it and confirm.

## Self-coherence report

When implementation is complete and tests pass, write `.cdd/unreleased/8/self-coherence.md` on `cycle/8` covering:

- Gap addressed and mode
- ACs met (numbered checklist — yes/no per AC with one-line evidence)
- Files changed with approximate line counts
- Test counts before and after (web suite)
- Known gaps or deferred items (be honest about anything left incomplete)
- Review-readiness declaration

Commit all changes (implementation + spec + self-coherence) to `cycle/8` before signaling done.
