import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({ name: dto.name });
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async rename(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    if (project.archived) {
      throw new ConflictException(`Project ${id} is archived`);
    }
    project.name = dto.name;
    return this.projectRepository.save(project);
  }

  async archive(id: string): Promise<Project> {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    if (project.archived) {
      throw new ConflictException(`Project ${id} is already archived`);
    }
    project.archived = true;
    return this.projectRepository.save(project);
  }
}
