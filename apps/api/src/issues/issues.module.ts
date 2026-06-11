import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from '../entities/issue.entity';
import { Project } from '../entities/project.entity';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Project])],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
