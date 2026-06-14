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
};

function buildApiMock(issueOverride?: Partial<Issue>): ApiMock {
  return {
    getIssue: jest.fn().mockReturnValue(of({ ...mockIssue, ...issueOverride })),
    getComments: jest.fn().mockReturnValue(of(mockComments)),
    addComment: jest.fn().mockReturnValue(of(mockComments[0])),
    updateIssueStatus: jest.fn().mockReturnValue(of(mockIssue)),
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
    expect(el.textContent).toContain(mockIssue.status);

    const link = el.querySelector<HTMLAnchorElement>('a[href*="' + PROJECT_ID + '"]');
    expect(link).not.toBeNull();
  });

  it('AC2a: shows "Move to in_progress" button when status is open', async () => {
    await setup(buildApiMock({ status: 'open' }));
    fixture.detectChanges();
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button'),
    );
    const statusBtn = buttons.find((b) => b.textContent?.includes('Move to'));
    expect(statusBtn).toBeDefined();
    expect(statusBtn!.textContent).toContain('in_progress');
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

    const items = fixture.nativeElement.querySelectorAll('li.comment-item');
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
    };

    await setup(notFoundMock);
    fixture.detectChanges();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Issue not found');
  });
});
