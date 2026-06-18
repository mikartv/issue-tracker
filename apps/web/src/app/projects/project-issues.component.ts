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
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService, type Issue } from '../api/api.service';

@Component({
  selector: 'app-project-issues',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatProgressSpinnerModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <div class="container">
      <h2>Issues</h2>

      @if (loading) {
        <mat-spinner diameter="40" />
      } @else {
        @if (error) {
          <p class="error">{{ error }}</p>
        } @else if (issues.length === 0) {
          <p>No issues yet.</p>
        } @else {
          <table mat-table [dataSource]="issues" class="issues-table">
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let issue">{{ statusLabels[issue.status] ?? issue.status }}</td>
            </ng-container>

            <ng-container matColumnDef="priority">
              <th mat-header-cell *matHeaderCellDef>Priority</th>
              <td mat-cell *matCellDef="let issue">{{ priorityLabels[issue.priority] ?? issue.priority }}</td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let issue">
                <a [routerLink]="['/issues', issue.id]" class="issue-link">{{ issue.title }}</a>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        }

        <div class="create-section">
          <h3>Create Issue</h3>
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Title *</mat-label>
            <input matInput [value]="newTitle" (input)="onNewTitleChange($event)" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Description</mat-label>
            <textarea matInput [value]="newDescription" (input)="onNewDescriptionChange($event)" rows="3"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Priority</mat-label>
            <mat-select [value]="newPriority" (selectionChange)="newPriority = $event.value">
              @for (p of priorities; track p) {
                <mat-option [value]="p">{{ p }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Assignee</mat-label>
            <input matInput [value]="newAssignee" (input)="onNewAssigneeChange($event)" />
          </mat-form-field>
          @if (projectArchived) {
            <p class="error">Project is archived — cannot create issues</p>
          }
          @if (successMessage) {
            <p class="success">{{ successMessage }}</p>
          }
          <button
            mat-raised-button
            color="primary"
            [disabled]="!newTitle.trim() || projectArchived"
            (click)="submitCreate()"
          >
            Create Issue
          </button>
          @if (createError) {
            <p class="create-error">{{ createError }}</p>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .container {
        padding: 16px;
        max-width: 1000px;
      }
      .issues-table {
        width: 100%;
      }
      .error {
        color: #c00;
      }
      .success {
        color: #0a0;
      }
      .create-section {
        margin-top: 24px;
      }
      .form-field {
        display: block;
        width: 100%;
        margin-top: 8px;
      }
      .issue-link {
        text-decoration: none;
        color: inherit;
      }
      .issue-link:hover {
        text-decoration: underline;
      }
      .create-error {
        color: #c00;
        margin-top: 8px;
      }
    `,
  ],
})
export class ProjectIssuesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  issues: Issue[] = [];
  loading = true;
  error: string | null = null;
  createError: string | null = null;
  readonly displayedColumns = ['status', 'priority', 'title'];

  projectId = '';
  newTitle = '';
  newDescription = '';
  newPriority = 'medium';
  newAssignee = '';
  projectArchived = false;
  successMessage = '';

  readonly priorities = ['low', 'medium', 'high', 'critical'];

  readonly statusLabels: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  readonly priorityLabels: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    this.loadIssues();
  }

  private loadIssues(): void {
    this.api.getIssues(this.projectId).subscribe({
      next: (issues) => {
        this.issues = issues;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.message ?? 'Failed to load issues';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  submitCreate(): void {
    this.successMessage = '';
    this.createError = null;
    const dto: { title: string; description?: string; priority?: string; assignee?: string } = {
      title: this.newTitle,
      priority: this.newPriority,
    };
    if (this.newDescription.trim()) dto.description = this.newDescription;
    if (this.newAssignee.trim()) dto.assignee = this.newAssignee;

    this.api.createIssue(this.projectId, dto).subscribe({
      next: () => {
        this.successMessage = 'Issue created';
        this.newTitle = '';
        this.newDescription = '';
        this.newPriority = 'medium';
        this.newAssignee = '';
        this.loadIssues();
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.projectArchived = true;
          this.successMessage = '';
        } else {
          this.createError = err.message ?? 'Failed to create issue';
        }
        this.cdr.markForCheck();
      },
    });
  }

  onNewTitleChange(event: Event): void {
    this.newTitle = (event.target as HTMLInputElement).value;
  }

  onNewDescriptionChange(event: Event): void {
    this.newDescription = (event.target as HTMLTextAreaElement).value;
  }

  onNewAssigneeChange(event: Event): void {
    this.newAssignee = (event.target as HTMLInputElement).value;
  }
}
