import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <p>Loading issue…</p>
    } @else if (error) {
      <p class="error">Error: {{ error }}</p>
    } @else {
      <p>Issue detail — coming in cycle 9</p>
    }
  `,
})
export class IssueDetailComponent {
  loading = true;
  error: string | null = null;
}
