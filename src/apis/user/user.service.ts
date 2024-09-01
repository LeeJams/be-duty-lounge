import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ResponseDto } from 'src/common/dto/response.dto';
import { GetUserByEmailDto } from './dto/get-user-by-email.dto';
import { UserDto } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';
import { ShiftService } from '../shift/shift.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly shiftService: ShiftService,
  ) {}

  async login(data: UserDto): Promise<{ user: User; token: string }> {
    // 1. 이메일과 인증 제공자로 유저 조회
    const existingUser = await this.getUserByEmail({
      email: data.email,
      authProvider: data.authProvider,
    });

    let user: User;

    // 2. 유저가 존재하면 로그인
    if (existingUser) {
      user = existingUser;
    } else {
      // 3. 유저가 존재하지 않으면 새로운 유저 생성
      const nickname = data.nickname || `user-${uuidv4().slice(0, 8)}`;
      user = await this.prisma.user.create({
        data: {
          ...data,
          nickname,
        },
      });

      // 4. 새로운 유저에 대한 기본 근무조 생성
      await this.shiftService.createDefaultShiftsForUser(user.id);
    }

    // 5. JWT 토큰 발행
    const token = this.authService.generateJwtToken({
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }

  async getUserById(id: number): Promise<ResponseDto<User | null>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { success: false, message: 'User not found', data: null };
    } else {
      return { success: true, message: 'User found', data: user };
    }
  }

  async getUserByEmail(data: GetUserByEmailDto): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email_authProvider: { ...data } },
    });

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
