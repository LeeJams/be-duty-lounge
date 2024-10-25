import {
  Controller,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { Prisma, Shift } from '@prisma/client';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post(':userId/default')
  async createDefaultShifts(@Param('userId') userId: string): Promise<Shift[]> {
    return this.shiftService.createDefaultShiftsForUser(parseInt(userId, 10));
  }

  @Get(':userId')
  async getShifts(@Param('userId') userId: string): Promise<Shift[]> {
    return this.shiftService.getShiftsByUserId(parseInt(userId, 10));
  }

  @Post(':userId')
  async createShift(
    @Param('userId') userId: string,
    @Body()
    shiftData: {
      name: string;
      color: string;
      startTime?: string;
      endTime?: string;
      off?: boolean;
    },
  ): Promise<Shift> {
    return this.shiftService.createShift(parseInt(userId, 10), shiftData);
  }

  @Put(':id')
  async updateShift(
    @Param('id') id: string,
    @Body()
    shiftData: Prisma.ShiftUpdateInput,
  ): Promise<Shift> {
    return this.shiftService.updateShift(parseInt(id, 10), shiftData);
  }

  @Delete(':id')
  async deleteShift(@Param('id') id: string): Promise<Shift> {
    return this.shiftService.deleteShift(parseInt(id, 10));
  }
}
