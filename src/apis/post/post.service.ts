import { Injectable, NotFoundException } from '@nestjs/common';
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
        userId: Number(createPostDto.userId),
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

  async getPosts(page: number = 1, size: number = 30) {
    console.log('getPosts');
    const skip = (page - 1) * size;
    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: size,
        include: {
          _count: {
            select: {
              comments: true, // To get the comment count
            },
          },
          user: {
            select: {
              nickname: true, // To get the user's nickname
            },
          },
        },
      }),
      this.prisma.post.count(),
    ]);

    return {
      posts: posts.map((post) => ({
        ...post,
        commentCount: post._count.comments, // Include the comment count in the response
      })),
      totalPages: Math.ceil(totalCount / size),
      currentPage: page,
    };
  }

  async getPostDetail(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                nickname: true,
              },
            },
          },
        },
        files: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const baseUrl = 'http://localhost:3000'; // Adjust this based on your deployment

    return {
      ...post,
      userNickname: post.user.nickname,
      comments: post.comments.map((comment) => ({
        ...comment,
        userNickname: comment.user.nickname,
      })),
      files: post.files.map((file) => ({
        ...file,
        url: `${baseUrl}/uploads/${file.url}`, // Append the full URL for accessing the image
      })),
    };
  }
}
