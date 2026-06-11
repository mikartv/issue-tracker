import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { UserEmailMiddleware } from './middleware/user-email.middleware';
import { Project } from './entities/project.entity';
import { Issue } from './entities/issue.entity';
import { Comment } from './entities/comment.entity';
import { InitialSchema20260610000000 } from './migrations/20260610000000-InitialSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
      ignoreEnvFile: process.env['NODE_ENV'] === 'test',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres' as const,
        url: process.env['DATABASE_URL'],
        entities: [Project, Issue, Comment],
        migrations: [InitialSchema20260610000000],
        synchronize: false,
        migrationsRun: false,
      }),
    }),
    HealthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UserEmailMiddleware).forRoutes('*');
  }
}
