import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue, IssuePriority, IssueStatus } from '../entities/issue.entity';
import { Project } from '../entities/project.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(projectId: string, dto: CreateIssueDto): Promise<Issue> {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }
    if (project.archived) {
      throw new ConflictException(`Project ${projectId} is archived`);
    }
    const issue = this.issueRepository.create({
      project_id: projectId,
      title: dto.title,
      description: dto.description ?? null,
      status: IssueStatus.OPEN,
      priority: dto.priority ?? IssuePriority.MEDIUM,
      assignee: dto.assignee ?? null,
    });
    return this.issueRepository.save(issue);
  }

  async findByProject(projectId: string): Promise<Issue[]> {
    return this.issueRepository.findBy({ project_id: projectId });
  }

  async findOne(id: string): Promise<Issue> {
    const issue = await this.issueRepository.findOneBy({ id });
    if (!issue) {
      throw new NotFoundException(`Issue ${id} not found`);
    }
    return issue;
  }

  async update(id: string, dto: UpdateIssueDto): Promise<Issue> {
    const issue = await this.issueRepository.findOneBy({ id });
    if (!issue) {
      throw new NotFoundException(`Issue ${id} not found`);
    }
    if (dto.title !== undefined) issue.title = dto.title;
    if (dto.description !== undefined) issue.description = dto.description;
    if (dto.priority !== undefined) issue.priority = dto.priority;
    if (dto.assignee !== undefined) issue.assignee = dto.assignee;
    return this.issueRepository.save(issue);
  }

  async updateStatus(id: string, dto: UpdateIssueStatusDto): Promise<Issue> {
    const issue = await this.issueRepository.findOneBy({ id });
    if (!issue) {
      throw new NotFoundException(`Issue ${id} not found`);
    }
    issue.status = dto.status;
    return this.issueRepository.save(issue);
  }
}
