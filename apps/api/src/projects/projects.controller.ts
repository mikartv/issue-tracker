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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Project created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreateProjectDto): Promise<unknown> {
    return this.projectsService.create(dto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of all projects' })
  async findAll(): Promise<unknown> {
    return this.projectsService.findAll();
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: 'Project renamed' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 409, description: 'Project is archived' })
  async rename(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<unknown> {
    return this.projectsService.rename(id, dto);
  }

  @Post(':id/archive')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Project archived' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 409, description: 'Project already archived' })
  async archive(@Param('id') id: string): Promise<unknown> {
    return this.projectsService.archive(id);
  }
}
