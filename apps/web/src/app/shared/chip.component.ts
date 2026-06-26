import { Component, Input } from '@angular/core';
import { STATUS_LABELS, PRIORITY_LABELS } from './issue-labels';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [],
  template: `<span class="chip" [style.background-color]="colorVar">{{ label }}</span>`,
  styles: [
    `
      :host {
        display: inline;
      }
      .chip {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.85em;
        color: #fff;
        font-weight: 500;
      }
    `,
  ],
})
export class ChipComponent {
  @Input() kind: 'status' | 'priority' = 'status';
  @Input() value = '';

  get label(): string {
    const map = this.kind === 'status' ? STATUS_LABELS : PRIORITY_LABELS;
    return map[this.value] ?? this.value;
  }

  get colorVar(): string {
    if (!this.value) return '';
    const key = this.value.replace(/_/g, '-');
    const prefix = this.kind === 'status' ? '--it-status-' : '--it-priority-';
    return `var(${prefix}${key})`;
  }
}
