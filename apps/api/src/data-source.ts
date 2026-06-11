import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Project } from './entities/project.entity';
import { Issue } from './entities/issue.entity';
import { Comment } from './entities/comment.entity';
import { InitialSchema20260610000000 } from './migrations/20260610000000-InitialSchema';

const dbUrl = process.env['DATABASE_URL'];
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl,
  entities: [Project, Issue, Comment],
  migrations: [InitialSchema20260610000000],
  synchronize: false,
});
