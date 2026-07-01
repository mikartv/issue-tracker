---
cycle: 22
issue: "gh #12 — enhancement: redesign issue-detail — sidebar metadata, inline edit, comment thread"
role: γ
artifact: gamma-scaffold
---

# γ Scaffold — Cycle 22

## Issue summary

**gh #12** — redesign `IssueDetailComponent`: two-area layout (main + sidebar), inline/contextual
edit (comments always visible), styled comment thread using R1 tokens + R3 chips.

**Mode:** design-and-build (4 ACs, small band, no split)  
**Priority:** P2  
**Dispatch config:** §5.2 — δ=γ, single-session Claude Code

---

## Peer enumeration (§2.2a)

Surfaces scanned before authoring the gap:

| Surface | Path | Finding |
|---------|------|---------|
| Issue-detail component | `apps/web/src/app/issues/issue-detail.component.ts` | Exists — flat `<p>` layout; full-view-swap edit (`@if (!editMode) … @else …` hides comments and context during edit); `<ul>/<li>` comment list; `#c00`/`#0a0`/`#eee` literals in styles |
| Issue-detail spec | `apps/web/src/app/issues/issue-detail.component.spec.ts` | Exists — 13 tests covering display, edit, comment, label rendering |
| R3 chip | `apps/web/src/app/shared/chip.component.ts` | Exists — `ChipComponent` with `STATUS_LABELS`/`PRIORITY_LABELS` from `issue-labels.ts`; already imported in issue-detail |
| R1 tokens | `apps/web/src/styles.scss` | Exists — `--it-space-{1-6}`, `--it-radius-{sm,md,lg}`, `--it-shadow-{1,2}`, `--it-surface`, `--it-background`, `--it-status-*`, `--it-priority-*` confirmed |

Gap framing: component exists with flat layout and full-swap edit. This cycle restructures template + styles (not adds a new component). Additive framing: two-area layout, always-visible comments, inline edit, and styled thread are all absent — confirmed by code inspection.

---

## Files α touches

| File | Change type |
|------|-------------|
| `apps/web/src/app/issues/issue-detail.component.ts` | Primary — template rewrite + styles rewrite; class additions (one new method `getInitials`); class logic largely unchanged |
| `apps/web/src/app/issues/issue-detail.component.spec.ts` | Spec — ≥4 new tests (AC1–AC4); existing tests adjusted for new DOM structure |

No new files, no new modules. All needed Angular Material modules (`MatCardModule`, `MatButtonModule`, etc.) are already imported.

---

## Implementation guidance

### Layout approach

Replace the single flat `.container` with a two-area CSS grid:

```
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: var(--it-space-4);
  padding: var(--it-space-4);
  max-width: 1000px;
}
/* mobile: stack vertically */
@media (max-width: 767px) {
  .detail-layout { grid-template-columns: 1fr; }
  .detail-sidebar { order: -1; }
}
```

- **Main area** (`.detail-main`): title display/edit, description display/edit, comment section
- **Sidebar** (`.detail-sidebar` or `<aside>`): `<mat-card>` containing status chip, priority chip,
  assignee (view/edit), "Move to next status" button, Edit/Save/Cancel controls, back link

### Inline edit — comments always visible

The **only** conditional in the main area is for the title/description fields:
```html
@if (!editMode) {
  <h2>{{ issue.title }}</h2>
  <p class="detail-description">{{ issue.description ?? '—' }}</p>
} @else {
  <mat-form-field …>Title</mat-form-field>
  <mat-form-field …>Description</mat-form-field>
}
```

The comment `<section>` (including "Add Comment" form) lives **outside** any `@if (editMode)` — it renders unconditionally while the issue is loaded.

### Sidebar content

