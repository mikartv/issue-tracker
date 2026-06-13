import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import type { Issue, Project } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProjects() calls GET http://localhost:3000/api/v1/projects', () => {
    const mockProjects: Project[] = [
      {
        id: 'proj-1',
        name: 'Test Project',
        archived: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    service.getProjects().subscribe((projects) => {
      expect(projects).toEqual(mockProjects);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/projects');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });

  it('getIssues() calls GET /api/v1/projects/:projectId/issues', () => {
    const projectId = 'proj-123';
    const mockIssues: Issue[] = [
      {
        id: 'issue-1',
        project_id: projectId,
        title: 'Test Issue',
        description: null,
        status: 'open',
        priority: 'medium',
        assignee: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    service.getIssues(projectId).subscribe((issues) => {
      expect(issues).toEqual(mockIssues);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/v1/projects/${projectId}/issues`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockIssues);
  });

  it('getIssue() calls GET /api/v1/issues/:issueId', () => {
    const issueId = 'issue-abc';
    const mockIssue: Issue = {
      id: issueId,
      project_id: 'proj-1',
      title: 'Test Issue',
      description: 'Some description',
      status: 'in_progress',
      priority: 'high',
      assignee: 'dev@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    service.getIssue(issueId).subscribe((issue) => {
      expect(issue).toEqual(mockIssue);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/v1/issues/${issueId}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockIssue);
  });
});
