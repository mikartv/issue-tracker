import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: string;
  name: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'open' | 'in_progress' | 'done' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  issue_id: string;
  author: string;
  body: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/projects`);
  }

  createProject(name: string): Observable<Project> {
    return this.http.post<Project>(`${this.base}/projects`, { name });
  }

  archiveProject(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/projects/${id}/archive`, {});
  }

  getIssues(projectId: string): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.base}/projects/${projectId}/issues`);
  }

  getIssue(issueId: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.base}/issues/${issueId}`);
  }

  getComments(issueId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.base}/issues/${issueId}/comments`);
  }

  addComment(issueId: string, body: string, userEmail?: string): Observable<Comment> {
    const options = userEmail
      ? { headers: new HttpHeaders({ 'X-User-Email': userEmail }) }
      : {};
    return this.http.post<Comment>(`${this.base}/issues/${issueId}/comments`, { body }, options);
  }

  updateIssueStatus(issueId: string, status: string): Observable<Issue> {
    return this.http.post<Issue>(`${this.base}/issues/${issueId}/status`, { status });
  }

  createIssue(
    projectId: string,
    dto: { title: string; description?: string; priority?: string; assignee?: string },
  ): Observable<Issue> {
    return this.http.post<Issue>(`${this.base}/projects/${projectId}/issues`, dto);
  }

  updateIssue(
    issueId: string,
    dto: { title?: string; description?: string; priority?: string; assignee?: string },
  ): Observable<Issue> {
    return this.http.patch<Issue>(`${this.base}/issues/${issueId}`, dto);
  }
}
