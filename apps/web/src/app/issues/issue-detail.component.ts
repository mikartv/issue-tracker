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
import { ApiService, type Issue, type Comment } from '../api/api.service';

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
  ],
  template: `
    @if (loading) {
      <mat-spinner diameter="40" />
    } @else if (notFound) {
      <p class="error">Issue not found</p>
    } @else if (error) {
      <p class="error">Error: {{ error }}</p>
    } @else if (issue) {
      <div class="container">
        <h2>{{ issue.title }}</h2>
        <p><strong>Description:</strong> {{ issue.description ?? '—' }}</p>
        <p><strong>Status:</strong> {{ issue.status }}</p>
        <p><strong>Priority:</strong> {{ issue.priority }}</p>
        <p><strong>Assignee:</strong> {{ issue.assignee ?? '—' }}</p>
        <p>
          <a [routerLink]="['/projects', issue.project_id, 'issues']">Back to project issues</a>
        </p>

        @if (nextStatus) {
          <button mat-raised-button (click)="moveToNextStatus()">Move to {{ nextStatus }}</button>
        }

        <h3>Comments</h3>
        <ul class="comment-list">
          @for (comment of comments; track comment.id) {
            <li class="comment-item">
              <strong>{{ comment.author }}</strong> — {{ formatDate(comment.created_at) }}
              <p>{{ comment.body }}</p>
            </li>
          } @empty {
            <li>No comments yet.</li>
          }
        </ul>

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
      </div>
    }
  `,
  styles: [
    `
      .container { padding: 16px; max-width: 800px; }
      .error { color: #c00; }
      .comment-list { list-style: none; padding: 0; }
      .comment-item { border-bottom: 1px solid #eee; padding: 8px 0; }
      .form-field { display: block; width: 100%; margin-top: 8px; }
    `,
  ],
})
export class IssueDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  issue: Issue | null = null;
  comments: Comment[] = [];
  loading = true;
  notFound = false;
  error: string | null = null;
  commentBody = '';
  userEmail = '';

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
          this.error = err.message ?? 'Failed to load issue';
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
        this.loadComments(issueId);
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

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }
}
