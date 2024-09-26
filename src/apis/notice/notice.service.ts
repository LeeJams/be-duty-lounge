import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoticeService {
  constructor(private prisma: PrismaService) {}

  // 공지사항 전체 조회
  async getAllNotices() {
    return this.prisma.notice.findMany({
      orderBy: {
        createdAt: 'desc', // 최신순으로 정렬
      },
    });
  }

  // 최신 공지사항 조회
  async getLatestNotice() {
    const latestNotice = await this.prisma.notice.findFirst({
      orderBy: {
        createdAt: 'desc', // 최신 공지사항
      },
    });
    return latestNotice;
  }
}
