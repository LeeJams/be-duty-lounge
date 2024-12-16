import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Get,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Auth } from 'src/common/decoration/auth';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 작성
  @Post()
  @Auth()
  async createComment(
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId = req.user.userId; // JWT에서 추출된 userId 사용
    return this.commentService.createComment(userId, createCommentDto);
  }

  // 특정 게시글의 댓글 조회
  @Get('post/:postId')
  async getCommentsByPost(@Param('postId') postId: string) {
    return this.commentService.getCommentsByPost(Number(postId));
  }

  // 댓글 수정
  @Put(':commentId')
  @Auth()
  async updateComment(
    @Request() req,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userId = req.user.userId; // JWT에서 추출된 userId 사용
    return this.commentService.updateComment(
      userId,
      Number(commentId),
      updateCommentDto,
    );
  }

  // 댓글 삭제
  @Delete(':commentId')
  @Auth()
  async deleteComment(@Request() req, @Param('commentId') commentId: string) {
    const userId = req.user.userId; // JWT에서 추출된 userId 사용
    return this.commentService.deleteComment(userId, Number(commentId));
  }
}
