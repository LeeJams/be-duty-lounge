import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FileService } from '../file/file.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async createPost(createPostDto: CreatePostDto, files: Express.Multer.File[]) {
    // 1. 게시글을 먼저 생성하여 postId를 얻음
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        userId: createPostDto.userId,
      },
    });

    // 2. 파일이 있으면 해당 postId를 사용하여 파일 정보 저장
    const uploadedFiles = files
      ? await this.fileService.saveFiles(files, post.id)
      : [];

    // 3. 게시글과 파일을 연결 (생성된 파일을 게시글에 연결)
    await this.prisma.post.update({
      where: { id: post.id },
      data: {
        files: {
          connect: uploadedFiles.map((file) => ({ id: file.id })), // 파일을 게시글과 연결
        },
      },
    });

    return post;
  }
}
