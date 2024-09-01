import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Schedule } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdateSchedule(
    userId: number,
    month: number,
    year: number,
    scheduleData: Partial<Record<number, number>>, // { 1: shiftId, 2: shiftId, ... }
  ): Promise<Schedule> {
    const existingSchedule = await this.prisma.schedule.findUnique({
      where: { userId_month_year: { userId, month, year } },
    });

    if (existingSchedule) {
      return this.prisma.schedule.update({
        where: { id: existingSchedule.id },
        data: {
          ...scheduleData,
        },
      });
    } else {
      return this.prisma.schedule.create({
        data: {
          userId,
          month,
          year,
          ...scheduleData,
        },
      });
    }
  }

  async getSchedule(
    userId: number,
    month: number,
    year: number,
  ): Promise<Schedule | null> {
    return this.prisma.schedule.findUnique({
      where: { userId_month_year: { userId, month, year } },
    });
  }

  async deleteSchedule(
    userId: number,
    month: number,
    year: number,
  ): Promise<void> {
    await this.prisma.schedule.delete({
      where: { userId_month_year: { userId, month, year } },
    });
  }
}
