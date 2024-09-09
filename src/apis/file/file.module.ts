import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService],
  exports: [FileService], // 다른 모듈에서 사용할 수 있도록 exports
})
export class FileModule {}
