import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApiService, type Issue, type Comment } from '../api/api.service';
import { ChipComponent } from '../shared/chip.component';
import { STATUS_LABELS } from '../shared/issue-labels';
import { NotificationService } from '../shared/notification.service';

const NEXT_STATUS: Record<string, string | null> = {
  open: 'in_progress',
  in_progress: 'done',
  done: 'closed',
  closed: null,
};

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ChipComponent,
  ],
  template: `
    @if (loading) {
      <mat-spinner diameter="40" />
    } @else if (notFound) {
      <p class="error">Issue not found</p>
    } @else if (loadError) {
      <div class="error-container">
        <p class="error">Error: {{ loadError }}</p>
        <a routerLink="/projects">Back to projects</a>
      </div>
    } @else if (issue) {
      <div class="detail-layout">
        <!-- Main content area -->
        <main class="detail-main">
          @if (!editMode) {
            <h2 class="issue-title">{{ issue.title }}</h2>
            <p class="detail-description">{{ issue.description ?? '—' }}</p>
          } @else {
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Title</mat-label>
              <input matInput [value]="editTitle" (input)="onEditTitleChange($event)" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Description</mat-label>
              <textarea matInput [value]="editDescription" (input)="onEditDescriptionChange($event)" rows="3"></textarea>
            </mat-form-field>
          }

          <!-- Comments section — always visible -->
          <section class="comments-section">
            <h3>Comments</h3>
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
                <p class="comment-empty app-empty">No comments yet.</p>
              }
            </div>

            <h4>Add Comment</h4>
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Your email (X-User-Email)</mat-label>
              <input matInput [value]="userEmail" (input)="onEmailChange($event)" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Comment</mat-label>
              <textarea matInput [value]="commentBody" (input)="onCommentChange($event)" rows="4"></textarea>
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="submitComment()">Add Comment</button>
          </section>
        </main>

        <!-- Metadata sidebar -->
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
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Priority</mat-label>
                    <mat-select [value]="editPriority" (selectionChange)="editPriority = $event.value">
                      @for (p of priorities; track p) {
                        <mat-option [value]="p">{{ p }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>
                }
              </div>

              <div class="sidebar-field">
                <span class="sidebar-label">Assignee</span>
                @if (!editMode) {
                  <span>{{ issue.assignee ?? '—' }}</span>
                } @else {
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Assignee</mat-label>
                    <input matInput [value]="editAssignee" (input)="onEditAssigneeChange($event)" />
                  </mat-form-field>
                }
              </div>

              @if (nextStatus) {
                <button mat-raised-button class="sidebar-btn" (click)="moveToNextStatus()">Move to {{ getStatusLabel(nextStatus!) }}</button>
              }

              @if (!editMode) {
                <button mat-raised-button class="sidebar-btn" (click)="enterEditMode()">Edit</button>
              } @else {
                <button mat-raised-button color="primary" class="sidebar-btn" [disabled]="!editTitle.trim()" (click)="saveEdit()">Save</button>
                <button mat-button class="sidebar-btn" (click)="cancelEdit()">Cancel</button>
              }

            </mat-card-content>
          </mat-card>

          <a [routerLink]="['/projects', issue.project_id, 'issues']">Back to project issues</a>
        </aside>
      </div>
    }
  `,
  styles: [
    `
      .detail-layout {
        display: grid;
        grid-template-columns: 1fr 280px;
        gap: var(--it-space-4);
        padding: var(--it-space-4);
        max-width: 1000px;
      }
      @media (max-width: 767px) {
        .detail-layout { grid-template-columns: 1fr; }
        .detail-sidebar { order: -1; }
      }
      .detail-main { min-width: 0; }
      .issue-title { margin-top: 0; }
      .detail-description { color: rgba(0, 0, 0, 0.7); }
      .error { color: var(--it-priority-critical); }
      .error-container {
        padding: var(--it-space-4);
        display: flex;
        flex-direction: column;
        gap: var(--it-space-2);
      }
      .form-field { display: block; width: 100%; margin-top: var(--it-space-2); }
      .sidebar-field {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--it-space-3);
      }
      .sidebar-label {
        font-size: 0.75em;
        text-transform: uppercase;
        color: rgba(0, 0, 0, 0.5);
        margin-bottom: var(--it-space-1);
        letter-spacing: 0.05em;
      }
      .sidebar-btn { display: block; width: 100%; margin-top: var(--it-space-2); }
      .detail-sidebar a {
        display: block;
        margin-top: var(--it-space-3);
        font-size: 0.9em;
      }
      .comments-section { margin-top: var(--it-space-4); }
      .comment-list { margin-bottom: var(--it-space-4); }
      .comment-item {
        display: flex;
        gap: var(--it-space-3);
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        padding: var(--it-space-3) 0;
      }
      .comment-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--it-status-open);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.85em;
        flex-shrink: 0;
      }
      .comment-content { flex: 1; min-width: 0; }
      .comment-header {
        display: flex;
        gap: var(--it-space-2);
        align-items: baseline;
        margin-bottom: var(--it-space-1);
      }
      .comment-author { font-weight: 600; font-size: 0.9em; }
      .comment-timestamp { font-size: 0.8em; color: rgba(0, 0, 0, 0.5); }
      .comment-body { font-size: 0.95em; }
      .comment-empty { color: rgba(0, 0, 0, 0.5); font-style: italic; }
    `,
  ],
})
export class IssueDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notification = inject(NotificationService);

  issue: Issue | null = null;
  comments: Comment[] = [];
  loading = true;
  notFound = false;
  loadError: string | null = null;
  commentBody = '';
  userEmail = '';

  editMode = false;
  editTitle = '';
  editDescription = '';
  editPriority = '';
  editAssignee = '';

  readonly priorities = ['low', 'medium', 'high', 'critical'];

  getStatusLabel(key: string): string {
    return STATUS_LABELS[key] ?? key;
  }

  getInitials(author: string): string {
    const name = author.split('@')[0];
    return name.charAt(0).toUpperCase();
  }

  get nextStatus(): string | null {
    return this.issue ? (NEXT_STATUS[this.issue.status] ?? null) : null;
  }

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') ?? '';
    const issueId = this.route.snapshot.paramMap.get('issueId') ?? '';
    this.loadIssue(issueId);
  }

  private loadIssue(issueId: string): void {
    this.api.getIssue(issueId).subscribe({
      next: (issue) => {
        this.issue = issue;
        this.loading = false;
        this.loadComments(issueId);
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 404) {
          this.notFound = true;
        } else {
          this.loadError = err.message ?? 'Failed to load issue';
        }
        this.cdr.markForCheck();
      },
    });
  }

  private loadComments(issueId: string): void {
    this.api.getComments(issueId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.cdr.markForCheck();
      },
    });
  }

  moveToNextStatus(): void {
    if (!this.issue || !this.nextStatus) return;
    const issueId = this.issue.id;
    const next = this.nextStatus;
    this.api.updateIssueStatus(issueId, next).subscribe({
      next: () => this.loadIssue(issueId),
      error: (err: HttpErrorResponse) => {
        this.notification.error(err.message ?? 'Failed to update status');
      },
    });
  }

  enterEditMode(): void {
    if (!this.issue) return;
    this.editTitle = this.issue.title;
    this.editDescription = this.issue.description ?? '';
    this.editPriority = this.issue.priority;
    this.editAssignee = this.issue.assignee ?? '';
    this.editMode = true;
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.editMode = false;
    this.cdr.markForCheck();
  }

  saveEdit(): void {
    if (!this.issue) return;
    const issueId = this.issue.id;
    this.api.updateIssue(issueId, {
      title: this.editTitle,
      description: this.editDescription || undefined,
      priority: this.editPriority,
      assignee: this.editAssignee || undefined,
    }).subscribe({
      next: () => {
        this.notification.success('Issue saved');
        this.editMode = false;
        this.cdr.markForCheck();
        this.loadIssue(issueId);
      },
      error: (err: HttpErrorResponse) => {
        this.notification.error(err.message ?? 'Failed to save issue');
        this.cdr.markForCheck();
      },
    });
  }

  submitComment(): void {
    if (!this.issue) return;
    const issueId = this.issue.id;
    const body = this.commentBody;
    const email = this.userEmail || undefined;
    this.api.addComment(issueId, body, email).subscribe({
      next: () => {
        this.commentBody = '';
        this.notification.success('Comment added');
        this.loadComments(issueId);
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.notification.error(err.message ?? 'Failed to add comment');
        this.cdr.markForCheck();
      },
    });
  }

  onEmailChange(event: Event): void {
    this.userEmail = (event.target as HTMLInputElement).value;
    localStorage.setItem('userEmail', this.userEmail);
  }

  onCommentChange(event: Event): void {
    this.commentBody = (event.target as HTMLTextAreaElement).value;
  }

  onEditTitleChange(event: Event): void {
    this.editTitle = (event.target as HTMLInputElement).value;
  }

  onEditDescriptionChange(event: Event): void {
    this.editDescription = (event.target as HTMLTextAreaElement).value;
  }

  onEditAssigneeChange(event: Event): void {
    this.editAssignee = (event.target as HTMLInputElement).value;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }
}
