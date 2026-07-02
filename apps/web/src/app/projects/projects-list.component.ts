import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService, type Project } from '../api/api.service';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
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
          <div class="empty-state">
            <mat-icon>folder_open</mat-icon>
            <p>No projects yet</p>
            <button mat-raised-button color="primary" (click)="scrollToCreate()">Create project</button>
          </div>
        } @else {
          <div class="projects-grid">
            @for (project of projects; track project.id) {
              <mat-card [class.archived]="project.archived">
                <mat-card-header>
                  <mat-card-title>
                    <a [routerLink]="['/projects', project.id, 'issues']" class="project-link">
                      {{ project.name }}
                    </a>
                    @if (project.archived) {
                      <span class="archived-badge">Archived</span>
                    }
                  </mat-card-title>
                </mat-card-header>
                <mat-card-actions>
                  @if (!project.archived) {
                    <button mat-stroked-button (click)="archiveProject(project)">Archive</button>
                  }
                </mat-card-actions>
              </mat-card>
            }
          </div>
        }
      }

      <div class="create-form" #createForm>
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
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 16px;
        max-width: 960px;
      }
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--it-space-4);
      }
      @media (max-width: 767px) {
        .projects-grid {
          grid-template-columns: 1fr;
        }
      }
      mat-card.archived {
        opacity: 0.6;
      }
      .project-link {
        text-decoration: none;
        color: inherit;
      }
      .project-link:hover {
        text-decoration: underline;
      }
      .error {
        color: var(--it-priority-critical);
      }
      .archived-badge {
        font-size: 0.75em;
        background: var(--it-surface);
        color: var(--it-status-closed);
        padding: 2px 6px;
        border-radius: var(--it-radius-sm);
        margin-left: 8px;
        text-decoration: none;
        display: inline-block;
        border: 1px solid var(--it-status-closed);
      }
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--it-space-4);
        padding: var(--it-space-6) 0;
        color: var(--it-status-closed);
      }
      .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
      .empty-state p {
        margin: 0;
        font-size: 1.1em;
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
  @ViewChild('createForm') private readonly createFormEl?: ElementRef<HTMLElement>;

  private readonly api = inject(ApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notification = inject(NotificationService);

  projects: Project[] = [];
  loading = true;
  error: string | null = null;
  newProjectName = '';

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

    this.api.createProject(name).subscribe({
      next: () => {
        this.newProjectName = '';
        this.notification.success('Project created');
        this.loadProjects();
      },
      error: (err: HttpErrorResponse) => {
        this.notification.error(err.message ?? 'Failed to create project');
        this.cdr.markForCheck();
      },
    });
  }

  archiveProject(project: Project): void {
    this.api.archiveProject(project.id).subscribe({
      next: () => {
        this.notification.success('Project archived');
        this.loadProjects();
      },
      error: (err: HttpErrorResponse) => {
        this.notification.error(err.message ?? 'Failed to archive project');
        this.cdr.markForCheck();
      },
    });
  }

  scrollToCreate(): void {
    this.createFormEl?.nativeElement.scrollIntoView?.({ behavior: 'smooth' });
  }
}
