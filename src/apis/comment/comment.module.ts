import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Prisma Service 임포트
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [], // FileModule을 임포트하여 파일 처리를 가능하게 함
  controllers: [CommentController],
  providers: [CommentService, PrismaService],
})
export class CommentModule {}
