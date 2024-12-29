import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Get,
  Request,
  Param,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { Prisma, Shift } from '@prisma/client';
import { Auth } from 'src/common/decoration/auth';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post('default')
  @Auth()
  async createDefaultShifts(@Request() req): Promise<Shift[]> {
    const userId = req.user.userId; // JWT에서 추출한 userId 사용
    return this.shiftService.createDefaultShiftsForUser(userId);
  }

  @Get()
  @Auth()
  async getShifts(@Request() req): Promise<Shift[]> {
    const userId = req.user.userId; // JWT에서 추출한 userId 사용
    return this.shiftService.getShiftsByUserId(userId);
  }

  @Post()
  @Auth()
  async createShift(
    @Request() req,
    @Body()
    shiftData: {
      name: string;
      color: string;
      startTime?: string;
      endTime?: string;
      off?: boolean;
    },
  ): Promise<Shift> {
    const userId = req.user.userId; // JWT에서 추출한 userId 사용
    return this.shiftService.createShift(userId, shiftData);
  }

  @Put(':shiftId')
  @Auth()
  async updateShift(
    @Request() req,
    @Param('shiftId') shiftId: string,
    @Body() shiftData: Prisma.ShiftUpdateInput,
  ): Promise<Shift> {
    const userId = req.user.userId;
    return this.shiftService.updateShift(
      userId,
      parseInt(shiftId, 10),
      shiftData,
    );
  }

  @Delete(':shiftId')
  @Auth()
  async deleteShift(@Param('shiftId') shiftId: string): Promise<Shift> {
    return this.shiftService.deleteShift(parseInt(shiftId, 10));
  }
}
