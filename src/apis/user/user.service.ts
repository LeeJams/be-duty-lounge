import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
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
      const nickname = `익명${uuidv4().slice(0, 8)}`;
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

  async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user;
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

  async updateUserNickname(userId: number, nickname: string): Promise<boolean> {
    // 1. 중복 닉네임이 있는지 확인
    const existingUserWithNickname = await this.prisma.user.findFirst({
      where: {
        nickname,
        NOT: { id: userId }, // 자기 자신은 제외하고 닉네임 중복 체크
      },
    });

    // 2. 중복된 닉네임이 있으면 false 반환
    if (existingUserWithNickname) {
      return false;
    }

    // 3. 닉네임이 중복되지 않으면 업데이트 진행
    await this.prisma.user.update({
      where: { id: userId },
      data: { nickname },
    });

    // 4. 업데이트 성공 시 true 반환
    return true;
  }
}
