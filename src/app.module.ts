import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ProjectController } from './project/project.controller';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { CommentModule } from './comment/comment.module';
import { FileModule } from './file/file.module';
import { ChatModule } from './chat/chat.module';
import { AnalyticsModule } from './analytics/analytics.module';


@Module({
  imports: [
  ConfigModule.forRoot(),
      TypeOrmModule.forRoot({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false, // important for Neon
        },
        autoLoadEntities: true,
        synchronize: true, // turn off in production!
      }),
    UserModule,
    AuthModule,
    WorkspaceModule,
    ProjectModule,
    TaskModule,
    CommentModule,
    FileModule,
    ChatModule,
    AnalyticsModule,
  ],
  controllers: [AppController, ProjectController],
  providers: [AppService],
})
export class AppModule {}
