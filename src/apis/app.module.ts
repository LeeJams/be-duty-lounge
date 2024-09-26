import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ShiftModule } from './shift/shift.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileModule } from './file/file.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'uploads'), // 파일을 제공할 경로 설정
      serveRoot: '/uploads', // 클라이언트가 접근하는 경로
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      envFilePath: `src/configs/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      cache: true,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    ShiftModule,
    ScheduleModule,
    FileModule,
    PostModule,
    CommentModule,
    NoticeModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
