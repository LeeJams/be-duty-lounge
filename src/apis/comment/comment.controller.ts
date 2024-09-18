import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Get,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 작성
  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  // 특정 게시글의 댓글 조회
  @Get('post/:postId')
  async getCommentsByPost(@Param('postId') postId: string) {
    return this.commentService.getCommentsByPost(Number(postId));
  }

  // 댓글 수정
  @Put(':id')
  async updateComment(
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(
      Number(commentId),
      updateCommentDto,
    );
  }

  // 댓글 삭제
  @Delete(':id')
  async deleteComment(
    @Param('id') commentId: string,
    @Body('userId') userId: number,
  ) {
    return this.commentService.deleteComment(Number(commentId), userId);
  }
}
