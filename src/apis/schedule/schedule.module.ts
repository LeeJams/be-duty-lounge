import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ScheduleService, PrismaService],
  controllers: [ScheduleController],
  exports: [ScheduleService],
})
export class ScheduleModule {}
