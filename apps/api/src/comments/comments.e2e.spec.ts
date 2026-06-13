import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import supertest from 'supertest';
import { DataSource } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Issue } from '../entities/issue.entity';
import { Project } from '../entities/project.entity';
import { InitialSchema20260610000000 } from '../migrations/20260610000000-InitialSchema';
import { ProjectsModule } from '../projects/projects.module';
import { IssuesModule } from '../issues/issues.module';
import { CommentsModule } from './comments.module';
import { UserEmailMiddleware } from '../middleware/user-email.middleware';

describe('Comments E2E', () => {
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
        CommentsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.use((req: any, res: any, next: any) => {
      new UserEmailMiddleware().use(req, res, next);
    });
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

  async function createIssue(projectId: string): Promise<{ id: string }> {
    const res = await supertest(app.getHttpServer())
      .post(`/api/v1/projects/${projectId}/issues`)
      .send({ title: 'Test Issue' })
      .expect(201);
    return res.body as { id: string };
  }

  describe('POST /api/v1/issues/:issueId/comments', () => {
    it('201 — creates comment with author from X-User-Email header (AC1, AC4)', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      const res = await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/comments`)
        .set('X-User-Email', 'alice@example.com')
        .send({ body: 'First comment' })
        .expect(201);

      expect(res.body).toMatchObject({
        issue_id: issue.id,
        author: 'alice@example.com',
        body: 'First comment',
      });
      expect(typeof res.body.id).toBe('string');
      expect(res.body.created_at).toBeDefined();
    });

    it('201 — author is "anonymous" when X-User-Email header is absent (AC4)', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      const res = await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/comments`)
        .send({ body: 'Anonymous comment' })
        .expect(201);

      expect(res.body.author).toBe('anonymous');
    });

    it('400 — rejects missing body field (AC6)', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/comments`)
        .send({})
        .expect(400);
    });

    it('400 — rejects empty body string (AC6)', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/comments`)
        .send({ body: '' })
        .expect(400);
    });

    it('404 — issue does not exist (AC3)', async () => {
      await supertest(app.getHttpServer())
        .post('/api/v1/issues/00000000-0000-0000-0000-000000000000/comments')
        .send({ body: 'Should fail' })
        .expect(404);
    });
  });

  describe('GET /api/v1/issues/:issueId/comments', () => {
    it('200 — returns comments ordered by created_at ASC (AC2)', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/comments`)
        .set('X-User-Email', 'alice@example.com')
        .send({ body: 'First' })
        .expect(201);

      await supertest(app.getHttpServer())
        .post(`/api/v1/issues/${issue.id}/comments`)
        .set('X-User-Email', 'bob@example.com')
        .send({ body: 'Second' })
        .expect(201);

      const res = await supertest(app.getHttpServer())
        .get(`/api/v1/issues/${issue.id}/comments`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].body).toBe('First');
      expect(res.body[1].body).toBe('Second');
      expect(new Date(res.body[0].created_at).getTime()).toBeLessThanOrEqual(
        new Date(res.body[1].created_at).getTime(),
      );
    });

    it('200 — returns empty array when issue has no comments (AC3)', async () => {
      const project = await createProject();
      const issue = await createIssue(project.id);

      const res = await supertest(app.getHttpServer())
        .get(`/api/v1/issues/${issue.id}/comments`)
        .expect(200);

      expect(res.body).toEqual([]);
    });

    it('404 — issue does not exist (AC3)', async () => {
      await supertest(app.getHttpServer())
        .get('/api/v1/issues/00000000-0000-0000-0000-000000000000/comments')
        .expect(404);
    });
  });
});
