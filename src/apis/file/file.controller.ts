import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads', // 파일 저장 경로 설정
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body('postId') postId: number, // 게시글 ID를 요청 본문에서 받음
  ) {
    if (!postId) {
      throw new Error('postId is required');
    }

    return this.fileService.saveFiles(files?.files, postId); // postId 전달
  }
}
