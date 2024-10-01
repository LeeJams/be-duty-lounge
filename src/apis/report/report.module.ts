import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module'; // Prisma 모듈을 사용한다고 가정합니다.
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

@Module({
  imports: [PrismaModule], // PrismaModule을 주입합니다.
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
