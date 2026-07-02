import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { NotificationService } from '../shared/notification.service';

export interface CreateIssueDialogData {
  projectId: string;
}

@Component({
  selector: 'app-create-issue-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>New Issue</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Title *</mat-label>
        <input matInput [value]="title" (input)="onTitleChange($event)" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Description</mat-label>
        <textarea matInput [value]="description" (input)="onDescriptionChange($event)" rows="3"></textarea>
      </mat-form-field>
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Priority</mat-label>
        <mat-select [value]="priority" (selectionChange)="priority = $event.value">
          @for (p of priorities; track p) {
            <mat-option [value]="p">{{ p }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Assignee</mat-label>
        <input matInput [value]="assignee" (input)="onAssigneeChange($event)" />
      </mat-form-field>
      @if (archivedError) {
        <p class="archived-error">Project is archived — cannot create issues</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!title.trim()"
        (click)="submit()"
      >
        Create Issue
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .form-field {
        display: block;
        width: 100%;
        margin-top: var(--it-space-2, 8px);
      }
      mat-dialog-content {
        min-width: 360px;
      }
      .archived-error {
        color: var(--it-priority-critical);
        margin-top: var(--it-space-2, 8px);
      }
    `,
  ],
})
export class CreateIssueDialogComponent {
  private readonly api = inject(ApiService);
  private readonly dialogRef = inject<MatDialogRef<CreateIssueDialogComponent>>(MatDialogRef);
  private readonly data = inject<CreateIssueDialogData>(MAT_DIALOG_DATA);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notification = inject(NotificationService);

  title = '';
  description = '';
  priority = 'medium';
  assignee = '';
  archivedError = false;

  readonly priorities = ['low', 'medium', 'high', 'critical'];

  onTitleChange(event: Event): void {
    this.title = (event.target as HTMLInputElement).value;
  }

  onDescriptionChange(event: Event): void {
    this.description = (event.target as HTMLTextAreaElement).value;
  }

  onAssigneeChange(event: Event): void {
    this.assignee = (event.target as HTMLInputElement).value;
  }

  submit(): void {
    this.archivedError = false;

    const dto: { title: string; description?: string; priority?: string; assignee?: string } = {
      title: this.title,
      priority: this.priority,
    };
    if (this.description.trim()) dto.description = this.description;
    if (this.assignee.trim()) dto.assignee = this.assignee;

    this.api.createIssue(this.data.projectId, dto).subscribe({
      next: (newIssue) => {
        this.dialogRef.close(newIssue);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.archivedError = true;
          this.cdr.markForCheck();
        } else {
          this.notification.error(err.message ?? 'Failed to create issue');
          this.cdr.markForCheck();
        }
      },
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
