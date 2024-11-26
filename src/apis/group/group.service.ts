import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // PrismaService 사용
import { CreateGroupDto } from './dto/create-group.dto'; // 그룹 생성 DTO
import { InviteUserDto } from './dto/invite-user.dto';
import { RespondInviteDto } from './dto/respond-invite.dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    const { groupName, nickName, userId } = createGroupDto;

    // 그룹 생성 및 그룹 소유자 추가
    const group = await this.prisma.group.create({
      data: {
        name: groupName,
        users: {
          create: {
            userId,
            isOwner: true, // 그룹 소유자 설정
            isJoined: true, // 그룹 가입 여부 설정
            userName: nickName, // 사용자 이름 설정
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
    const groups = await this.prisma.group.findMany({
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
          select: { users: true },
        },
        users: {
          where: { userId: userId },
          select: {
            isOwner: true,
            isJoined: true,
            id: true,
          },
        },
      },
    });

    // users 필드에서 isOwner, isJoined를 최상위로 추출하고 users 필드를 제거
    return groups.map((group) => ({
      ...group,
      isOwner: group.users[0]?.isOwner || false,
      isJoined: group.users[0]?.isJoined || false,
      users: undefined, // users 필드를 제거
      inviteId: group.users[0]?.id, // 초대 ID
    }));
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
          where: { isJoined: true }, // 가입한 유저만 조회
          select: {
            userName: true, // 사용자 이름 필드
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
            id: true, // GroupUser ID
            isOwner: true, // 그룹 소유자 여부
            userId: true, // 사용자 ID
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
      id: user.id,
      userId: user.userId,
      nickname: user.user.nickname,
      isOwner: user.isOwner,
    }));

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      users: users,
      ownerId: users.find((user) => user.isOwner)?.userId,
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
          where: { isJoined: true }, // 가입한 유저만 조회
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

  // 그룹에 사용자를 초대하는 메서드
  async inviteUserToGroup(groupId: number, inviteUserDto: InviteUserDto) {
    // 사용자 코드로 사용자를 조회합니다.
    const user = await this.prisma.user.findUnique({
      where: { code: inviteUserDto.userCode },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // GroupUser에 초대 정보를 추가합니다.
    const groupUser = await this.prisma.groupUser.create({
      data: {
        groupId: groupId,
        userId: user.id,
        isJoined: false,
      },
    });
    return groupUser;
  }

  // 초대에 대한 응답을 처리하는 메서드
  async respondToInvite(inviteId: number, respondInviteDto: RespondInviteDto) {
    const invite = await this.prisma.groupUser.findUnique({
      where: { id: inviteId },
    });
    if (!invite) {
      throw new Error('Invite not found');
    }

    if (respondInviteDto.accept) {
      // 초대를 수락한 경우 isJoined를 true로 변경합니다.
      await this.prisma.groupUser.update({
        where: { id: inviteId },
        data: { isJoined: true },
      });
    } else {
      // 초대를 거절한 경우 초대 정보를 삭제합니다.
      await this.prisma.groupUser.delete({
        where: { id: inviteId },
      });
    }

    return true;
  }

  // 그룹에서 사용자를 강퇴하는 메서드
  async removeUserFromGroup(groupId: number, inviteId: number) {
    // GroupUser에서 사용자 정보를 삭제합니다.
    await this.prisma.groupUser.deleteMany({
      where: {
        groupId: groupId,
        id: inviteId,
      },
    });
    return true;
  }

  // 그룹을 삭제하는 메서드
  async deleteGroup(groupId: number) {
    // GroupUser에서 그룹에 속한 사용자 정보를 삭제합니다.
    await this.prisma.groupUser.deleteMany({
      where: { groupId: groupId },
    });

    // Group을 삭제합니다.
    await this.prisma.group.delete({
      where: { id: groupId },
    });

    return true;
  }
}
