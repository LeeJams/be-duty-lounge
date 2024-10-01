import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Prisma 서비스 주입
import { CreateReportDto } from './dto/create-report.dto'; // 신고 생성 DTO
import { Report } from '@prisma/client'; // Prisma 클라이언트 타입

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  // 신고 생성 함수
  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    const { userId, postId, commentId, reason } = createReportDto;

    // 동일한 사용자, 게시글, 댓글 조합에 대한 중복 신고 체크
    const existingReport = await this.prisma.report.findFirst({
      where: {
        userId,
        postId: postId ? postId : undefined, // postId가 존재하면 체크
        commentId: commentId ? commentId : undefined, // commentId가 존재하면 체크
      },
    });

    if (existingReport) {
      throw new ConflictException('이미 신고된 게시글 또는 댓글입니다.');
    }

    // 중복 신고가 없을 때만 신고 생성
    return this.prisma.report.create({
      data: {
        userId,
        postId,
        commentId,
        reason,
      },
    });
  }

  // 신고된 게시글 또는 댓글 조회 함수
  async getReports(): Promise<Report[]> {
    return this.prisma.report.findMany({
      include: {
        user: true,
        post: true,
        comment: true,
      },
    });
  }

  // 특정 신고 조회 함수
  async getReportById(reportId: number): Promise<Report> {
    return this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        user: true,
        post: true,
        comment: true,
      },
    });
  }

  // 신고 삭제 함수
  async deleteReport(reportId: number): Promise<void> {
    await this.prisma.report.delete({
      where: { id: reportId },
    });
  }
}
