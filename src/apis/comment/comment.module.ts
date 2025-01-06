import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Prisma Service 임포트
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule], // NotificationModule 등록
  controllers: [CommentController],
  providers: [CommentService, PrismaService],
})
export class CommentModule {}
