import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Project } from './entities/project.entity';
import { Issue, IssueStatus, IssuePriority } from './entities/issue.entity';
import { Comment } from './entities/comment.entity';
import { InitialSchema20260610000000 } from './migrations/20260610000000-InitialSchema';

let ds: DataSource;

beforeAll(async () => {
  ds = new DataSource({
    type: 'postgres',
    url: process.env['DATABASE_URL'],
    entities: [Project, Issue, Comment],
    migrations: [InitialSchema20260610000000],
    synchronize: false,
    logging: false,
  });
  await ds.initialize();
  await ds.runMigrations();
});

afterAll(async () => {
  if (ds?.isInitialized) {
    await ds.undoLastMigration();
    await ds.destroy();
  }
});

describe('Migration round-trip', () => {
  it('round-trips a Project fixture', async () => {
    const repo = ds.getRepository(Project);
    const saved = await repo.save({
      name: 'Test Project',
      archived: false,
    });

    const found = await repo.findOneByOrFail({ id: saved.id });

    expect(found.id).toBe(saved.id);
    expect(found.name).toBe('Test Project');
    expect(found.archived).toBe(false);
    expect(found.created_at).toBeInstanceOf(Date);
    expect(found.updated_at).toBeInstanceOf(Date);
  });

  it('round-trips an Issue fixture', async () => {
    const projectRepo = ds.getRepository(Project);
    const project = await projectRepo.save({ name: 'Parent Project', archived: false });

    const issueRepo = ds.getRepository(Issue);
    const saved = await issueRepo.save({
      project_id: project.id,
      title: 'Test Issue',
      description: 'A test description',
      status: IssueStatus.OPEN,
      priority: IssuePriority.MEDIUM,
      assignee: null,
    });

    const found = await issueRepo.findOneByOrFail({ id: saved.id });

    expect(found.id).toBe(saved.id);
    expect(found.project_id).toBe(project.id);
    expect(found.title).toBe('Test Issue');
    expect(found.description).toBe('A test description');
    expect(found.status).toBe(IssueStatus.OPEN);
    expect(found.priority).toBe(IssuePriority.MEDIUM);
    expect(found.assignee).toBeNull();
    expect(found.created_at).toBeInstanceOf(Date);
    expect(found.updated_at).toBeInstanceOf(Date);
  });

  it('round-trips a Comment fixture', async () => {
    const projectRepo = ds.getRepository(Project);
    const project = await projectRepo.save({ name: 'Project for Comment', archived: false });

    const issueRepo = ds.getRepository(Issue);
    const issue = await issueRepo.save({
      project_id: project.id,
      title: 'Issue for Comment',
      description: null,
      status: IssueStatus.OPEN,
      priority: IssuePriority.LOW,
      assignee: null,
    });

    const commentRepo = ds.getRepository(Comment);
    const saved = await commentRepo.save({
      issue_id: issue.id,
      author: 'test-author',
      body: 'Test comment body',
    });

    const found = await commentRepo.findOneByOrFail({ id: saved.id });

    expect(found.id).toBe(saved.id);
    expect(found.issue_id).toBe(issue.id);
    expect(found.author).toBe('test-author');
    expect(found.body).toBe('Test comment body');
    expect(found.created_at).toBeInstanceOf(Date);
    // Comment has no updated_at column per design decision D1
    expect('updated_at' in found).toBe(false);
  });
});
