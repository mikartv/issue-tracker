import 'reflect-metadata';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue, IssuePriority, IssueStatus } from '../entities/issue.entity';
import { Project } from '../entities/project.entity';
import { IssuesService } from './issues.service';

type MockIssueRepo = Partial<Record<keyof Repository<Issue>, jest.Mock>>;
type MockProjectRepo = Partial<Record<keyof Repository<Project>, jest.Mock>>;

const makeMockIssueRepo = (): MockIssueRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  findBy: jest.fn(),
  findOneBy: jest.fn(),
});

const makeMockProjectRepo = (): MockProjectRepo => ({
  findOneBy: jest.fn(),
});

describe('IssuesService', () => {
  let service: IssuesService;
  let issueRepo: MockIssueRepo;
  let projectRepo: MockProjectRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssuesService,
        {
          provide: getRepositoryToken(Issue),
          useValue: makeMockIssueRepo(),
        },
        {
          provide: getRepositoryToken(Project),
          useValue: makeMockProjectRepo(),
        },
      ],
    }).compile();

    service = module.get(IssuesService);
    issueRepo = module.get<MockIssueRepo>(getRepositoryToken(Issue));
    projectRepo = module.get<MockProjectRepo>(getRepositoryToken(Project));
  });

  describe('create', () => {
    it('creates issue with defaults status=open and priority=medium', async () => {
      const project = { id: 'proj-1', name: 'P', archived: false } as Project;
      projectRepo.findOneBy!.mockResolvedValue(project);
      const entity = {
        id: 'issue-1',
        project_id: 'proj-1',
        title: 'T',
        description: null,
        status: IssueStatus.OPEN,
        priority: IssuePriority.MEDIUM,
        assignee: null,
      } as Issue;
      issueRepo.create!.mockReturnValue(entity);
      issueRepo.save!.mockResolvedValue(entity);

      const result = await service.create('proj-1', { title: 'T' });
      expect(issueRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: IssueStatus.OPEN,
          priority: IssuePriority.MEDIUM,
        }),
      );
      expect(result.status).toBe(IssueStatus.OPEN);
      expect(result.priority).toBe(IssuePriority.MEDIUM);
    });

    it('respects an explicit priority in the DTO', async () => {
      const project = { id: 'proj-1', archived: false } as Project;
      projectRepo.findOneBy!.mockResolvedValue(project);
      const entity = {
        id: 'issue-2',
        project_id: 'proj-1',
        title: 'T',
        status: IssueStatus.OPEN,
        priority: IssuePriority.HIGH,
      } as Issue;
      issueRepo.create!.mockReturnValue(entity);
      issueRepo.save!.mockResolvedValue(entity);

      const result = await service.create('proj-1', {
        title: 'T',
        priority: IssuePriority.HIGH,
      });
      expect(issueRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ priority: IssuePriority.HIGH }),
      );
      expect(result.priority).toBe(IssuePriority.HIGH);
    });

    it('throws NotFoundException when project does not exist', async () => {
      projectRepo.findOneBy!.mockResolvedValue(null);
      await expect(
        service.create('missing', { title: 'T' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when project is archived', async () => {
      projectRepo.findOneBy!.mockResolvedValue({
        id: 'proj-1',
        archived: true,
      } as Project);
      await expect(
        service.create('proj-1', { title: 'T' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByProject', () => {
    it('returns all issues for a project', async () => {
      const issues = [
        { id: 'i1', project_id: 'proj-1' },
        { id: 'i2', project_id: 'proj-1' },
      ] as Issue[];
      issueRepo.findBy!.mockResolvedValue(issues);

      const result = await service.findByProject('proj-1');
      expect(issueRepo.findBy).toHaveBeenCalledWith({ project_id: 'proj-1' });
      expect(result).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('returns an issue by id', async () => {
      const issue = { id: 'i1', title: 'T' } as Issue;
      issueRepo.findOneBy!.mockResolvedValue(issue);

      const result = await service.findOne('i1');
      expect(result).toEqual(issue);
    });

    it('throws NotFoundException when issue does not exist', async () => {
      issueRepo.findOneBy!.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updates allowed fields', async () => {
      const issue = {
        id: 'i1',
        title: 'Old',
        priority: IssuePriority.LOW,
        assignee: null,
        status: IssueStatus.OPEN,
      } as Issue;
      issueRepo.findOneBy!.mockResolvedValue(issue);
      issueRepo.save!.mockResolvedValue({
        ...issue,
        title: 'New',
        priority: IssuePriority.HIGH,
      } as Issue);

      const result = await service.update('i1', {
        title: 'New',
        priority: IssuePriority.HIGH,
      });
      expect(result.title).toBe('New');
      expect(result.priority).toBe(IssuePriority.HIGH);
    });

    it('throws NotFoundException when issue does not exist', async () => {
      issueRepo.findOneBy!.mockResolvedValue(null);
      await expect(
        service.update('missing', { title: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    const makeIssue = (status: IssueStatus): Issue =>
      ({ id: 'i1', status } as Issue);

    it('transitions open → in_progress', async () => {
      issueRepo.findOneBy!.mockResolvedValue(makeIssue(IssueStatus.OPEN));
      const saved = { id: 'i1', status: IssueStatus.IN_PROGRESS } as Issue;
      issueRepo.save!.mockResolvedValue(saved);

      const result = await service.updateStatus('i1', {
        status: IssueStatus.IN_PROGRESS,
      });
      expect(result.status).toBe(IssueStatus.IN_PROGRESS);
    });

    it('transitions in_progress → done', async () => {
      issueRepo.findOneBy!.mockResolvedValue(makeIssue(IssueStatus.IN_PROGRESS));
      issueRepo.save!.mockResolvedValue({
        id: 'i1',
        status: IssueStatus.DONE,
      } as Issue);

      const result = await service.updateStatus('i1', {
        status: IssueStatus.DONE,
      });
      expect(result.status).toBe(IssueStatus.DONE);
    });

    it('transitions done → closed', async () => {
      issueRepo.findOneBy!.mockResolvedValue(makeIssue(IssueStatus.DONE));
      issueRepo.save!.mockResolvedValue({
        id: 'i1',
        status: IssueStatus.CLOSED,
      } as Issue);

      const result = await service.updateStatus('i1', {
        status: IssueStatus.CLOSED,
      });
      expect(result.status).toBe(IssueStatus.CLOSED);
    });

    it('allows skip: open → done', async () => {
      issueRepo.findOneBy!.mockResolvedValue(makeIssue(IssueStatus.OPEN));
      const saved = { id: 'i1', status: IssueStatus.DONE } as Issue;
      issueRepo.save!.mockResolvedValue(saved);
      const result = await service.updateStatus('i1', { status: IssueStatus.DONE });
      expect(result.status).toBe(IssueStatus.DONE);
    });

    it('allows backward: done → in_progress', async () => {
      issueRepo.findOneBy!.mockResolvedValue(makeIssue(IssueStatus.DONE));
      const saved = { id: 'i1', status: IssueStatus.IN_PROGRESS } as Issue;
      issueRepo.save!.mockResolvedValue(saved);
      const result = await service.updateStatus('i1', { status: IssueStatus.IN_PROGRESS });
      expect(result.status).toBe(IssueStatus.IN_PROGRESS);
    });

    it('throws NotFoundException when issue does not exist', async () => {
      issueRepo.findOneBy!.mockResolvedValue(null);
      await expect(
        service.updateStatus('missing', { status: IssueStatus.IN_PROGRESS }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
