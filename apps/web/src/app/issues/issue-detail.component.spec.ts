import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { IssueDetailComponent } from './issue-detail.component';
import { ApiService, type Issue, type Comment } from '../api/api.service';

const ISSUE_ID = 'issue-1';
const PROJECT_ID = 'proj-1';

const mockIssue: Issue = {
  id: ISSUE_ID,
  project_id: PROJECT_ID,
  title: 'Test Issue Title',
  description: 'A description',
  status: 'open',
  priority: 'high',
  assignee: 'dev@example.com',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-02T00:00:00Z',
};

const mockComments: Comment[] = [
  {
    id: 'c1',
    issue_id: ISSUE_ID,
    author: 'alice@example.com',
    body: 'First comment',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'c2',
    issue_id: ISSUE_ID,
    author: 'bob@example.com',
    body: 'Second comment',
    created_at: '2024-01-02T00:00:00Z',
  },
];

const mockRoute = {
  snapshot: {
    paramMap: {
      get: (key: string) => (key === 'issueId' ? ISSUE_ID : null),
    },
  },
};

type ApiMock = {
  getIssue: jest.Mock;
  getComments: jest.Mock;
  addComment: jest.Mock;
  updateIssueStatus: jest.Mock;
  updateIssue: jest.Mock;
};

function buildApiMock(issueOverride?: Partial<Issue>): ApiMock {
  return {
    getIssue: jest.fn().mockReturnValue(of({ ...mockIssue, ...issueOverride })),
    getComments: jest.fn().mockReturnValue(of(mockComments)),
    addComment: jest.fn().mockReturnValue(of(mockComments[0])),
    updateIssueStatus: jest.fn().mockReturnValue(of(mockIssue)),
    updateIssue: jest.fn().mockReturnValue(of(mockIssue)),
  };
}

