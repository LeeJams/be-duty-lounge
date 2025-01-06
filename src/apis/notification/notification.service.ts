import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  private notificationMessages = {
    group_invite: {
      title: '그룹 초대 알림',
      path: '/schedule/group/list',
    },
    group_kick: {
      title: '그룹 강퇴 알림',
      path: '',
    },
    comment: {
      title: '댓글 알림',
      path: '/post/',
    },
  };

  async createNotification(
    userId: number,
    type: 'group_invite' | 'group_kick' | 'comment',
    msg: string,
    relatedId?: number,
  ) {
    const message = this.notificationMessages[type];
    if (!message) {
      throw new Error('유효하지 않은 알림 타입입니다.');
    }

    const data: any = {
      userId,
      type,
      title: message.title,
      content: msg,
      path: message.path,
    };

    if (type === 'group_invite' || type === 'group_kick') {
      data.groupId = relatedId;
    } else if (type === 'comment') {
      data.postId = relatedId;
      data.path = message.path + relatedId;
    }

    return this.prisma.notification.create({
      data,
    });
  }

  // 알림 조회
  async getNotifications(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 알림 읽음 처리
  async markAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId: userId },
      data: { isRead: true },
    });
  }

  // 읽지 않은 알림이 있는지 확인
  async getIsUnreadMessage(userId: number) {
    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return unreadCount > 0;
  }
}
