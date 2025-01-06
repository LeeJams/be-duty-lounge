import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService, // 알림 서비스 주입
  ) {}

  // 댓글 작성
  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    const { postId, content } = createCommentDto;

    // 게시글 소유자 확인
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }, // 게시글 작성자 ID만 조회
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 댓글 작성
    const comment = await this.prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
    });

    // 자기 자신의 글이 아닌 경우 알림 생성
    if (post.userId !== userId) {
      const notificationContent =
        content.length > 15 ? content.slice(0, 15) + '...' : content;
      await this.notificationService.createNotification(
        post.userId,
        'comment',
        notificationContent, // 댓글 내용의 앞 15자만 알림 메시지로 사용
        postId,
      );
    }

    return comment;
  }

  // 특정 게시글의 댓글 조회
  async getCommentsByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // 댓글을 작성 순으로 조회
      },
    });
  }

  // 댓글 수정
  async updateComment(
    userId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const { content } = updateCommentDto;
    const existingComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment || existingComment.userId !== userId) {
      throw new NotFoundException('Comment not found or unauthorized');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content,
      },
    });
  }

  // 댓글 삭제
  async deleteComment(userId: number, commentId: number) {
    const comment = await this.prisma.comment.delete({
      where: { id: commentId, userId },
    });

    if (!comment) {
      return false;
    }
    return true;
  }
}
