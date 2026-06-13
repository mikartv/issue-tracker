import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUserEmail } from '../middleware/user-email.middleware';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('issues/:issueId/comments')
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Comment created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async create(
    @Param('issueId') issueId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: RequestWithUserEmail,
  ): Promise<unknown> {
    return this.commentsService.create(issueId, dto.body, req.userEmail);
  }

  @Get('issues/:issueId/comments')
  @ApiResponse({ status: 200, description: 'List of comments for issue ordered by created_at ASC' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async findByIssue(@Param('issueId') issueId: string): Promise<unknown> {
    return this.commentsService.findByIssue(issueId);
  }
}
