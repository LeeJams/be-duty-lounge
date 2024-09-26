import { Controller, Get } from '@nestjs/common';
import { NoticeService } from './notice.service';

@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // 공지사항 전체 조회
  @Get()
  async getAllNotices() {
    return this.noticeService.getAllNotices();
  }

  // 최신 공지사항 조회
  @Get('latest')
  async getLatestNotice() {
    return this.noticeService.getLatestNotice();
  }
}
