import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import supertest from 'supertest';
import { DataSource } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Issue, IssueStatus } from '../entities/issue.entity';
import { Project } from '../entities/project.entity';
import { InitialSchema20260610000000 } from '../migrations/20260610000000-InitialSchema';
import { IssuesModule } from './issues.module';
import { ProjectsModule } from '../projects/projects.module';

describe('Issues E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env['DATABASE_URL'],
          entities: [Project, Issue, Comment],
          migrations: [InitialSchema20260610000000],
          synchronize: false,
          migrationsRun: true,
          logging: false,
        }),
        ProjectsModule,
        IssuesModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
    dataSource = moduleRef.get(DataSource);
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.getRepository(Project).createQueryBuilder().delete().execute();
    }
    await app?.close();
  });

  afterEach(async () => {
    await dataSource.getRepository(Project).createQueryBuilder().delete().execute();
  });

  async function createProject(name = 'Test Project'): Promise<{ id: string }> {
    const res = await supertest(app.getHttpServer())
      .post('/api/v1/projects')
      .send({ name })
      .expect(201);
    return res.body as { id: string };
  }

  async function archiveProject(id: string): Promise<void> {
    await supertest(app.getHttpServer())
      .post(`/api/v1/projects/${id}/archive`)
      .expect(200);
  }

  async function createIssue(
    projectId: string,
    body: object = { title: 'Bug report' },
  ): Promise<{ id: string; status: string; priority: string }> {
    const res = await supertest(app.getHttpServer())
      .post(`/api/v1/projects/${projectId}/issues`)
      .send(body)
      .expect(201);
    return res.body as { id: string; status: string; priority: string };
  }

  describe('POST /api/v1/projects/:projectId/issues', () => {
    it('201 — creates issue with status=open and priority=medium by default', async () => {
      const project = await createProject();
      const res = await supertest(app.getHttpServer())
        .post(`/api/v1/projects/${project.id}/issues`)
        .send({ title: 'First issue' })
        .expect(201);

      expect(res.body).toMatchObject({
        title: 'First issue',
        status: IssueStatus.OPEN,
        priority: 'medium',
        project_id: project.id,
      });
      expect(typeof res.body.id).toBe('string');
      expect(res.body.created_at).toBeDefined();
    });

    it('201 — accepts optional fields (description, priority, assignee)', async () => {
      const project = await createProject();
      const res = await supertest(app.getHttpServer())
        .post(`/api/v1/projects/${project.id}/issues`)
        .send({
          title: 'Full issue',
          description: 'Desc text',
          priority: 'high',
          assignee: 'dev@example.com',
        })
        .expect(201);

      expect(res.body).toMatchObject({
        title: 'Full issue',
        description: 'Desc text',
        priority: 'high',
        assignee: 'dev@example.com',
      });
    });

    it('400 — rejects missing title', async () => {
      const project = await createProject();
      await supertest(app.getHttpServer())
        .post(`/api/v1/projects/${project.id}/issues`)
        .send({})
        .expect(400);
    });

    it('400 — rejects empty title', async () => {
      const project = await createProject();
      await supertest(app.getHttpServer())
        .post(`/api/v1/projects/${project.id}/issues`)
        .send({ title: '' })
        .expect(400);
    });

    it('409 — rejects create on archived project', async () => {
      const project = await createProject('Archived Project');
      await archiveProject(project.id);
      await supertest(app.getHttpServer())
        .post(`/api/v1/projects/${project.id}/issues`)
        .send({ title: 'Should fail' })
        .expect(409);
    });

    it('404 — rejects create on non-existent project', async () => {
      await supertest(app.getHttpServer())
        .post('/api/v1/projects/00000000-0000-0000-0000-000000000000/issues')
        .send({ title: 'Should fail' })
        .expect(404);
    });
  });

  describe('GET /api/v1/projects/:projectId/issues', () => {
    it('200 — returns array of issues for project', async () => {
      const project = await createProject();
      await createIssue(project.id, { title: 'Issue 1' });
      await createIssue(project.id, { title: 'Issue 2' });

      const res = await supertest(app.getHttpServer())
        .get(`/api/v1/projects/${project.id}/issues`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
    });

    it('200 — returns empty array for project with no issues', async () => {
      const project = await createProject();
      const res = await supertest(app.getHttpServer())
        .get(`/api/v1/projects/${project.id}/issues`)
        .expect(200);

      expect(res.body).toEqual([]);
    });
  });

  describe('GET /api/v1/issues/:id', () => {
    it('200 — returns issue with project_id', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      const res = await supertest(app.getHttpServer())
        .get(`/api/v1/issues/${issue.id}`)
        .expect(200);

      expect(res.body).toMatchObject({
        id: issue.id,
        project_id: project.id,
        status: IssueStatus.OPEN,
      });
    });

    it('404 — unknown id', async () => {
      await supertest(app.getHttpServer())
        .get('/api/v1/issues/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /api/v1/issues/:id', () => {
    it('200 — updates title, priority, and assignee', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id, { title: 'Original' });

      const res = await supertest(app.getHttpServer())
        .patch(`/api/v1/issues/${issue.id}`)
        .send({ title: 'Updated', priority: 'critical', assignee: 'alice' })
        .expect(200);

      expect(res.body).toMatchObject({
        title: 'Updated',
        priority: 'critical',
        assignee: 'alice',
        status: IssueStatus.OPEN,
      });
    });

    it('400 — rejects body containing status field (whitelist)', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      await supertest(app.getHttpServer())
        .patch(`/api/v1/issues/${issue.id}`)
        .send({ status: 'in_progress' })
        .expect(400);
    });

    it('404 — unknown id', async () => {
      await supertest(app.getHttpServer())
        .patch('/api/v1/issues/00000000-0000-0000-0000-000000000000')
        .send({ title: 'X' })
        .expect(404);
    });
  });

  describe('POST /api/v1/issues/:id/status', () => {
    it('200 — full forward chain: open → in_progress → done → closed', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      const r1 = await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'in_progress' })
        .expect(200);
      expect(r1.body.status).toBe('in_progress');

      const r2 = await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'done' })
        .expect(200);
      expect(r2.body.status).toBe('done');

      const r3 = await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'closed' })
        .expect(200);
      expect(r3.body.status).toBe('closed');
    });

    it('400 — skip: open → done', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'done' })
        .expect(400);
    });

    it('400 — revert: advance to in_progress then try to revert to open', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);
      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'in_progress' })
        .expect(200);

      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'open' })
        .expect(400);
    });

    it('400 — same-status transition', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'open' })
        .expect(400);
    });

    it('400 — transition from closed (terminal)', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);
      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'in_progress' })
        .expect(200);
      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'done' })
        .expect(200);
      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'closed' })
        .expect(200);

      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'open' })
        .expect(400);
    });

    it('400 — invalid status value', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/status`)
        .send({ status: 'invalid_status' })
        .expect(400);
    });

    it('404 — unknown issue id', async () => {
      await supertest(app.getHttpServer())
        .post('/api/v1/issues/00000000-0000-0000-0000-000000000000/status')
        .send({ status: 'in_progress' })
        .expect(404);
    });
  });
});
