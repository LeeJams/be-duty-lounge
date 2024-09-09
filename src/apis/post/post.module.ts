import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service'; // Prisma Service 임포트
import { FileModule } from '../file/file.module'; // FileModule 임포트

@Module({
  imports: [FileModule], // FileModule을 임포트하여 파일 처리를 가능하게 함
  controllers: [PostController],
  providers: [PostService, PrismaService],
})
export class PostModule {}
