import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Shift, Prisma } from '@prisma/client';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async createDefaultShiftsForUser(userId: number): Promise<Shift[]> {
    const defaultShifts = [
      { name: '모닝', color: 'orange' },
      { name: '데이', color: 'cyan' },
      { name: '나이트', color: 'blue' },
      { name: '오프', color: 'pink' },
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
    shiftData: { name: string; color: string },
  ): Promise<Shift> {
    return this.prisma.shift.create({
      data: {
        user: { connect: { id: userId } }, // userId를 통한 연결 설정
        ...shiftData,
      },
    });
  }

  async updateShift(
    id: number,
    shiftData: Prisma.ShiftUpdateInput,
  ): Promise<Shift> {
    return this.prisma.shift.update({
      where: { id },
      data: shiftData,
    });
  }

  async deleteShift(id: number): Promise<Shift> {
    return this.prisma.shift.delete({
      where: { id },
    });
  }

  async getShiftsByUserId(userId: number): Promise<Shift[]> {
    return this.prisma.shift.findMany({
      where: { userId },
    });
  }
}
