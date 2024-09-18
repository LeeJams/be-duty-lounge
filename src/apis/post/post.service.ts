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
    const skip = (page - 1) * size;
    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: size,
        orderBy: {
          createdAt: 'desc',
        },
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

  // 게시글 상세 조회 (조회수 증가 및 좋아요/저장 여부 확인)
  async getPostDetail(postId: number, userId: number) {
    // 게시글 조회 및 관계 데이터 포함
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
        files: true,
        likedBy: {
          select: { id: true }, // 좋아요한 유저의 ID만 가져옴
        },
        savedBy: {
          select: { id: true }, // 저장한 유저의 ID만 가져옴
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 조회수 1 증가
    await this.prisma.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // 유저가 해당 게시글에 좋아요를 눌렀는지 확인
    const hasLiked = post.likedBy.some((user) => user.id === userId);

    // 유저가 해당 게시글을 저장했는지 확인
    const hasSaved = post.savedBy.some((user) => user.id === userId);

    const baseUrl = 'http://localhost:3000'; // Adjust this based on your deployment

    return {
      ...post,
      userNickname: post.user.nickname,
      files: post.files.map((file) => ({
        ...file,
        url: `${baseUrl}/uploads/${file.url}`, // 파일의 전체 URL을 반환
      })),
      hasLiked, // 유저가 좋아요를 눌렀는지 여부
      hasSaved, // 유저가 저장했는지 여부
    };
  }

  // 좋아요 토글 기능
  async toggleLikePost(postId: number, userId: number): Promise<boolean> {
    // 유저가 게시글에 좋아요를 눌렀는지 확인
    const userHasLiked = await this.prisma.post.findFirst({
      where: {
        id: postId,
        likedBy: {
          some: { id: userId },
        },
      },
    });

    if (userHasLiked) {
      // 좋아요 취소
      await this.prisma.post.update({
        where: { id: postId },
        data: {
          likedBy: {
            disconnect: { id: userId },
          },
          likes: {
            decrement: 1,
          },
        },
      });
      return false; // 좋아요 취소
    } else {
      // 좋아요 추가
      await this.prisma.post.update({
        where: { id: postId },
        data: {
          likedBy: {
            connect: { id: userId },
          },
          likes: {
            increment: 1,
          },
        },
      });
      return true; // 좋아요 추가
    }
  }

  // 게시글 저장 토글 기능
  async toggleSavePost(postId: number, userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { savedPosts: true },
    });

    const isPostSaved = user?.savedPosts.some((post) => post.id === postId);

    if (isPostSaved) {
      // 저장된 게시글을 취소
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          savedPosts: {
            disconnect: { id: postId },
          },
        },
      });

      return false; // 저장 취소된 경우
    } else {
      // 게시글 저장
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          savedPosts: {
            connect: { id: postId },
          },
        },
      });

      return true; // 저장된 경우
    }
  }
}
