import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ApiService, type Issue } from '../api/api.service';
import { ChipComponent } from '../shared/chip.component';
import { STATUS_LABELS } from '../shared/issue-labels';

export type IssueStatus = 'open' | 'in_progress' | 'done' | 'closed';

export const STATUSES: IssueStatus[] = ['open', 'in_progress', 'done', 'closed'];

@Component({
  selector: 'app-project-issues',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DragDropModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ChipComponent,
  ],
  template: `
    <div class="container">
      <h2>{{ projectName ? 'Issues — ' + projectName : 'Issues' }}</h2>

      @if (loading) {
        <mat-spinner diameter="40" />
      } @else {
        @if (error) {
          <p class="error">{{ error }}</p>
        } @else {
          @if (dropError) {
            <p class="drop-error">{{ dropError }}</p>
          }
          <div class="board" cdkDropListGroup>
            @for (status of statuses; track status) {
              <div class="board-column">
                <div class="column-header">
                  <app-chip [kind]="'status'" [value]="status" />
                  <span class="count-badge">{{ columns[status].length }}</span>
                </div>
                <div
                  class="column-list"
                  cdkDropList
                  [id]="status"
                  [cdkDropListData]="columns[status]"
                  [cdkDropListConnectedTo]="otherStatuses(status)"
                  (cdkDropListDropped)="onDrop($event, status)"
                >
                  @if (columns[status].length === 0) {
                    <p class="empty-col">No issues</p>
                  }
                  @for (issue of columns[status]; track issue.id) {
                    <div class="issue-card" cdkDrag [cdkDragData]="issue">
                      <a [routerLink]="['/issues', issue.id]" class="issue-link">{{ issue.title }}</a>
                      <div class="card-meta">
                        <app-chip [kind]="'priority'" [value]="issue.priority" />
                        @if (issue.assignee) {
                          <span class="assignee">{{ issue.assignee }}</span>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
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
        max-width: 1200px;
      }
      .error {
        color: #c00;
      }
      .success {
        color: #0a0;
      }
      .drop-error {
        color: #c00;
        margin-bottom: 8px;
      }
      .board {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        padding-bottom: 8px;
      }
      .board-column {
        flex: 0 0 220px;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .column-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-weight: 600;
      }
      .count-badge {
        background: #e0e0e0;
        border-radius: 12px;
        padding: 0 8px;
        font-size: 0.8em;
        font-weight: 500;
      }
      .column-list {
        background: #f5f5f5;
        border-radius: 6px;
        padding: 8px;
        min-height: 80px;
        flex: 1;
      }
      .column-list.cdk-drop-list-dragging .issue-card:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .issue-card {
        background: #fff;
        border-radius: 4px;
        padding: 10px 12px;
        margin-bottom: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        cursor: grab;
      }
      .issue-card:active {
        cursor: grabbing;
      }
      .issue-link {
        display: block;
        text-decoration: none;
        color: inherit;
        font-weight: 500;
        margin-bottom: 6px;
      }
      .issue-link:hover {
        text-decoration: underline;
      }
      .card-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .assignee {
        font-size: 0.8em;
        color: #666;
      }
      .empty-col {
        color: #999;
        font-size: 0.85em;
        text-align: center;
        padding: 8px 0;
      }
      .create-section {
        margin-top: 24px;
      }
      .form-field {
        display: block;
        width: 100%;
        margin-top: 8px;
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

  readonly statuses: IssueStatus[] = STATUSES;

  columns: Record<IssueStatus, Issue[]> = {
    open: [],
    in_progress: [],
    done: [],
    closed: [],
  };

  loading = true;
  error: string | null = null;
  dropError: string | null = null;
  createError: string | null = null;
  projectName = '';

  projectId = '';
  newTitle = '';
  newDescription = '';
  newPriority = 'medium';
  newAssignee = '';
  projectArchived = false;
  successMessage = '';

  readonly priorities = ['low', 'medium', 'high', 'critical'];

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    this.loadProject();
    this.loadIssues();
  }

  private loadProject(): void {
    this.api.getProject(this.projectId).subscribe({
      next: (project) => {
        this.projectName = project.name;
        this.cdr.markForCheck();
      },
      error: () => {
        // non-fatal: heading falls back to "Issues"
      },
    });
  }

  private loadIssues(): void {
    this.api.getIssues(this.projectId).subscribe({
      next: (issues) => {
        this.distributeIssues(issues);
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

  private distributeIssues(issues: Issue[]): void {
    const cols: Record<IssueStatus, Issue[]> = {
      open: [],
      in_progress: [],
      done: [],
      closed: [],
    };
    for (const issue of issues) {
      const status = issue.status as IssueStatus;
      if (cols[status]) {
        cols[status].push(issue);
      }
    }
    this.columns = cols;
  }

  otherStatuses(current: IssueStatus): IssueStatus[] {
    return this.statuses.filter((s) => s !== current);
  }

  onDrop(event: CdkDragDrop<Issue[]>, targetStatus: IssueStatus): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const issue: Issue = event.item.data;

    // Optimistic move
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    // Persist
    this.api.updateIssueStatus(issue.id, targetStatus).subscribe({
      next: () => {
        issue.status = targetStatus;
        this.dropError = null;
        this.cdr.markForCheck();
      },
      error: () => {
        // Revert
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex,
        );
        this.dropError = `Failed to move issue to ${STATUS_LABELS[targetStatus] ?? targetStatus}`;
        this.cdr.markForCheck();
      },
    });

    this.cdr.markForCheck();
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
