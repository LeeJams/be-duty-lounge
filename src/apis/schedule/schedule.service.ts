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
    // scheduleData를 Prisma에서 인식할 수 있는 형식으로 변환
    const formattedScheduleData = Object.entries(scheduleData).reduce(
      (acc, [key, value]) => {
        acc[`day${key}`] = value;
        return acc;
      },
      {} as Partial<Record<string, number>>,
    );

    const existingSchedule = await this.prisma.schedule.findUnique({
      where: { userId_month_year: { userId, month, year } },
    });

    if (existingSchedule) {
      return this.prisma.schedule.update({
        where: { id: existingSchedule.id },
        data: {
          ...formattedScheduleData,
        },
      });
    } else {
      return this.prisma.schedule.create({
        data: {
          userId,
          month,
          year,
          ...formattedScheduleData,
        },
      });
    }
  }

  async getSchedule(
    userId: number,
    month: number,
    year: number,
  ): Promise<{
    id: number;
    userId: number;
    month: number;
    year: number;
    days: { id: number; color: string; name: string }[];
  } | null> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { userId_month_year: { userId, month, year } },
    });

    if (!schedule) {
      return null;
    }

    // day1 ~ day31까지의 shiftId 값을 배열로 추출
    const shiftIds = Array.from(
      { length: 31 },
      (_, i) => schedule[`day${i + 1}`],
    ).filter((id) => id !== null);

    // 해당 shiftIds에 대한 Shift 정보를 가져오기
    const shifts = await this.prisma.shift.findMany({
      where: { id: { in: shiftIds as number[] } },
    });

    // day1 ~ day31의 값을 Shift 정보로 매핑
    const days = Array.from({ length: 31 }, (_, i) => {
      const shiftId = schedule[`day${i + 1}`];
      return shiftId ? shifts.find((shift) => shift.id === shiftId) : null;
    });

    return {
      id: schedule.id,
      userId: schedule.userId,
      month: schedule.month,
      year: schedule.year,
      days, // days 배열을 반환
    };
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
