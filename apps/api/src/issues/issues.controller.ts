import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
import { IssuesService } from './issues.service';

@ApiTags('issues')
@Controller()
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post('projects/:projectId/issues')
  @ApiBody({ type: CreateIssueDto })
  @ApiResponse({ status: 201, description: 'Issue created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 409, description: 'Project is archived' })
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateIssueDto,
  ): Promise<unknown> {
    return this.issuesService.create(projectId, dto);
  }

  @Get('projects/:projectId/issues')
  @ApiResponse({ status: 200, description: 'List of issues for project' })
  async findByProject(
    @Param('projectId') projectId: string,
  ): Promise<unknown> {
    return this.issuesService.findByProject(projectId);
  }

  @Get('issues/:id')
  @ApiResponse({ status: 200, description: 'Issue detail' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async findOne(@Param('id') id: string): Promise<unknown> {
    return this.issuesService.findOne(id);
  }

  @Patch('issues/:id')
  @ApiBody({ type: UpdateIssueDto })
  @ApiResponse({ status: 200, description: 'Issue updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateIssueDto,
  ): Promise<unknown> {
    return this.issuesService.update(id, dto);
  }

  @Post('issues/:id/status')
  @HttpCode(200)
  @ApiBody({ type: UpdateIssueStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateIssueStatusDto,
  ): Promise<unknown> {
    return this.issuesService.updateStatus(id, dto);
  }
}
