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
  ) {
    return this.postService.getPosts(page, size);
  }

  @Get(':id')
  async getPostDetail(@Param('id') id: string) {
    return this.postService.getPostDetail(Number(id));
  }
}
