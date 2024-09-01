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

    const shifts = await Promise.all(
      defaultShifts.map((shift) =>
        this.prisma.shift.create({
          data: {
            userId,
            ...shift,
          },
        }),
      ),
    );

    return shifts;
  }

  async createShift(
    userId: number,
    shiftData: Prisma.ShiftCreateInput,
  ): Promise<Shift> {
    return this.prisma.shift.create({
      data: {
        userId,
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
