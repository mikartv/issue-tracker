import 'reflect-metadata';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Issue } from '../entities/issue.entity';
import { CommentsService } from './comments.service';

type MockCommentRepo = Partial<Record<keyof Repository<Comment>, jest.Mock>>;
type MockIssueRepo = Partial<Record<keyof Repository<Issue>, jest.Mock>>;

const makeMockCommentRepo = (): MockCommentRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

const makeMockIssueRepo = (): MockIssueRepo => ({
  findOneBy: jest.fn(),
});

describe('CommentsService', () => {
  let service: CommentsService;
  let commentRepo: MockCommentRepo;
  let issueRepo: MockIssueRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: makeMockCommentRepo(),
        },
        {
          provide: getRepositoryToken(Issue),
          useValue: makeMockIssueRepo(),
        },
      ],
    }).compile();

    service = module.get(CommentsService);
    commentRepo = module.get<MockCommentRepo>(getRepositoryToken(Comment));
    issueRepo = module.get<MockIssueRepo>(getRepositoryToken(Issue));
  });

  describe('create', () => {
    it('creates a comment with given body and author', async () => {
      const issue = { id: 'issue-1' } as Issue;
      issueRepo.findOneBy!.mockResolvedValue(issue);
      const comment = {
        id: 'c1',
        issue_id: 'issue-1',
        body: 'Great bug',
        author: 'user@example.com',
        created_at: new Date(),
      } as Comment;
      commentRepo.create!.mockReturnValue(comment);
      commentRepo.save!.mockResolvedValue(comment);

      const result = await service.create('issue-1', 'Great bug', 'user@example.com');
      expect(commentRepo.create).toHaveBeenCalledWith({
        issue_id: 'issue-1',
        body: 'Great bug',
        author: 'user@example.com',
      });
      expect(result.author).toBe('user@example.com');
      expect(result.body).toBe('Great bug');
    });

    it('creates a comment with author "anonymous" when no email header', async () => {
      const issue = { id: 'issue-1' } as Issue;
      issueRepo.findOneBy!.mockResolvedValue(issue);
      const comment = {
        id: 'c2',
        issue_id: 'issue-1',
        body: 'Anon comment',
        author: 'anonymous',
        created_at: new Date(),
      } as Comment;
      commentRepo.create!.mockReturnValue(comment);
      commentRepo.save!.mockResolvedValue(comment);

      const result = await service.create('issue-1', 'Anon comment', 'anonymous');
      expect(commentRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ author: 'anonymous' }),
      );
      expect(result.author).toBe('anonymous');
    });

    it('throws NotFoundException when issue does not exist', async () => {
      issueRepo.findOneBy!.mockResolvedValue(null);
      await expect(
        service.create('missing', 'body', 'user@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByIssue', () => {
    it('returns comments ordered by created_at ASC', async () => {
      const issue = { id: 'issue-1' } as Issue;
      issueRepo.findOneBy!.mockResolvedValue(issue);
      const comments = [
        { id: 'c1', issue_id: 'issue-1', created_at: new Date('2026-01-01') },
        { id: 'c2', issue_id: 'issue-1', created_at: new Date('2026-01-02') },
      ] as Comment[];
      commentRepo.find!.mockResolvedValue(comments);

      const result = await service.findByIssue('issue-1');
      expect(commentRepo.find).toHaveBeenCalledWith({
        where: { issue_id: 'issue-1' },
        order: { created_at: 'ASC' },
      });
      expect(result).toHaveLength(2);
    });

    it('returns empty array when issue has no comments', async () => {
      const issue = { id: 'issue-1' } as Issue;
      issueRepo.findOneBy!.mockResolvedValue(issue);
      commentRepo.find!.mockResolvedValue([]);

      const result = await service.findByIssue('issue-1');
      expect(result).toEqual([]);
    });

    it('throws NotFoundException when issue does not exist', async () => {
      issueRepo.findOneBy!.mockResolvedValue(null);
      await expect(service.findByIssue('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
