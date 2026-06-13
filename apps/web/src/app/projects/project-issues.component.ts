import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-project-issues',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <p>Loading issues…</p>
    } @else if (error) {
      <p class="error">Error: {{ error }}</p>
    } @else {
      <p>Project issues — coming in cycle 8</p>
    }
  `,
})
export class ProjectIssuesComponent {
  loading = true;
  error: string | null = null;
}
