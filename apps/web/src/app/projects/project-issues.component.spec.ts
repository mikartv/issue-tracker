import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { of, throwError } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectIssuesComponent } from './project-issues.component';
import { ApiService } from '../api/api.service';
import type { Issue, Project } from '../api/api.service';
import { CreateIssueDialogComponent } from './create-issue-dialog.component';
import { NotificationService } from '../shared/notification.service';

const BASE = 'http://localhost:3000/api/v1';
const PROJECT_ID = 'proj-1';

function makeIssue(overrides: Partial<Issue> = {}): Issue {
  return {
    id: 'i1',
    project_id: PROJECT_ID,
    title: 'Fix bug',
    status: 'open',
    priority: 'high',
    description: null,
    assignee: null,
    created_at: '',
    updated_at: '',
    ...overrides,
  };
}

const mockProject: Project = {
  id: PROJECT_ID,
  name: 'Alpha',
  archived: false,
  created_at: '',
  updated_at: '',
};

describe('ProjectIssuesComponent', () => {
  let fixture: ComponentFixture<ProjectIssuesComponent>;
  let component: ProjectIssuesComponent;
  let httpMock: HttpTestingController;
  let notificationSpy: { success: jest.Mock; error: jest.Mock; info: jest.Mock };

  const mockIssues: Issue[] = [
    makeIssue({ id: 'i1', title: 'Fix bug', status: 'open', priority: 'high' }),
    makeIssue({ id: 'i2', title: 'Add feature', status: 'in_progress', priority: 'medium' }),
    makeIssue({ id: 'i3', title: 'Refactor', status: 'done', priority: 'low' }),
    makeIssue({ id: 'i4', title: 'Close it', status: 'closed', priority: 'critical' }),
  ];

  function flushLoad(issues: Issue[] = mockIssues, project: Project = mockProject): void {
    // Issues and project requests can come in either order; flush both
    const issuesReq = httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}/issues`);
    const projectReq = httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}`);
    issuesReq.flush(issues);
    projectReq.flush(project);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    notificationSpy = { success: jest.fn(), error: jest.fn(), info: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ProjectIssuesComponent, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule, MatDialogModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'projectId' ? PROJECT_ID : null),
              },
            },
          },
        },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectIssuesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ── AC1: four status columns render ─────────────────────────────────────────

  it('AC1: four cdkDropList columns render with correct status labels', () => {
    fixture.detectChanges();
    flushLoad();

    const el: HTMLElement = fixture.nativeElement;
    const columns = el.querySelectorAll('[cdkdroplist]');
    expect(columns.length).toBe(4);

    const text = el.textContent ?? '';
    expect(text).toContain('Open');
    expect(text).toContain('In Progress');
    expect(text).toContain('Done');
    expect(text).toContain('Closed');
  });

  it('AC1: each column shows correct issue count badge', () => {
    fixture.detectChanges();
    flushLoad();

    const badges = fixture.nativeElement.querySelectorAll<HTMLElement>('.count-badge');
    expect(badges.length).toBe(4);
    // one issue per column from mockIssues
    badges.forEach((b) => expect(b.textContent?.trim()).toBe('1'));
  });

  it('AC1: no mat-table element in board view', () => {
    fixture.detectChanges();
    flushLoad();

    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });

  // ── AC2: issue cards with title link and priority chip ───────────────────────

  it('AC2: issue cards render with title link pointing to /issues/:id', () => {
    fixture.detectChanges();
    flushLoad();

    const links = fixture.nativeElement.querySelectorAll<HTMLAnchorElement>('a.issue-link');
    expect(links.length).toBe(mockIssues.length);
    expect(links[0].getAttribute('href')).toBe('/issues/i1');
  });

  it('AC2: each card renders a priority app-chip', () => {
    fixture.detectChanges();
    flushLoad();

    const chips = fixture.nativeElement.querySelectorAll('app-chip');
    // 4 status chips (headers) + 4 priority chips (cards) = 8 minimum
    expect(chips.length).toBeGreaterThanOrEqual(8);
  });

  it('AC2: issue cards are cdkDrag elements', () => {
    fixture.detectChanges();
    flushLoad();

    const cards = fixture.nativeElement.querySelectorAll('.issue-card[cdkdrag]');
    expect(cards.length).toBe(mockIssues.length);
  });

  it('AC2: assignee shown on card when non-null', () => {
    const issuesWithAssignee: Issue[] = [
      makeIssue({ id: 'a1', assignee: 'alice@example.com', status: 'open' }),
    ];
    fixture.detectChanges();
    flushLoad(issuesWithAssignee);

    expect(fixture.nativeElement.textContent).toContain('alice@example.com');
  });

  it('AC2: raw priority key not shown (chip shows label)', () => {
    fixture.detectChanges();
    flushLoad();

    const text: string = fixture.nativeElement.textContent ?? '';
    expect(text).not.toContain('in_progress');
    expect(text).toContain('In Progress');
  });

  // ── AC3: drop to different column calls updateIssueStatus; card stays ────────

  it('AC3: onDrop to different column calls updateIssueStatus with target status', () => {
    const apiService = TestBed.inject(ApiService);
    const updateSpy = jest.spyOn(apiService, 'updateIssueStatus').mockReturnValue(of(
      makeIssue({ id: 'i1', status: 'done' }),
    ));

    fixture.detectChanges();
    flushLoad();

    const issue = makeIssue({ id: 'i1', status: 'open' });
    component.columns['open'] = [issue];
    component.columns['done'] = [];

    const event = {
      previousContainer: { data: component.columns['open'] },
      container: { data: component.columns['done'] },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: issue },
    } as unknown as CdkDragDrop<Issue[]>;

    component.onDrop(event, 'done');
    fixture.detectChanges();

    expect(updateSpy).toHaveBeenCalledWith('i1', 'done');
    expect(component.columns['done']).toContain(issue);
    expect(component.columns['open']).not.toContain(issue);
  });

  it('AC3: drop within same column does not call updateIssueStatus', () => {
    const apiService = TestBed.inject(ApiService);
    const updateSpy = jest.spyOn(apiService, 'updateIssueStatus');

    fixture.detectChanges();
    flushLoad();

    const issue = makeIssue({ id: 'i1', status: 'open' });
    component.columns['open'] = [issue];

    const sameContainer = { data: component.columns['open'] };
    const event = {
      previousContainer: sameContainer,
      container: sameContainer,
      previousIndex: 0,
      currentIndex: 0,
      item: { data: issue },
    } as unknown as CdkDragDrop<Issue[]>;

    component.onDrop(event, 'open');
    expect(updateSpy).not.toHaveBeenCalled();
  });

  // ── AC4: failed move reverts card to origin column ───────────────────────────

  it('AC4: on updateIssueStatus error, card reverts to origin column', () => {
    const apiService = TestBed.inject(ApiService);
    jest.spyOn(apiService, 'updateIssueStatus').mockReturnValue(
      throwError(() => new Error('Server error')),
    );

    fixture.detectChanges();
    flushLoad();

    const issue = makeIssue({ id: 'i1', status: 'open' });
    component.columns['open'] = [issue];
    component.columns['done'] = [];

    const prevContainer = { data: component.columns['open'] };
    const nextContainer = { data: component.columns['done'] };
    const event = {
      previousContainer: prevContainer,
      container: nextContainer,
      previousIndex: 0,
      currentIndex: 0,
      item: { data: issue },
    } as unknown as CdkDragDrop<Issue[]>;

    component.onDrop(event, 'done');
    fixture.detectChanges();

    expect(component.columns['open']).toContain(issue);
    expect(component.columns['done']).not.toContain(issue);
  });

  it('AC4: on updateIssueStatus error, notification.error is called with failure message', () => {
    const apiService = TestBed.inject(ApiService);
    jest.spyOn(apiService, 'updateIssueStatus').mockReturnValue(
      throwError(() => new Error('Server error')),
    );

    fixture.detectChanges();
    flushLoad();

    const issue = makeIssue({ id: 'i1', status: 'open' });
    component.columns['open'] = [issue];
    component.columns['done'] = [];

    const prevContainer = { data: component.columns['open'] };
    const nextContainer = { data: component.columns['done'] };
    const event = {
      previousContainer: prevContainer,
      container: nextContainer,
      previousIndex: 0,
      currentIndex: 0,
      item: { data: issue },
    } as unknown as CdkDragDrop<Issue[]>;

    component.onDrop(event, 'done');
    fixture.detectChanges();

    expect(notificationSpy.error).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.drop-error')).toBeNull();
  });

  // ── AC5: getProject called; heading shows project name ───────────────────────

  it('AC5: getProject called with correct project id', () => {
    const apiService = TestBed.inject(ApiService);
    const getProjectSpy = jest.spyOn(apiService, 'getProject').mockReturnValue(of(mockProject));
    jest.spyOn(apiService, 'getIssues').mockReturnValue(of(mockIssues));

    fixture.detectChanges();

    expect(getProjectSpy).toHaveBeenCalledWith(PROJECT_ID);
    expect(getProjectSpy).not.toHaveBeenCalledWith(expect.not.stringContaining(PROJECT_ID));
  });

  it('AC5: heading shows "Issues — <project name>" after getProject resolves', () => {
    const apiService = TestBed.inject(ApiService);
    jest.spyOn(apiService, 'getProject').mockReturnValue(of(mockProject));
    jest.spyOn(apiService, 'getIssues').mockReturnValue(of(mockIssues));

    fixture.detectChanges();
    fixture.detectChanges();

    const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
    expect(h2?.textContent?.trim()).toBe('Issues — Alpha');
  });

  it('AC5: heading shows "Issues" fallback while loading', () => {
    // Before any data loads
    fixture.detectChanges();
    // Flush only issues to simulate project still pending; but heading should show "Issues" until project name resolves
    // In the fresh state: projectName is '' so heading is "Issues"
    const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
    expect(h2?.textContent?.trim()).toBe('Issues');

    // Clean up pending requests
    httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}/issues`).flush([]);
    httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}`).flush(mockProject);
  });

  it('AC5: getProject uses GET /projects/:id (single project endpoint, not list)', () => {
    fixture.detectChanges();
    // Verify project endpoint is /projects/:id not /projects
    const projectReq = httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}`);
    expect(projectReq.request.method).toBe('GET');
    expect(projectReq.request.url).toContain(`/projects/${PROJECT_ID}`);
    expect(projectReq.request.url).not.toMatch(/\/projects$/);
    projectReq.flush(mockProject);

    httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}/issues`).flush(mockIssues);
    fixture.detectChanges();
  });

  // ── Existing tests: loads / error ────────────────────────────────────────────

  it('loads issues and distributes into columns', () => {
    fixture.detectChanges();
    flushLoad();

    expect(component.columns['open'].length).toBe(1);
    expect(component.columns['in_progress'].length).toBe(1);
    expect(component.columns['done'].length).toBe(1);
    expect(component.columns['closed'].length).toBe(1);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('shows error state when GET issues fails', () => {
    fixture.detectChanges();
    httpMock
      .expectOne(`${BASE}/projects/${PROJECT_ID}/issues`)
      .flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}`).flush(mockProject);
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.error).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.error')).not.toBeNull();
  });

  // ── AC1 (dialog): No inline create form; "New Issue" button present ──────────

  it('AC1: no create-form inputs rendered inline after load', () => {
    fixture.detectChanges();
    flushLoad();

    const el: HTMLElement = fixture.nativeElement;
    // create-section is gone; no create-section div
    expect(el.querySelector('.create-section')).toBeNull();
    // No mat-input create fields on parent (dialog owns them)
    const inputs = Array.from(el.querySelectorAll<HTMLInputElement>('input[matinput]'));
    expect(inputs.length).toBe(0);
  });

  it('AC1: "New Issue" button is present after load', () => {
    fixture.detectChanges();
    flushLoad();

    const el: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    const newIssueBtn = buttons.find((b) => b.textContent?.includes('New Issue'));
    expect(newIssueBtn).toBeDefined();
  });

  // ── AC2 (dialog): Clicking "New Issue" opens MatDialog ──────────────────────

  it('AC2: clicking "New Issue" button calls MatDialog.open with CreateIssueDialogComponent', () => {
    fixture.detectChanges();
    flushLoad();

    const openSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue({
      afterClosed: () => of(undefined),
    } as any);

    component.openNewIssueDialog();

    expect(openSpy).toHaveBeenCalledWith(
      CreateIssueDialogComponent,
      expect.objectContaining({ data: expect.objectContaining({ projectId: PROJECT_ID }) }),
    );
  });

  it('AC2: "New Issue" button is enabled and calls openNewIssueDialog on click', () => {
    fixture.detectChanges();
    flushLoad();

    const openSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue({
      afterClosed: () => of(undefined),
    } as any);

    const el: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    const newIssueBtn = buttons.find((b) => b.textContent?.includes('New Issue'));
    expect(newIssueBtn).toBeDefined();
    expect(newIssueBtn!.disabled).toBe(false);
    newIssueBtn!.click();
    fixture.detectChanges();

    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it('AC2: after dialog closes with result, loadIssues is called again', () => {
    const apiService = TestBed.inject(ApiService);
    const newIssue = makeIssue({ id: 'i99', title: 'New' });
    const getIssuesSpy = jest.spyOn(apiService, 'getIssues').mockReturnValue(of([]));
    jest.spyOn(apiService, 'getProject').mockReturnValue(of(mockProject));

    fixture.detectChanges();
    // With spies, no HTTP requests go out — all resolved via spies
    fixture.detectChanges();

    jest.spyOn(component['dialog'], 'open').mockReturnValue({
      afterClosed: () => of(newIssue),
    } as any);

    component.openNewIssueDialog();

    // getIssues called again after dialog close with result
    expect(getIssuesSpy).toHaveBeenCalledTimes(2); // once on init, once on dialog close
  });
});
