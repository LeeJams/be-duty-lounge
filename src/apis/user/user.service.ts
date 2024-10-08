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

      // 4. 고유한 6자리 코드 생성
      const uniqueCode = await this.generateUniqueUserCode();

      user = await this.prisma.user.create({
        data: {
          ...data,
          nickname,
          code: uniqueCode, // 고유 코드 추가
        },
      });

      // 5. 새로운 유저에 대한 기본 근무조 생성
      await this.shiftService.createDefaultShiftsForUser(user.id);
    }

    // 6. JWT 토큰 발행
    const token = this.authService.generateJwtToken({
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }

  // 고유한 6자리 코드를 생성하는 함수
  private async generateUniqueUserCode(): Promise<string> {
    let uniqueCode: string;
    let isUnique = false;

    while (!isUnique) {
      // 1. 6자리의 랜덤 문자열 생성 (알파벳 대문자 및 숫자)
      uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // 2. 해당 코드가 이미 존재하는지 확인
      const existingUser = await this.prisma.user.findUnique({
        where: { code: uniqueCode },
      });

      // 3. 중복되지 않으면 유니크 코드로 설정
      if (!existingUser) {
        isUnique = true;
      }
    }

    return uniqueCode;
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

  async deleteUser(userId: number): Promise<boolean> {
    await this.prisma.user.delete({ where: { id: userId } });

    return true;
  }

  // 인증된 회원 확인 후 회사 정보 업데이트
  async authenticateAndUpdateCompany(
    id: number,
    code: string,
    company: string,
  ): Promise<boolean> {
    // 1. code로 사용자 조회
    const userByCode = await this.prisma.user.findUnique({
      where: { code },
    });

    // 2. code로 조회된 사용자가 존재하지 않으면 false 반환
    if (!userByCode) {
      return false;
    }

    // 3. 자기 자신의 code로 인증을 시도하는 경우 실패
    if (userByCode.id === id) {
      return false;
    }

    // 4. code로 조회된 사용자가 인증 회원인지 확인
    if (!userByCode.company) {
      return false;
    }

    // 5. id로 조회된 사용자의 company 필드 업데이트
    await this.prisma.user.update({
      where: { id },
      data: { company },
    });

    return true;
  }
}
