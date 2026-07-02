import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { CreateIssueDialogComponent } from './create-issue-dialog.component';
import { ApiService } from '../api/api.service';
import type { Issue } from '../api/api.service';
import { NotificationService } from '../shared/notification.service';

const PROJECT_ID = 'proj-1';

function makeIssue(overrides: Partial<Issue> = {}): Issue {
  return {
    id: 'i1',
    project_id: PROJECT_ID,
    title: 'Test Issue',
    status: 'open',
    priority: 'medium',
    description: null,
    assignee: null,
    created_at: '',
    updated_at: '',
    ...overrides,
  };
}

describe('CreateIssueDialogComponent', () => {
  let fixture: ComponentFixture<CreateIssueDialogComponent>;
  let component: CreateIssueDialogComponent;
  let dialogRefSpy: { close: jest.Mock };
  let apiServiceMock: Partial<ApiService>;
  let notificationSpy: { success: jest.Mock; error: jest.Mock; info: jest.Mock };

  beforeEach(async () => {
    dialogRefSpy = { close: jest.fn() };
    apiServiceMock = {
      createIssue: jest.fn(),
    };
    notificationSpy = { success: jest.fn(), error: jest.fn(), info: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CreateIssueDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { projectId: PROJECT_ID } },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateIssueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── AC1-dialog: fields are present ───────────────────────────────────────────

  it('AC1-dialog: dialog renders Title input', () => {
    const el: HTMLElement = fixture.nativeElement;
    const inputs = el.querySelectorAll('input[matinput]');
    // Title and Assignee are text inputs
    expect(inputs.length).toBeGreaterThanOrEqual(1);
    const labels = el.querySelectorAll('mat-label');
    const labelTexts = Array.from(labels).map((l) => l.textContent?.trim());
    expect(labelTexts).toContain('Title *');
  });

  it('AC1-dialog: dialog renders Description textarea', () => {
    const el: HTMLElement = fixture.nativeElement;
    const textarea = el.querySelector('textarea[matinput]');
    expect(textarea).not.toBeNull();
    const labels = el.querySelectorAll('mat-label');
    const labelTexts = Array.from(labels).map((l) => l.textContent?.trim());
    expect(labelTexts).toContain('Description');
  });

  it('AC1-dialog: dialog renders Priority select', () => {
    const el: HTMLElement = fixture.nativeElement;
    const labels = el.querySelectorAll('mat-label');
    const labelTexts = Array.from(labels).map((l) => l.textContent?.trim());
    expect(labelTexts).toContain('Priority');
    const select = el.querySelector('mat-select');
    expect(select).not.toBeNull();
  });

  it('AC1-dialog: dialog renders Assignee input', () => {
    const el: HTMLElement = fixture.nativeElement;
    const labels = el.querySelectorAll('mat-label');
    const labelTexts = Array.from(labels).map((l) => l.textContent?.trim());
    expect(labelTexts).toContain('Assignee');
  });

  // ── AC3: submit with valid title calls createIssue; on success closes ────────

  it('AC3: submit with valid title calls createIssue', () => {
    const newIssue = makeIssue({ id: 'i99', title: 'My Issue' });
    (apiServiceMock.createIssue as jest.Mock).mockReturnValue(of(newIssue));

    component.title = 'My Issue';
    fixture.detectChanges();

    component.submit();

    expect(apiServiceMock.createIssue).toHaveBeenCalledWith(PROJECT_ID, expect.objectContaining({ title: 'My Issue' }));
  });

  it('AC3: on success, dialogRef.close is called with the new issue', () => {
    const newIssue = makeIssue({ id: 'i99', title: 'My Issue' });
    (apiServiceMock.createIssue as jest.Mock).mockReturnValue(of(newIssue));

    component.title = 'My Issue';
    component.submit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(newIssue);
  });

  // ── AC4-cancel: Cancel closes without calling createIssue ────────────────────

  it('AC4-cancel: Cancel click calls dialogRef.close() without calling createIssue', () => {
    const el: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    const cancelBtn = buttons.find((b) => b.textContent?.trim() === 'Cancel');
    expect(cancelBtn).not.toBeUndefined();

    cancelBtn!.click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(/* no args */);
    expect(apiServiceMock.createIssue).not.toHaveBeenCalled();
  });

  it('AC4-cancel: dialogRef.close called with no argument on cancel', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
    expect(dialogRefSpy.close).toHaveBeenCalledWith(/* no args = undefined */);
    // Ensure createIssue was not invoked
    expect(apiServiceMock.createIssue).not.toHaveBeenCalled();
  });

  // ── AC4-archived: 409 response sets archivedError; dialog does NOT close ─────

  it('AC4-archived: 409 response sets archivedError flag', () => {
    (apiServiceMock.createIssue as jest.Mock).mockReturnValue(
      throwError(() => Object.assign(new Error('Conflict'), { status: 409 })),
    );

    component.title = 'Test Title';
    component.submit();
    fixture.detectChanges();

    expect(component.archivedError).toBe(true);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('archived');
  });

  it('AC4-archived: 409 response does NOT close the dialog', () => {
    (apiServiceMock.createIssue as jest.Mock).mockReturnValue(
      throwError(() => Object.assign(new Error('Conflict'), { status: 409 })),
    );

    component.title = 'Test Title';
    component.submit();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('AC4-archived: non-409 error calls notification.error, not archivedError', () => {
    (apiServiceMock.createIssue as jest.Mock).mockReturnValue(
      throwError(() => Object.assign(new Error('Server error'), { status: 500 })),
    );

    component.title = 'Test Title';
    component.submit();
    fixture.detectChanges();

    expect(component.archivedError).toBe(false);
    expect(notificationSpy.error).toHaveBeenCalled();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
