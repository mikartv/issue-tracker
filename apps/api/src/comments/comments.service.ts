import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Issue } from '../entities/issue.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
  ) {}

  async create(issueId: string, body: string, author: string): Promise<Comment> {
    const issue = await this.issueRepository.findOneBy({ id: issueId });
    if (!issue) {
      throw new NotFoundException(`Issue ${issueId} not found`);
    }
    const comment = this.commentRepository.create({ issue_id: issueId, body, author });
    return this.commentRepository.save(comment);
  }

  async findByIssue(issueId: string): Promise<Comment[]> {
    const issue = await this.issueRepository.findOneBy({ id: issueId });
    if (!issue) {
      throw new NotFoundException(`Issue ${issueId} not found`);
    }
    return this.commentRepository.find({
      where: { issue_id: issueId },
      order: { created_at: 'ASC' },
    });
  }
}
