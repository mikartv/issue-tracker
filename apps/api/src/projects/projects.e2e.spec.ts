import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { DataSource } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Issue } from '../entities/issue.entity';
import { Project } from '../entities/project.entity';
import { InitialSchema20260610000000 } from '../migrations/20260610000000-InitialSchema';
import { ProjectsModule } from './projects.module';

describe('Projects E2E', () => {
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
      await dataSource.getRepository(Project).delete({});
    }
    await app?.close();
  });

  afterEach(async () => {
    await dataSource.getRepository(Project).delete({});
  });

  describe('POST /api/v1/projects', () => {
    it('201 — creates and returns a project', async () => {
      const res = await supertest(app.getHttpServer())
        .post('/api/v1/projects')
        .send({ name: 'My Project' })
        .expect(201);

      expect(res.body).toMatchObject({
        name: 'My Project',
        archived: false,
      });
      expect(typeof res.body.id).toBe('string');
      expect(res.body.created_at).toBeDefined();
      expect(res.body.updated_at).toBeDefined();
    });

    it('400 — rejects empty body', async () => {
      await supertest(app.getHttpServer())
        .post('/api/v1/projects')
        .send({})
        .expect(400);
    });

    it('400 — rejects empty name', async () => {
      await supertest(app.getHttpServer())
        .post('/api/v1/projects')
        .send({ name: '' })
        .expect(400);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('200 — lists all projects including archived', async () => {
      await supertest(app.getHttpServer())
        .post('/api/v1/projects')
        .send({ name: 'Active' })
        .expect(201);

      const created = await supertest(app.getHttpServer())
        .post('/api/v1/projects')
        .send({ name: 'To Archive' })
        .expect(201);

      await supertest(app.getHttpServer())
        .post(`/api/v1/projects/${created.body.id}/archive`)
        .expect(200);

      const res = await supertest(app.getHttpServer())
        .get('/api/v1/projects')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      const archived = res.body.find((p: Project) => p.id === created.body.id);
      expect(archived.archived).toBe(true);
    });
  });

  describe('PATCH /api/v1/projects/:id', () => {
    it('200 — renames an active project', async () => {
      const created = await supertest(app.getHttpServer())
        .post('/api/v1/projects')
        .send({ name: 'Original' })
        .expect(201);

      const res = await supertest(app.getHttpServer())
        .patch(`/api/v1/projects/${created.body.id}`)
        .send({ name: 'Renamed' })
        .expect(200);

      expect(res.body.name).toBe('Renamed');
      expect(res.body.id).toBe(created.body.id);
    });

    it('404 — unknown id', async () => {
      await supertest(app.getHttpServer())
        .patch('/api/v1/projects/00000000-0000-0000-0000-000000000000')
        .send({ name: 'X' })
        .expect(404);
    });

    it('409 — archived project cannot be renamed', async () => {
      const created = await supertest(app.getHttpServer())
        .post('/api/v1/projects')
        .send({ name: 'Archivable' })
        .expect(201);

      await supertest(app.getHttpServer())
        .post(`/api/v1/projects/${created.body.id}/archive`)
        .expect(200);

      await supertest(app.getHttpServer())
        .patch(`/api/v1/projects/${created.body.id}`)
        .send({ name: 'New Name' })
        .expect(409);
    });
  });

  describe('POST /api/v1/projects/:id/archive', () => {
    it('200 — archives an active project', async () => {
      const created = await supertest(app.getHttpServer())
        .post('/api/v1/projects')
        .send({ name: 'To Archive' })
        .expect(201);

      const res = await supertest(app.getHttpServer())
        .post(`/api/v1/projects/${created.body.id}/archive`)
        .expect(200);

      expect(res.body.archived).toBe(true);
      expect(res.body.id).toBe(created.body.id);
    });

    it('409 — already archived project', async () => {
      const created = await supertest(app.getHttpServer())
        .post('/api/v1/projects')
        .send({ name: 'Already Archived' })
        .expect(201);

      await supertest(app.getHttpServer())
        .post(`/api/v1/projects/${created.body.id}/archive`)
        .expect(200);

      await supertest(app.getHttpServer())
        .post(`/api/v1/projects/${created.body.id}/archive`)
        .expect(409);
    });

    it('404 — unknown id', async () => {
      await supertest(app.getHttpServer())
        .post('/api/v1/projects/00000000-0000-0000-0000-000000000000/archive')
        .expect(404);
    });
  });
});
