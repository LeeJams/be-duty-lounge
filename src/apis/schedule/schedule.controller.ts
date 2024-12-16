import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Request,
  Param,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Auth } from 'src/common/decoration/auth';
import { ApiOperation } from '@nestjs/swagger';
import { Schedule } from '@prisma/client';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post(':month/:year')
  @Auth()
  @ApiOperation({
    summary: '스케줄 생성 또는 업데이트',
    description: '월별 스케줄을 생성하거나 업데이트합니다.',
  })
  async createOrUpdateSchedule(
    @Request() req,
    @Param('month') month: string,
    @Param('year') year: string,
    @Body() scheduleData: Partial<Record<number, number>>, // { 1: shiftId, 2: shiftId, ... }
  ): Promise<Schedule> {
    const userId = req.user.userId; // JWT에서 추출한 userId
    return this.scheduleService.createOrUpdateSchedule(
      userId,
      parseInt(month, 10),
      parseInt(year, 10),
      scheduleData,
    );
  }

  @Get(':month/:year')
  @Auth()
  @ApiOperation({
    summary: '스케줄 조회',
    description: '월별 스케줄을 조회합니다.',
  })
  async getSchedule(
    @Request() req,
    @Param('month') month: string,
    @Param('year') year: string,
  ): Promise<{
    id: number;
    userId: number;
    month: number;
    year: number;
    days: { id: number; color: string; name: string }[];
  } | null> {
    const userId = req.user.userId; // JWT에서 추출한 userId
    return this.scheduleService.getSchedule(
      userId,
      parseInt(month, 10),
      parseInt(year, 10),
    );
  }

  @Delete(':month/:year')
  @Auth()
  @ApiOperation({
    summary: '스케줄 삭제',
    description: '월별 스케줄을 삭제합니다.',
  })
  async deleteSchedule(
    @Request() req,
    @Param('month') month: string,
    @Param('year') year: string,
  ): Promise<void> {
    const userId = req.user.userId; // JWT에서 추출한 userId
    await this.scheduleService.deleteSchedule(
      userId,
      parseInt(month, 10),
      parseInt(year, 10),
    );
  }
}
