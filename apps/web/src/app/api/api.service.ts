import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/projects`);
  }

  getIssues(projectId: string): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.base}/projects/${projectId}/issues`);
  }

  getIssue(issueId: string): Observable<Issue> {
    return this.http.get<Issue>(`${this.base}/issues/${issueId}`);
  }
}
