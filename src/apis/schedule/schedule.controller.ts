import { Controller, Post, Param, Body, Get, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from '@prisma/client';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post(':userId/:month/:year')
  async createOrUpdateSchedule(
    @Param('userId') userId: number,
    @Param('month') month: number,
    @Param('year') year: number,
    @Body() scheduleData: Partial<Record<number, number>>, // { 1: shiftId, 2: shiftId, ... }
  ): Promise<Schedule> {
    return this.scheduleService.createOrUpdateSchedule(
      userId,
      month,
      year,
      scheduleData,
    );
  }

  @Get(':userId/:month/:year')
  async getSchedule(
    @Param('userId') userId: number,
    @Param('month') month: number,
    @Param('year') year: number,
  ): Promise<Schedule | null> {
    return this.scheduleService.getSchedule(userId, month, year);
  }

  @Delete(':userId/:month/:year')
  async deleteSchedule(
    @Param('userId') userId: number,
    @Param('month') month: number,
    @Param('year') year: number,
  ): Promise<void> {
    await this.scheduleService.deleteSchedule(userId, month, year);
  }
}
