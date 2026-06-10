import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Project } from './entities/project.entity';
import { Issue } from './entities/issue.entity';
import { Comment } from './entities/comment.entity';
import { InitialSchema20260610000000 } from './migrations/20260610000000-InitialSchema';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env['DATABASE_URL'],
  entities: [Project, Issue, Comment],
  migrations: [InitialSchema20260610000000],
  synchronize: false,
});
