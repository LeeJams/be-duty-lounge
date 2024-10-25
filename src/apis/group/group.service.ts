import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // PrismaService 사용
import { CreateGroupDto } from './dto/create-group.dto'; // 그룹 생성 DTO

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    const { name, description, userId } = createGroupDto;

    // 그룹 생성 및 그룹 소유자 추가
    const group = await this.prisma.group.create({
      data: {
        name,
        description,
        users: {
          create: {
            userId,
            isOwner: true, // 그룹 소유자 설정
          },
        },
      },
      include: {
        users: true,
      },
    });

    return group;
  }

  // 사용자가 속한 그룹 리스트 조회 (유저 수 및 소유자 여부 포함)
  async getGroupsByUserId(userId: number) {
    return await this.prisma.group.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { users: true }, // 유저 수 계산
        },
        users: {
          where: { userId: userId }, // 현재 조회하는 유저의 소유 여부 확인
          select: {
            isOwner: true, // 소유자인지 여부 반환
          },
        },
      },
    });
  }

  // 그룹 상세 조회 - 그룹 기본 정보와 인원 리스트 조회
  async getGroupDetail(groupId: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: {
        id: true,
        name: true,
        description: true,
        users: {
          select: {
            userName: true, // 사용자 이름 필드
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
            isOwner: true, // 그룹 소유자 여부
          },
        },
      },
    });

    if (!group) {
      throw new Error('Group not found');
    }

    // 필요한 형태로 데이터 가공
    const users = group.users.map((user) => ({
      userName: user.userName,
      id: user.user.id,
      nickname: user.user.nickname,
      isOwner: user.isOwner,
    }));

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      users: users,
    };
  }

  // 그룹 인원 스케줄 조회 - 특정 연도와 월의 그룹 내 인원 스케줄 조회
  async getGroupSchedules(groupId: number, year: number, month: number) {
    // 그룹에 포함된 유저와 해당 유저의 스케줄 조회
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: {
        id: true,
        users: {
          select: {
            userName: true,
            user: {
              select: {
                id: true,
                nickname: true,
                Schedule: {
                  where: {
                    year: year,
                    month: month,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!group) {
      throw new Error('Group not found');
    }

    // 각 유저의 스케줄에서 shiftIds 추출 및 Shift 데이터 매핑
    const usersWithSchedules = await Promise.all(
      group.users.map(async (user) => {
        const schedule = user.user.Schedule[0];
        if (!schedule)
          return {
            userName: user.userName,
            id: user.user.id,
            nickname: user.user.nickname,
            days: Array.from({ length: 31 }).fill(null),
          };

        const shiftIds = Array.from(
          { length: 31 },
          (_, i) => schedule[`day${i + 1}`],
        ).filter((id) => id !== null);

        const shifts = await this.prisma.shift.findMany({
          where: { id: { in: shiftIds as number[] } },
        });

        // day1 ~ day31의 값을 Shift 정보로 매핑
        const days = Array.from({ length: 31 }, (_, i) => {
          const shiftId = schedule[`day${i + 1}`];
          return shiftId ? shifts.find((shift) => shift.id === shiftId) : null;
        });

        return {
          userName: user.userName,
          id: user.user.id,
          nickname: user.user.nickname,
          days: days,
        };
      }),
    );

    return {
      id: group.id,
      users: usersWithSchedules,
    };
  }
}
