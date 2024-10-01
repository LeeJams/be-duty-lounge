import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto'; // 신고 생성 DTO

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // 신고 생성 엔드포인트
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReport(@Body() createReportDto: CreateReportDto) {
    return this.reportService.createReport(createReportDto);
  }

  // 모든 신고 조회 엔드포인트
  @Get()
  async getAllReports() {
    return this.reportService.getReports();
  }

  // 특정 신고 조회 엔드포인트
  @Get(':id')
  async getReport(@Param('id') id: string) {
    return this.reportService.getReportById(Number(id));
  }

  // 신고 삭제 엔드포인트
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReport(@Param('id') id: string) {
    return this.reportService.deleteReport(Number(id));
  }
}
