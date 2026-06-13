import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
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
      imports: [ProjectIssuesComponent, HttpClientTestingModule, NoopAnimationsModule],
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
});
