import 'reflect-metadata';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectsService } from './projects.service';

type MockRepo = Partial<Record<keyof Repository<Project>, jest.Mock>>;

const makeMockRepo = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
});

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repo: MockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: makeMockRepo(),
        },
      ],
    }).compile();

    service = module.get(ProjectsService);
    repo = module.get<MockRepo>(getRepositoryToken(Project));
  });

  describe('create', () => {
    it('creates and saves a new project', async () => {
      const dto = { name: 'Alpha' };
      const entity = {
        id: 'uuid-1',
        name: 'Alpha',
        archived: false,
        created_at: new Date(),
        updated_at: new Date(),
      } as Project;
      repo.create!.mockReturnValue(entity);
      repo.save!.mockResolvedValue(entity);

      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith({ name: 'Alpha' });
      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });
  });

  describe('findAll', () => {
    it('returns all projects', async () => {
      const projects = [
        { id: 'uuid-1', name: 'P1', archived: false },
        { id: 'uuid-2', name: 'P2', archived: true },
      ] as Project[];
      repo.find!.mockResolvedValue(projects);

      const result = await service.findAll();
      expect(result).toEqual(projects);
    });
  });

  describe('rename', () => {
    it('renames an active project', async () => {
      const project = {
        id: 'uuid-1',
        name: 'Old',
        archived: false,
      } as Project;
      repo.findOneBy!.mockResolvedValue(project);
      repo.save!.mockResolvedValue({ ...project, name: 'New' } as Project);

      const result = await service.rename('uuid-1', { name: 'New' });
      expect(result.name).toBe('New');
    });

    it('throws NotFoundException when project does not exist', async () => {
      repo.findOneBy!.mockResolvedValue(null);
      await expect(
        service.rename('missing-id', { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when project is archived', async () => {
      repo.findOneBy!.mockResolvedValue({
        id: 'uuid-1',
        name: 'Old',
        archived: true,
      } as Project);
      await expect(
        service.rename('uuid-1', { name: 'X' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('archive', () => {
    it('archives an active project', async () => {
      const project = {
        id: 'uuid-1',
        name: 'P1',
        archived: false,
      } as Project;
      repo.findOneBy!.mockResolvedValue(project);
      repo.save!.mockResolvedValue({ ...project, archived: true } as Project);

      const result = await service.archive('uuid-1');
      expect(result.archived).toBe(true);
    });

    it('throws NotFoundException when project does not exist', async () => {
      repo.findOneBy!.mockResolvedValue(null);
      await expect(service.archive('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ConflictException when project is already archived', async () => {
      repo.findOneBy!.mockResolvedValue({
        id: 'uuid-1',
        name: 'P1',
        archived: true,
      } as Project);
      await expect(service.archive('uuid-1')).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
