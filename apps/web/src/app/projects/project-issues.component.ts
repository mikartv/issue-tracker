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
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService, type Issue } from '../api/api.service';
import { ChipComponent } from '../shared/chip.component';
import { STATUS_LABELS } from '../shared/issue-labels';
import { CreateIssueDialogComponent, CreateIssueDialogData } from './create-issue-dialog.component';
import { NotificationService } from '../shared/notification.service';

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
    MatButtonModule,
    MatDialogModule,
    ChipComponent,
  ],
  template: `
    <div class="container">
      <div class="header-row">
        <h2>{{ projectName ? 'Issues — ' + projectName : 'Issues' }}</h2>
        <button mat-raised-button color="primary"
                [disabled]="projectArchived"
                (click)="openNewIssueDialog()">New Issue</button>
      </div>

      @if (loading) {
        <mat-spinner diameter="40" />
      } @else {
        @if (error) {
          <p class="error">{{ error }}</p>
        } @else {
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
                    <p class="empty-col app-empty">No issues</p>
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
      }
    </div>
  `,
  styles: [
    `
      .container {
        padding: 16px;
        max-width: 1200px;
      }
      .header-row {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
      }
      .error {
        color: var(--it-priority-critical);
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
    `,
  ],
})
export class ProjectIssuesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly statuses: IssueStatus[] = STATUSES;

  columns: Record<IssueStatus, Issue[]> = {
    open: [],
    in_progress: [],
    done: [],
    closed: [],
  };

  loading = true;
  error: string | null = null;
  projectName = '';
  projectId = '';
  projectArchived = false;

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    this.loadProject();
    this.loadIssues();
  }

  private loadProject(): void {
    this.api.getProject(this.projectId).subscribe({
      next: (project) => {
        this.projectName = project.name;
        this.projectArchived = project.archived;
        this.cdr.markForCheck();
      },
      error: () => {
        // non-fatal: heading falls back to "Issues"
      },
    });
  }

  loadIssues(): void {
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
        this.notification.error(`Failed to move issue to ${STATUS_LABELS[targetStatus] ?? targetStatus}`);
        this.cdr.markForCheck();
      },
    });

    this.cdr.markForCheck();
  }

  openNewIssueDialog(): void {
    const ref = this.dialog.open(CreateIssueDialogComponent, {
      data: { projectId: this.projectId } satisfies CreateIssueDialogData,
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.loadIssues();
      }
    });
  }
}