describe('IssueDetailComponent', () => {
  let fixture: ComponentFixture<IssueDetailComponent>;
  let component: IssueDetailComponent;
  let apiMock: ApiMock;

  beforeEach(() => {
    localStorage.clear();
    apiMock = buildApiMock();
  });

  async function setup(mock: ApiMock = apiMock): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [IssueDetailComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useValue: mock },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IssueDetailComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('AC1: displays title, status, and project link', async () => {
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain(mockIssue.title);
    expect(el.textContent).toContain('Open');

    const link = el.querySelector<HTMLAnchorElement>('a[href*="' + PROJECT_ID + '"]');
    expect(link).not.toBeNull();
  });

  it('AC2a: shows "Move to In Progress" button when status is open', async () => {
    await setup(buildApiMock({ status: 'open' }));
    fixture.detectChanges();
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button'),
    );
    const statusBtn = buttons.find((b) => b.textContent?.includes('Move to'));
    expect(statusBtn).toBeDefined();
    expect(statusBtn!.textContent).toContain('In Progress');
  });

  it('AC2b: no "Move to" button when status is closed', async () => {
    await setup(buildApiMock({ status: 'closed' }));
    fixture.detectChanges();
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button'),
    );
    const statusBtn = buttons.find((b) => b.textContent?.includes('Move to'));
    expect(statusBtn == null || statusBtn.disabled).toBe(true);
  });

  it('AC3: renders two comments and calls addComment on submit', async () => {
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.comment-item');
    expect(items.length).toBe(2);

    component.commentBody = 'Hello world';
    component.submitComment();
    expect(apiMock.addComment).toHaveBeenCalledTimes(1);
    expect(apiMock.addComment).toHaveBeenCalledWith(ISSUE_ID, 'Hello world', undefined);
  });

  it('AC4: passes localStorage email as third argument to addComment', async () => {
    localStorage.setItem('userEmail', 'tester@example.com');
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    component.commentBody = 'Test body';
    component.submitComment();
    expect(apiMock.addComment).toHaveBeenCalledWith(ISSUE_ID, 'Test body', 'tester@example.com');
  });

  it('AC6: shows "Issue not found" on 404 error', async () => {
    const notFoundMock: ApiMock = {
      getIssue: jest
        .fn()
        .mockReturnValue(
          throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' })),
        ),
      getComments: jest.fn().mockReturnValue(of([])),
      addComment: jest.fn(),
      updateIssueStatus: jest.fn(),
      updateIssue: jest.fn(),
    };

    await setup(notFoundMock);
    fixture.detectChanges();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Issue not found');
  });

  it('AC2a: edit button present in view mode; clicking it renders edit form fields', async () => {
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    const editBtn = buttons.find((b) => b.textContent?.trim() === 'Edit');
    expect(editBtn).toBeDefined();

    editBtn!.click();
    fixture.detectChanges();

    const matFields = el.querySelectorAll('mat-form-field');
    expect(matFields.length).toBeGreaterThan(0);
  });

  it('AC2b: fill title and click save — updateIssue is called with new title', async () => {
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    component.enterEditMode();
    component.editTitle = 'Updated Title';
    fixture.detectChanges();

    component.saveEdit();

    expect(apiMock.updateIssue).toHaveBeenCalledWith(
      ISSUE_ID,
      expect.objectContaining({ title: 'Updated Title' }),
    );
  });

  it('AC4: save button is disabled when edit title is empty', async () => {
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    component.enterEditMode();
    component.editTitle = '';
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    const saveBtn = buttons.find((b) => b.textContent?.trim() === 'Save');
    expect(saveBtn?.disabled).toBe(true);
  });

  it('AC6: edit — success message appears in view mode after successful save', async () => {
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    component.enterEditMode();
    component.editTitle = 'New Title';
    fixture.detectChanges();

    component.saveEdit();
    fixture.detectChanges();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Issue saved');
  });

  it('label-AC1: status in_progress renders as "In Progress" via chip (not raw key)', async () => {
    await setup(buildApiMock({ status: 'in_progress' }));
    fixture.detectChanges();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    // Status chip is always visible in the sidebar
    const sidebar = el.querySelector('.detail-sidebar');
    expect(sidebar).not.toBeNull();
    const chips = sidebar!.querySelectorAll('app-chip');
    expect(chips.length).toBeGreaterThan(0);
    const statusChip = Array.from(chips).find((c) => c.textContent?.includes('In Progress'));
    expect(statusChip).not.toBeUndefined();
    expect(sidebar!.textContent).not.toContain('in_progress');
  });

  it('label-AC2: priority critical renders as "Critical" via chip (not raw key)', async () => {
    await setup(buildApiMock({ priority: 'critical' }));
    fixture.detectChanges();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const sidebar = el.querySelector('.detail-sidebar');
    expect(sidebar).not.toBeNull();
    const chips = sidebar!.querySelectorAll('app-chip');
    expect(chips.length).toBeGreaterThan(0);
    const priorityChip = Array.from(chips).find((c) => c.textContent?.includes('Critical'));
    expect(priorityChip).not.toBeUndefined();
    expect(sidebar!.textContent).not.toContain('critical');
  });

  it('label-AC3: Move to button reads "Move to In Progress" when status is open', async () => {
    await setup(buildApiMock({ status: 'open' }));
    fixture.detectChanges();
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button'),
    );
    const statusBtn = buttons.find((b) => b.textContent?.includes('Move to'));
    expect(statusBtn).toBeDefined();
    expect(statusBtn!.textContent).toContain('Move to In Progress');
    expect(statusBtn!.textContent).not.toContain('in_progress');
  });

  // ============================================================
  // New tests for gh #12 ACs
  // ============================================================

  it('gh12-AC1: sidebar card is present with status and priority chips', async () => {
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const sidebar = el.querySelector('.detail-sidebar');
    expect(sidebar).not.toBeNull();

    const chips = sidebar!.querySelectorAll('app-chip');
    expect(chips.length).toBeGreaterThanOrEqual(2);

    // Flat <p> stack with Status:/Priority: labels must not appear at root level
    const rootParagraphs = Array.from(el.querySelectorAll<HTMLElement>('.detail-main > p')).filter(
      (p) => p.textContent?.includes('Status:') || p.textContent?.includes('Priority:'),
    );
    expect(rootParagraphs.length).toBe(0);
  });

  it('gh12-AC2: comment section stays visible when editMode is active', async () => {
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    // Enter edit mode
    component.enterEditMode();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    // Comment items should still be visible
    const commentItems = el.querySelectorAll('.comment-item');
    expect(commentItems.length).toBe(2);

    // Comments section should be present
    const commentsSection = el.querySelector('.comments-section');
    expect(commentsSection).not.toBeNull();
  });

  it('gh12-AC3: inline edit keeps issue context visible; cancel makes no API call', async () => {
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    component.enterEditMode();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    // Status chip should remain visible in sidebar during edit
    const sidebar = el.querySelector('.detail-sidebar');
    expect(sidebar).not.toBeNull();
    const statusChip = sidebar!.querySelector('app-chip');
    expect(statusChip).not.toBeNull();

    // Cancel should make no API call
    component.cancelEdit();
    expect(apiMock.updateIssue).not.toHaveBeenCalled();
    expect(component.editMode).toBe(false);
  });

  it('gh12-AC4: comment thread renders avatar, author, timestamp, and body; no <li> items', async () => {
    await setup();
    fixture.detectChanges();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const commentItems = el.querySelectorAll('.comment-item');
    expect(commentItems.length).toBe(2);

    const firstItem = commentItems[0];
    expect(firstItem.querySelector('.comment-avatar')).not.toBeNull();
    expect(firstItem.querySelector('.comment-author')).not.toBeNull();
    expect(firstItem.querySelector('.comment-timestamp')).not.toBeNull();
    expect(firstItem.querySelector('.comment-body')).not.toBeNull();

    // Avatar should show initials (first letter of local-part of email)
    const avatar = firstItem.querySelector('.comment-avatar');
    expect(avatar!.textContent?.trim()).toBe('A'); // alice@example.com → 'A'

    // No <li> elements used for comment items
    const liItems = el.querySelectorAll('li.comment-item');
    expect(liItems.length).toBe(0);
  });
});
