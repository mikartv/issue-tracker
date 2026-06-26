import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectIssuesComponent } from './project-issues.component';
import type { Issue } from '../api/api.service';

const BASE = 'http://localhost:3000/api/v1';
const PROJECT_ID = 'proj-1';

describe('ProjectIssuesComponent', () => {
  let fixture: ComponentFixture<ProjectIssuesComponent>;
  let component: ProjectIssuesComponent;
  let httpMock: HttpTestingController;

  const mockIssues: Issue[] = [
    {
      id: 'i1',
      project_id: PROJECT_ID,
      title: 'Fix bug',
      status: 'open',
      priority: 'high',
      description: null,
      assignee: null,
      created_at: '',
      updated_at: '',
    },
    {
      id: 'i2',
      project_id: PROJECT_ID,
      title: 'Add feature',
      status: 'in_progress',
      priority: 'medium',
      description: null,
      assignee: null,
      created_at: '',
      updated_at: '',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectIssuesComponent, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule],
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectIssuesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads and renders issues table', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}/issues`).flush(mockIssues);
    fixture.detectChanges();

    expect(component.issues).toEqual(mockIssues);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('shows error state when GET issues fails', () => {
    fixture.detectChanges();
    httpMock
      .expectOne(`${BASE}/projects/${PROJECT_ID}/issues`)
      .flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.error).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.error')).not.toBeNull();
  });

  it('AC1: create form fields for title, description, priority, assignee are present in DOM after issues load', () => {
    fixture.detectChanges();
    httpMock.expectOne({ url: `${BASE}/projects/${PROJECT_ID}/issues`, method: 'GET' }).flush(mockIssues);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const matFields = el.querySelectorAll('mat-form-field');
    expect(matFields.length).toBeGreaterThanOrEqual(4);
  });

  it('AC3: 409 on createIssue shows archived message and submit button is disabled', () => {
    fixture.detectChanges();
    httpMock.expectOne({ url: `${BASE}/projects/${PROJECT_ID}/issues`, method: 'GET' }).flush(mockIssues);
    fixture.detectChanges();

    component.newTitle = 'New Issue';
    fixture.detectChanges();

    component.submitCreate();

    httpMock
      .expectOne({ url: `${BASE}/projects/${PROJECT_ID}/issues`, method: 'POST' })
      .flush({}, { status: 409, statusText: 'Conflict' });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('archived');

    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    const createBtn = buttons.find((b) => b.textContent?.includes('Create Issue'));
    expect(createBtn?.disabled).toBe(true);
  });

  it('AC4: Create Issue button is disabled when title is empty', () => {
    fixture.detectChanges();
    httpMock.expectOne({ url: `${BASE}/projects/${PROJECT_ID}/issues`, method: 'GET' }).flush(mockIssues);
    fixture.detectChanges();

    // newTitle is '' by default
    expect(component.newTitle.trim()).toBe('');

    const el: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
    const createBtn = buttons.find((b) => b.textContent?.includes('Create Issue'));
    expect(createBtn?.disabled).toBe(true);
  });

  it('AC2: issue title links have routerLink to /issues/:id', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}/issues`).flush(mockIssues);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll<HTMLAnchorElement>('a.issue-link');
    expect(links.length).toBe(mockIssues.length);
    expect(links[0].getAttribute('href')).toBe('/issues/i1');
    expect(links[1].getAttribute('href')).toBe('/issues/i2');
  });

  it('AC4: shows "No issues yet." when issue list is empty', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}/issues`).flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No issues yet.');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });

  it('AC5: status and priority display as human-readable labels via chip components', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}/issues`).flush(mockIssues);
    fixture.detectChanges();

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('In Progress');
    expect(text).toContain('High');
    expect(text).toContain('Medium');
    expect(text).not.toContain('in_progress');

    const chips = fixture.nativeElement.querySelectorAll('app-chip');
    expect(chips.length).toBeGreaterThanOrEqual(mockIssues.length * 2);
  });

  it('AC6 inline create error: non-409 submit failure shows createError inline without replacing table', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects/${PROJECT_ID}/issues`).flush(mockIssues);
    fixture.detectChanges();

    component.newTitle = 'New Issue';
    fixture.detectChanges();
    component.submitCreate();

    httpMock
      .expectOne({ url: `${BASE}/projects/${PROJECT_ID}/issues`, method: 'POST' })
      .flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    expect(component.createError).toBeTruthy();
    expect(component.error).toBeNull();
    const table = fixture.nativeElement.querySelector('table');
    expect(table).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.create-error')).not.toBeNull();
  });

  it('AC6: success message appears in DOM after successful createIssue', () => {
    fixture.detectChanges();
    httpMock.expectOne({ url: `${BASE}/projects/${PROJECT_ID}/issues`, method: 'GET' }).flush(mockIssues);
    fixture.detectChanges();

    component.newTitle = 'New Issue';
    fixture.detectChanges();

    component.submitCreate();

    const newIssue: Issue = {
      id: 'i3',
      project_id: PROJECT_ID,
      title: 'New Issue',
      status: 'open',
      priority: 'medium',
      description: null,
      assignee: null,
      created_at: '',
      updated_at: '',
    };
    httpMock
      .expectOne({ url: `${BASE}/projects/${PROJECT_ID}/issues`, method: 'POST' })
      .flush(newIssue);

    // Flush the reload GET
    httpMock
      .expectOne({ url: `${BASE}/projects/${PROJECT_ID}/issues`, method: 'GET' })
      .flush([...mockIssues, newIssue]);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Issue created');
  });
});
