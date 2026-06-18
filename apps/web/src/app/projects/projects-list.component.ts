import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ApiService, type Project } from '../api/api.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  template: `
    <div class="container">
      <h2>Projects</h2>

      @if (loading) {
        <mat-spinner diameter="40" />
      } @else {
        @if (error) {
          <p class="error">{{ error }}</p>
        } @else if (projects.length === 0) {
          <p>No projects yet.</p>
        } @else {
          <table mat-table [dataSource]="projects" class="projects-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let project" [class.archived]="project.archived">
                <a [routerLink]="['/projects', project.id, 'issues']" class="project-link">
                  {{ project.name }}
                </a>
                @if (project.archived) {
                  <span class="archived-badge">Archived</span>
                }
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let project">
                @if (!project.archived) {
                  <button mat-stroked-button (click)="archiveProject(project)">Archive</button>
                }
                @if (archiveErrors[project.id]) {
                  <span class="inline-error">{{ archiveErrors[project.id] }}</span>
                }
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        }
      }

      <div class="create-form">
        <h3>Create Project</h3>
        <mat-form-field>
          <mat-label>Project name</mat-label>
          <input matInput [(ngModel)]="newProjectName" placeholder="Enter name" />
        </mat-form-field>
        <button
          mat-raised-button
          color="primary"
          [disabled]="!newProjectName.trim()"
          (click)="createProject()"
        >
          Create
        </button>
        @if (createError) {
          <p class="error">{{ createError }}</p>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 16px;
        max-width: 800px;
      }
      .projects-table {
        width: 100%;
      }
      .project-link {
        text-decoration: none;
        color: inherit;
      }
      .project-link:hover {
        text-decoration: underline;
      }
      .error {
        color: #c00;
      }
      .inline-error {
        color: #c00;
        font-size: 0.875em;
        margin-left: 8px;
      }
      .archived {
        opacity: 0.5;
        text-decoration: line-through;
      }
      .archived-badge {
        font-size: 0.75em;
        background: #ccc;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 8px;
        text-decoration: none;
        display: inline-block;
      }
      .create-form {
        margin-top: 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class ProjectsListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  projects: Project[] = [];
  loading = true;
  error: string | null = null;
  createError: string | null = null;
  newProjectName = '';
  archiveErrors: Record<string, string> = {};
  readonly displayedColumns = ['name', 'actions'];

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    this.api.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.message ?? 'Failed to load projects';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  createProject(): void {
    const name = this.newProjectName.trim();
    if (!name) return;
    this.createError = null;

    this.api.createProject(name).subscribe({
      next: () => {
        this.newProjectName = '';
        this.loadProjects();
      },
      error: (err: HttpErrorResponse) => {
        this.createError = err.message ?? 'Failed to create project';
        this.cdr.markForCheck();
      },
    });
  }

  archiveProject(project: Project): void {
    this.api.archiveProject(project.id).subscribe({
      next: () => {
        this.archiveErrors[project.id] = '';
        this.loadProjects();
      },
      error: (err: HttpErrorResponse) => {
        this.archiveErrors[project.id] =
          err.status === 409 ? 'Already archived' : (err.message ?? 'Archive failed');
        this.cdr.markForCheck();
      },
    });
  }
}
