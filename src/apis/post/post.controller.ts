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
  Delete,
  Put,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth } from 'src/common/decoration/auth';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth()
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
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.postService.createPost(createPostDto, files, userId);
  }

  @Put(':postId')
  @Auth()
  @HttpCode(HttpStatus.OK)
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
  async updatePost(
    @Param('postId') postId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.postService.updatePost(
      Number(postId),
      updatePostDto,
      files,
      userId,
    );
  }

  @Get()
  @Auth()
  async getPosts(
    @Query('page') page: number = 1,
    @Query('size') size: number = 30,
    @Query('search') search: string,
  ) {
    return this.postService.getPosts(Number(page), Number(size), search);
  }

  @Get('/my')
  @Auth()
  async getMyPosts(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('size') size: number = 30,
  ) {
    const userId = req.user.userId;
    return this.postService.getPosts(Number(page), Number(size), '', userId);
  }

  @Get('saved')
  @Auth()
  async getSavedPosts(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('size') size: number = 30,
  ) {
    const userId = req.user.userId;
    return this.postService.getSavedPosts(userId, Number(page), Number(size));
  }

  @Get(':postId')
  @Auth()
  async getPostDetail(@Param('postId') postId: string, @Request() req) {
    const userId = req.user.userId;
    return this.postService.getPostDetail(Number(postId), userId);
  }

  @Post(':postId/like')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async toggleLikePost(@Param('postId') postId: string, @Request() req) {
    const userId = req.user.userId;
    return this.postService.toggleLikePost(Number(postId), userId);
  }

  @Post(':postId/save')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async toggleSavePost(
    @Param('postId') postId: string,
    @Request() req,
  ): Promise<boolean> {
    const userId = req.user.userId;
    return this.postService.toggleSavePost(Number(postId), userId);
  }

  @Delete(':postId')
  @Auth()
  async deletePost(@Param('postId') postId: string, @Request() req) {
    const userId = req.user.userId;
    return this.postService.deletePost(Number(postId), userId);
  }
}
