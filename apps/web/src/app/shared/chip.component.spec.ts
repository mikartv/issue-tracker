import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipComponent } from './chip.component';

describe('ChipComponent', () => {
  let fixture: ComponentFixture<ChipComponent>;
  let component: ChipComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ChipComponent);
    component = fixture.componentInstance;
  });

  it('renders human label for known status value', () => {
    component.kind = 'status';
    component.value = 'in_progress';
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('.chip') as HTMLElement;
    expect(span.textContent?.trim()).toBe('In Progress');
    expect(span.textContent).not.toContain('in_progress');
  });

  it('sets colorVar to correct CSS var for status', () => {
    component.kind = 'status';
    component.value = 'in_progress';
    fixture.detectChanges();

    expect(component.colorVar).toBe('var(--it-status-in-progress)');

    component.kind = 'priority';
    component.value = 'critical';
    fixture.detectChanges();

    expect(component.colorVar).toBe('var(--it-priority-critical)');
  });

  it('falls back to raw key for unknown value without throwing', () => {
    component.kind = 'status';
    component.value = 'unknown_state';
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('.chip') as HTMLElement;
    expect(span.textContent?.trim()).toBe('unknown_state');
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
