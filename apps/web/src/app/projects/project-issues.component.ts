import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ApiService, type Issue } from '../api/api.service';

@Component({
  selector: 'app-project-issues',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, MatTableModule],
  template: `
    <div class="container">
      <h2>Issues</h2>

      @if (loading) {
        <mat-spinner diameter="40" />
      } @else if (error) {
        <p class="error">{{ error }}</p>
      } @else {
        <table mat-table [dataSource]="issues" class="issues-table">
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let issue">{{ issue.status }}</td>
          </ng-container>

          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef>Priority</th>
            <td mat-cell *matCellDef="let issue">{{ issue.priority }}</td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let issue">{{ issue.title }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
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
  readonly displayedColumns = ['status', 'priority', 'title'];

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('projectId') ?? '';

    this.api.getIssues(projectId).subscribe({
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
}
