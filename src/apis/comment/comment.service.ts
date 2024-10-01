import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // 댓글 작성
  async createComment(createCommentDto: CreateCommentDto) {
    const { postId, content, userId } = createCommentDto;

    // 댓글 작성
    return this.prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
    });
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
  async updateComment(commentId: number, updateCommentDto: UpdateCommentDto) {
    const { userId, content } = updateCommentDto;
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
  async deleteComment(commentId: number) {
    const comment = await this.prisma.comment.delete({
      where: { id: commentId },
    });

    if (!comment) {
      return false;
    }
    return true;
  }
}
