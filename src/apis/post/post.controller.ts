import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createPost(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto, // 여기서 FormData가 전달될 것으로 기대
  ) {
    return this.postService.createPost(createPostDto, files);
  }

  @Get()
  async getPosts(
    @Query('page') page: number = 1,
    @Query('size') size: number = 30,
    @Query('search') search: string,
  ) {
    return this.postService.getPosts(Number(page), Number(size), search);
  }

  @Get('saved')
  async getSavedPosts(
    @Query('userId') userId: number,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return this.postService.getSavedPosts(
      Number(userId),
      Number(page),
      Number(size),
    );
  }

  // 게시글 상세 조회 (조회수 증가, 좋아요/저장 여부 확인)
  @Get(':id')
  async getPostDetail(
    @Param('id') postId: string,
    @Query('userId') userId: string,
  ) {
    return this.postService.getPostDetail(Number(postId), Number(userId));
  }

  // 좋아요 토글 엔드포인트
  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  async toggleLikePost(
    @Param('id') postId: string,
    @Body('userId') userId: number,
  ) {
    return this.postService.toggleLikePost(Number(postId), userId);
  }

  // 게시글 저장 토글 엔드포인트
  @Post(':id/save')
  @HttpCode(HttpStatus.OK)
  async toggleSavePost(
    @Param('id') postId: string,
    @Body('userId') userId: number,
  ): Promise<boolean> {
    return this.postService.toggleSavePost(Number(postId), userId);
  }
}
