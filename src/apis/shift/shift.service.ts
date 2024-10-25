import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Shift, Prisma } from '@prisma/client';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async createDefaultShiftsForUser(userId: number): Promise<Shift[]> {
    const defaultShifts = [
      { name: '모닝', color: 'orange', off: false },
      { name: '데이', color: 'cyan', off: false },
      { name: '나이트', color: 'blue', off: false },
      { name: '오프', color: 'pink', off: true },
    ];

    const shifts = [];

    for (const shift of defaultShifts) {
      const createdShift = await this.prisma.shift.create({
        data: {
          user: { connect: { id: userId } }, // userId를 통한 연결 설정
          ...shift,
        },
      });
      shifts.push(createdShift);
    }

    return shifts;
  }

  async createShift(
    userId: number,
    shiftData: {
      name: string;
      color: string;
      startTime?: string;
      endTime?: string;
      off?: boolean;
    },
  ): Promise<Shift> {
    return this.prisma.shift.create({
      data: {
        user: { connect: { id: userId } }, // userId로 연결
        ...shiftData,
      },
    });
  }

  // 근무조 수정 시 startTime과 endTime도 업데이트 가능하도록 처리
  async updateShift(
    id: number,
    shiftData: Prisma.ShiftUpdateInput,
  ): Promise<Shift> {
    return this.prisma.shift.update({
      where: { id },
      data: shiftData,
    });
  }

  async deleteShift(shiftId: number): Promise<Shift> {
    // 스케줄에서 삭제하려는 Shift ID를 사용하는 필드들을 모두 null로 업데이트
    await this.prisma.schedule.updateMany({
      where: {
        OR: [
          { day1: shiftId },
          { day2: shiftId },
          { day3: shiftId },
          { day4: shiftId },
          { day5: shiftId },
          { day6: shiftId },
          { day7: shiftId },
          { day8: shiftId },
          { day9: shiftId },
          { day10: shiftId },
          { day11: shiftId },
          { day12: shiftId },
          { day13: shiftId },
          { day14: shiftId },
          { day15: shiftId },
          { day16: shiftId },
          { day17: shiftId },
          { day18: shiftId },
          { day19: shiftId },
          { day20: shiftId },
          { day21: shiftId },
          { day22: shiftId },
          { day23: shiftId },
          { day24: shiftId },
          { day25: shiftId },
          { day26: shiftId },
          { day27: shiftId },
          { day28: shiftId },
          { day29: shiftId },
          { day30: shiftId },
          { day31: shiftId },
        ],
      },
      data: {
        day1: { set: null },
        day2: { set: null },
        day3: { set: null },
        day4: { set: null },
        day5: { set: null },
        day6: { set: null },
        day7: { set: null },
        day8: { set: null },
        day9: { set: null },
        day10: { set: null },
        day11: { set: null },
        day12: { set: null },
        day13: { set: null },
        day14: { set: null },
        day15: { set: null },
        day16: { set: null },
        day17: { set: null },
        day18: { set: null },
        day19: { set: null },
        day20: { set: null },
        day21: { set: null },
        day22: { set: null },
        day23: { set: null },
        day24: { set: null },
        day25: { set: null },
        day26: { set: null },
        day27: { set: null },
        day28: { set: null },
        day29: { set: null },
        day30: { set: null },
        day31: { set: null },
      },
    });

    return this.prisma.shift.delete({
      where: { id: shiftId },
    });
  }

  async getShiftsByUserId(userId: number): Promise<Shift[]> {
    return this.prisma.shift.findMany({
      where: { userId },
    });
  }
}
