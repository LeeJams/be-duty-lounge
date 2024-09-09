import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async saveFiles(files: Express.Multer.File[], postId: number) {
    // postId 추가
    const savedFiles = [];

    for (const file of files) {
      const savedFile = await this.prisma.file.create({
        data: {
          url: file.filename, // 파일 경로
          fileType: file.mimetype, // 파일 타입
          fileSize: file.size, // 파일 크기
          postId, // 필수로 전달되는 게시글 ID
        },
      });
      savedFiles.push(savedFile); // 생성된 파일을 배열에 추가
    }

    return savedFiles; // 생성된 파일 정보 배열을 반환
  }
}
