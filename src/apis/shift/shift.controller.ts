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
import { Shift } from '@prisma/client';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post(':userId/default')
  async createDefaultShifts(@Param('userId') userId: number): Promise<Shift[]> {
    return this.shiftService.createDefaultShiftsForUser(userId);
  }

  @Get(':userId')
  async getShifts(@Param('userId') userId: number): Promise<Shift[]> {
    return this.shiftService.getShiftsByUserId(userId);
  }

  @Post(':userId')
  async createShift(
    @Param('userId') userId: number,
    @Body() shiftData: { name: string; color: string },
  ): Promise<Shift> {
    return this.shiftService.createShift(userId, shiftData);
  }

  @Put(':id')
  async updateShift(
    @Param('id') id: number,
    @Body() shiftData: { name?: string; color?: string },
  ): Promise<Shift> {
    return this.shiftService.updateShift(id, shiftData);
  }

  @Delete(':id')
  async deleteShift(@Param('id') id: number): Promise<Shift> {
    return this.shiftService.deleteShift(id);
  }
}