```html
<aside class="detail-sidebar">
  <mat-card>
    <mat-card-content>
      <div class="sidebar-field">
        <span class="sidebar-label">Status</span>
        <app-chip [kind]="'status'" [value]="issue.status" />
      </div>
      <div class="sidebar-field">
        <span class="sidebar-label">Priority</span>
        @if (!editMode) {
          <app-chip [kind]="'priority'" [value]="issue.priority" />
        } @else {
          <mat-form-field …><mat-select …></mat-select></mat-form-field>
        }
      </div>
      <div class="sidebar-field">
        <span class="sidebar-label">Assignee</span>
        @if (!editMode) {
          <span>{{ issue.assignee ?? '—' }}</span>
        } @else {
          <mat-form-field …><input matInput …/></mat-form-field>
        }
      </div>

      @if (nextStatus) {
        <button mat-raised-button (click)="moveToNextStatus()">Move to {{ getStatusLabel(nextStatus) }}</button>
      }

      @if (!editMode) {
        <button mat-raised-button (click)="enterEditMode()">Edit</button>
      } @else {
        <button mat-raised-button color="primary" [disabled]="!editTitle.trim()" (click)="saveEdit()">Save</button>
        <button mat-button (click)="cancelEdit()">Cancel</button>
      }

      @if (editSuccessMessage) {
        <p class="success">{{ editSuccessMessage }}</p>
      }
    </mat-card-content>
  </mat-card>
  <a [routerLink]="['/projects', issue.project_id, 'issues']">Back to project issues</a>
</aside>
```

### Styled comment thread

Replace `<ul>/<li>` with `<div>` cards:

```html
<div class="comment-list">
  @for (comment of comments; track comment.id) {
    <div class="comment-item">
      <div class="comment-avatar">{{ getInitials(comment.author) }}</div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-author">{{ comment.author }}</span>
          <span class="comment-timestamp">{{ formatDate(comment.created_at) }}</span>
        </div>
        <div class="comment-body">{{ comment.body }}</div>
      </div>
    </div>
  } @empty {
    <p class="comment-empty">No comments yet.</p>
  }
</div>
```

New class method (add to component class):
```ts
getInitials(author: string): string {
  const name = author.split('@')[0];
  return name.charAt(0).toUpperCase();
}
```

Token-based styles (replace all `#c00`/`#0a0`/`#eee` literals):
```css
.error { color: var(--it-priority-critical); }   /* replaces #c00 */
.success { color: var(--it-status-done); }        /* replaces #0a0 */
.comment-item { border-bottom: 1px solid rgba(0, 0, 0, 0.08); }  /* replaces #eee */
.comment-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--it-status-open);  /* brand blue */
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 0.85em; flex-shrink: 0;
}
```

---

## AC oracle approach

| AC | Oracle | New test |
|----|--------|----------|
| AC1: Two-area layout | Query `.detail-sidebar` contains `app-chip` elements; flat `<p>` stack absent | `it('AC1: sidebar card present with status and priority chips')` |
| AC2: Comments always visible | Enter editMode, detectChanges, assert `.comment-item` (or comment-empty) still present | `it('AC2: comment section visible during edit mode')` |
| AC3: Inline edit preserves context | In editMode: title/status still visible in DOM (sidebar); Save calls updateIssue; Cancel calls no API | `it('AC3: issue context visible during edit; save/cancel unchanged')` |
| AC4: Styled comment thread | `.comment-avatar` present per comment; `.comment-body` present; no `<li>` comment items | `it('AC4: comment thread renders avatar, author, timestamp, body')` |

Existing tests adjustments needed:
- Tests querying `li.comment-item` → update to `.comment-item`
- Test checking `h3` for "Edit Issue" heading → remove that assertion (no longer present)
- Tests using `<p>` selector for Status/Priority → update to `.sidebar-field` or by chip presence
- Behavioral tests (saveEdit, cancelEdit, submitComment) → no change needed (class methods unchanged)

---

## Expected diff scope

| File | Net change (approx) |
|------|---------------------|
| `issue-detail.component.ts` | ~+60/−30 lines (template + styles rewrite; +1 method) |
| `issue-detail.component.spec.ts` | ~+40/−10 lines (+4 new tests; existing adjusted) |

---

## Dispatch config note

§5.2 — δ=γ, single-session Claude Code. α and β dispatched as sub-agents via Agent tool.
α implements on `cycle/22`; β reviews and merges. Per §5.2.1, parent session enters quiescence
during each sub-agent run.
