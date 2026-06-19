import type { Routes } from '@angular/router';
import { ProjectsListComponent } from './projects/projects-list.component';
import { ProjectIssuesComponent } from './projects/project-issues.component';
import { IssueDetailComponent } from './issues/issue-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectsListComponent },
  { path: 'projects/:projectId/issues', component: ProjectIssuesComponent },
  { path: 'issues/:issueId', component: IssueDetailComponent },
];
