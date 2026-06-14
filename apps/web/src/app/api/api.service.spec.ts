import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import type { Comment, Issue, Project } from './api.service';

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

  it('getComments() calls GET /api/v1/issues/:issueId/comments', () => {
    const issueId = 'issue-1';
    const mockComments: Comment[] = [
      {
        id: 'c1',
        issue_id: issueId,
        author: 'alice@example.com',
        body: 'Hello',
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    service.getComments(issueId).subscribe((comments) => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/v1/issues/${issueId}/comments`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('addComment() calls POST /api/v1/issues/:issueId/comments with body', () => {
    const issueId = 'issue-1';
    const body = 'My comment';
    const mockComment: Comment = {
      id: 'c2',
      issue_id: issueId,
      author: 'anonymous',
      body,
      created_at: '2024-01-01T00:00:00Z',
    };

    service.addComment(issueId, body).subscribe((comment) => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/v1/issues/${issueId}/comments`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ body });
    expect(req.request.headers.has('X-User-Email')).toBe(false);
    req.flush(mockComment);
  });

  it('addComment() sets X-User-Email header when email provided', () => {
    const issueId = 'issue-1';
    const email = 'tester@example.com';
    const mockComment: Comment = {
      id: 'c3',
      issue_id: issueId,
      author: email,
      body: 'With email',
      created_at: '2024-01-01T00:00:00Z',
    };

    service.addComment(issueId, 'With email', email).subscribe();

    const req = httpMock.expectOne(
      `http://localhost:3000/api/v1/issues/${issueId}/comments`,
    );
    expect(req.request.headers.get('X-User-Email')).toBe(email);
    req.flush(mockComment);
  });

  it('addComment() omits X-User-Email header when email not provided', () => {
    const issueId = 'issue-1';
    const mockComment: Comment = {
      id: 'c4',
      issue_id: issueId,
      author: 'anonymous',
      body: 'No email',
      created_at: '2024-01-01T00:00:00Z',
    };

    service.addComment(issueId, 'No email').subscribe();

    const req = httpMock.expectOne(
      `http://localhost:3000/api/v1/issues/${issueId}/comments`,
    );
    expect(req.request.headers.has('X-User-Email')).toBe(false);
    req.flush(mockComment);
  });

  it('updateIssueStatus() calls POST /api/v1/issues/:issueId/status with { status }', () => {
    const issueId = 'issue-1';
    const status = 'in_progress';
    const mockIssue: Issue = {
      id: issueId,
      project_id: 'proj-1',
      title: 'Test Issue',
      description: null,
      status: 'in_progress',
      priority: 'medium',
      assignee: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    service.updateIssueStatus(issueId, status).subscribe((issue) => {
      expect(issue).toEqual(mockIssue);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/v1/issues/${issueId}/status`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ status });
    req.flush(mockIssue);
  });

  it('createIssue() calls POST /api/v1/projects/:projectId/issues with dto; returns Issue', () => {
    const projectId = 'proj-1';
    const dto = { title: 'New Issue', priority: 'medium' };
    const mockIssue: Issue = {
      id: 'issue-new',
      project_id: projectId,
      title: 'New Issue',
      description: null,
      status: 'open',
      priority: 'medium',
      assignee: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    service.createIssue(projectId, dto).subscribe((issue) => {
      expect(issue).toEqual(mockIssue);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/v1/projects/${projectId}/issues`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockIssue);
  });

  it('updateIssue() calls PATCH /api/v1/issues/:issueId with dto; returns Issue', () => {
    const issueId = 'issue-1';
    const dto = { title: 'Updated Title', priority: 'high' };
    const mockIssue: Issue = {
      id: issueId,
      project_id: 'proj-1',
      title: 'Updated Title',
      description: null,
      status: 'open',
      priority: 'high',
      assignee: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    service.updateIssue(issueId, dto).subscribe((issue) => {
      expect(issue).toEqual(mockIssue);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/v1/issues/${issueId}`,
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(dto);
    req.flush(mockIssue);
  });
});
