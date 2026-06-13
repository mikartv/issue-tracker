import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <p>Loading projects…</p>
    } @else if (error) {
      <p class="error">Error: {{ error }}</p>
    } @else {
      <p>Projects list — coming in cycle 7</p>
    }
  `,
})
export class ProjectsListComponent {
  loading = true;
  error: string | null = null;
}
