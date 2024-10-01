import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async saveFiles(files: Express.Multer.File[], postId: number) {
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

  // 파일 경로 리스트를 받아 파일 시스템에서 삭제하는 메서드
  async deleteFilesByPaths(filePaths: string[]) {
    filePaths.forEach((filePath) => {
      const fullPath = path.join(__dirname, '../../../uploads', filePath); // 파일의 전체 경로 설정
      this.deleteFileFromSystem(fullPath);
    });
    return { message: 'Files deleted successfully', deletedPaths: filePaths };
  }

  // 파일 시스템에서 파일 삭제하는 헬퍼 메서드
  private deleteFileFromSystem(filePath: string) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      } else {
        console.log(`Successfully deleted file: ${filePath}`);
      }
    });
  }
}
