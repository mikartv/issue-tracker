import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule],
  template: `
    <mat-toolbar style="background: var(--it-surface); box-shadow: var(--it-shadow-1);">
      <a routerLink="/projects" style="text-decoration: none; color: inherit; font-weight: 600;">Issue Tracker</a>
    </mat-toolbar>
    <div class="app-content">
      <router-outlet />
    </div>
  `,
  styles: [`
    .app-content {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 var(--it-space-4);
    }
  `],
})
export class AppComponent {
  readonly title = 'issue-tracker';
}
