import { Module } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ShiftService, PrismaService],
  controllers: [ShiftController],
  exports: [ShiftService], // 다른 모듈에서 사용할 수 있도록 export
})
export class ShiftModule {}
