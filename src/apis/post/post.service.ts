import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FileService } from '../file/file.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    // 1. 게시글을 먼저 생성하여 postId를 얻음
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        userId: userId,
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

  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    // 1. 기존 게시물 가져오기
    const existingPost = await this.prisma.post.findUnique({
      where: { id: postId, userId },
      include: { files: true }, // 기존 파일 정보도 가져오기
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    // 2. 게시물 업데이트 (제목, 내용)
    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        title: updatePostDto.title ?? existingPost.title,
        content: updatePostDto.content ?? existingPost.content,
      },
    });

    // 3. 삭제된 파일 처리
    const numberOfDeletedFiles =
      updatePostDto.deletedFileIds?.map(Number) || [];
    if (numberOfDeletedFiles.length > 0) {
      // 3-1. 데이터베이스에서 삭제하기 전에 파일 경로를 미리 가져오기
      const filesToDelete = existingPost.files.filter((file) =>
        numberOfDeletedFiles.includes(file.id),
      );

      // 3-2. 데이터베이스에서 파일 정보 삭제
      await this.prisma.file.deleteMany({
        where: {
          id: { in: numberOfDeletedFiles },
        },
      });

      // 3-3. 파일 시스템에서 파일 삭제 (deleteFilesByIds 호출 전에 파일 정보 전달)
      await this.fileService.deleteFilesByPaths(
        filesToDelete.map((file) => file.url),
      );
    }

    // 4. 새로운 파일이 있으면 파일을 저장하고 연결
    let uploadedFiles = [];
    if (files && files.length > 0) {
      uploadedFiles = await this.fileService.saveFiles(files, postId);
    }

    // 5. 기존 파일과 새 파일 병합 (삭제된 파일 제외)
    const remainingFiles = existingPost.files.filter(
      (file) => !numberOfDeletedFiles.includes(file.id),
    );

    const allFiles = [...remainingFiles, ...uploadedFiles];

    // 6. 게시물과 파일 관계 업데이트 (기존 파일 제거 없이 새 파일 추가)
    if (allFiles.length > 0) {
      await this.prisma.post.update({
        where: { id: postId },
        data: {
          files: {
            connect: allFiles.map((file) => ({ id: file.id })), // 삭제되지 않은 파일과 새로 추가된 파일을 연결
          },
        },
      });
    }

    return updatedPost;
  }

  async getPosts(
    page: number = 1,
    size: number = 30,
    search: string,
    userId?: string,
  ) {
    const skip = (page - 1) * size;

    // 기본적으로 title과 content에서 검색어가 포함된 것을 찾기 위한 조건
    const whereCondition: any = {
      OR: [{ title: { contains: search } }, { content: { contains: search } }],
      deleteYn: false, // 삭제되지 않은 게시글만 가져오기
    };

    // userId가 있는 경우, AND 조건으로 userId를 추가
    if (userId) {
      whereCondition.AND = { userId: userId };
    }

    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: size,
        where: whereCondition, // 검색 조건 추가
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: {
              comments: true, // 댓글 수
            },
          },
          user: {
            select: {
              nickname: true, // 작성자 닉네임
              company: true, // 작성자 회사 정보
            },
          },
        },
      }),
      this.prisma.post.count({
        where: whereCondition, // 검색어에 따른 게시물 수 계산
      }),
    ]);

    return {
      posts: posts || [],
      totalPages: Math.ceil(totalCount / size),
      currentPage: page,
    };
  }

  async getSavedPosts(userId: number, page: number = 1, size: number = 100) {
    const skip = (page - 1) * size;

    // 유저가 저장한 게시글 가져오기
    const savedPosts = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        savedPosts: {
          skip,
          take: size,
          orderBy: { createdAt: 'desc' },
          where: { deleteYn: false }, // 삭제되지 않은 게시글만 가져오기
          include: {
            user: { select: { nickname: true } }, // 게시글 작성자 정보 포함
            _count: { select: { comments: true } }, // 댓글 수 포함
          },
        },
      },
    });

    // 유저가 저장한 게시글 전체 수 가져오기
    const totalSavedPosts = await this.prisma.post.count({
      where: {
        savedBy: {
          some: { id: userId }, // 유저가 저장한 게시글 필터링
        },
      },
    });

    return {
      posts: savedPosts?.savedPosts || [],
      totalPages: Math.ceil(totalSavedPosts / size),
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

  async deletePost(postId: number, userId: number) {
    const post = await this.prisma.post.update({
      where: { id: postId, userId },
      data: {
        deleteYn: true,
      },
    });
    return post ? true : false;
  }
}
