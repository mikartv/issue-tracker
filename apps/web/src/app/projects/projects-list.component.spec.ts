import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectsListComponent } from './projects-list.component';
import type { Project } from '../api/api.service';
import { NotificationService } from '../shared/notification.service';

const BASE = 'http://localhost:3000/api/v1';

describe('ProjectsListComponent', () => {
  let fixture: ComponentFixture<ProjectsListComponent>;
  let component: ProjectsListComponent;
  let httpMock: HttpTestingController;
  let notificationSpy: { success: jest.Mock; error: jest.Mock; info: jest.Mock };

  const mockProjects: Project[] = [
    { id: '1', name: 'Alpha', archived: false, created_at: '', updated_at: '' },
    { id: '2', name: 'Beta', archived: true, created_at: '', updated_at: '' },
  ];

  beforeEach(async () => {
    notificationSpy = { success: jest.fn(), error: jest.fn(), info: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ProjectsListComponent, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads and renders project list', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects`).flush(mockProjects);
    fixture.detectChanges();

    expect(component.projects).toEqual(mockProjects);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('shows error state when GET projects fails', () => {
    fixture.detectChanges();
    httpMock
      .expectOne(`${BASE}/projects`)
      .flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.error).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.error')).not.toBeNull();
  });

  it('creates a project and reloads the list', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects`).flush(mockProjects);
    fixture.detectChanges();

    component.newProjectName = 'Gamma';
    component.createProject();

    const postReq = httpMock.expectOne(`${BASE}/projects`);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual({ name: 'Gamma' });
    const newProject: Project = { id: '3', name: 'Gamma', archived: false, created_at: '', updated_at: '' };
    postReq.flush(newProject);

    httpMock.expectOne(`${BASE}/projects`).flush([...mockProjects, newProject]);
    fixture.detectChanges();

    expect(component.newProjectName).toBe('');
    expect(component.projects.length).toBe(3);
  });

  it('AC1: project name links have routerLink to /projects/:id/issues', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects`).flush(mockProjects);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll<HTMLAnchorElement>('a.project-link');
    expect(links.length).toBe(mockProjects.length);
    expect(links[0].getAttribute('href')).toBe('/projects/1/issues');
    expect(links[1].getAttribute('href')).toBe('/projects/2/issues');
  });

  it('AC1: renders mat-card elements and no mat-table when projects exist', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects`).flush(mockProjects);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('mat-card').length).toBe(mockProjects.length);
    expect(fixture.nativeElement.querySelector('table[mat-table]')).toBeNull();
  });

  it('AC2: shows designed empty state with icon and CTA when project list is empty', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects`).flush([]);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('No projects yet');
    expect(fixture.nativeElement.querySelector('.empty-state mat-icon')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.empty-state button')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });

  it('AC1-notification: createProject success calls notification.success', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects`).flush(mockProjects);
    fixture.detectChanges();

    component.newProjectName = 'Gamma';
    component.createProject();

    httpMock.expectOne(`${BASE}/projects`).flush(
      { id: '3', name: 'Gamma', archived: false, created_at: '', updated_at: '' },
    );
    // reload after create
    httpMock.expectOne(`${BASE}/projects`).flush(mockProjects);
    fixture.detectChanges();

    expect(notificationSpy.success).toHaveBeenCalledWith('Project created');
  });

  it('AC1-notification: createProject error calls notification.error', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects`).flush(mockProjects);
    fixture.detectChanges();

    component.newProjectName = 'Gamma';
    component.createProject();

    httpMock
      .expectOne(`${BASE}/projects`)
      .flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    fixture.detectChanges();

    expect(notificationSpy.error).toHaveBeenCalled();
  });

  it('AC1-notification: archiveProject error calls notification.error', () => {
    fixture.detectChanges();
    httpMock.expectOne(`${BASE}/projects`).flush(mockProjects);
    fixture.detectChanges();

    component.archiveProject(mockProjects[0]);

    httpMock
      .expectOne(`${BASE}/projects/1/archive`)
      .flush({ message: 'Already archived' }, { status: 409, statusText: 'Conflict' });
    fixture.detectChanges();

    expect(notificationSpy.error).toHaveBeenCalled();
  });
});
