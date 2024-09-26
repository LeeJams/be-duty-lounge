import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { PrismaService } from '../prisma/prisma.service'; // Prisma를 사용하여 DB 연동

@Module({
  providers: [NoticeService, PrismaService],
  controllers: [NoticeController],
})
export class NoticeModule {}
