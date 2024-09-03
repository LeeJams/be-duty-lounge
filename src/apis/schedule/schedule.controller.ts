import { Controller, Post, Param, Body, Get, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from '@prisma/client';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post(':userId/:month/:year')
  async createOrUpdateSchedule(
    @Param('userId') userId: string,
    @Param('month') month: string,
    @Param('year') year: string,
    @Body() scheduleData: Partial<Record<number, number>>, // { 1: shiftId, 2: shiftId, ... }
  ): Promise<Schedule> {
    return this.scheduleService.createOrUpdateSchedule(
      parseInt(userId, 10),
      parseInt(month, 10),
      parseInt(year, 10),
      scheduleData,
    );
  }

  @Get(':userId/:month/:year')
  async getSchedule(
    @Param('userId') userId: string,
    @Param('month') month: string,
    @Param('year') year: string,
  ): Promise<{
    id: number;
    userId: number;
    month: number;
    year: number;
    days: { id: number; color: string; name: string }[];
  } | null> {
    return this.scheduleService.getSchedule(
      parseInt(userId, 10),
      parseInt(month, 10),
      parseInt(year, 10),
    );
  }

  @Delete(':userId/:month/:year')
  async deleteSchedule(
    @Param('userId') userId: string,
    @Param('month') month: string,
    @Param('year') year: string,
  ): Promise<void> {
    await this.scheduleService.deleteSchedule(
      parseInt(userId, 10),
      parseInt(month, 10),
      parseInt(year, 10),
    );
  }
}
