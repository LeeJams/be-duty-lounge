import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    const group = await this.groupService.createGroup(createGroupDto);
    return group;
  }

  // 사용자의 그룹 리스트 조회
  @Get(':userId')
  async getUserGroups(@Param('userId') userId: string) {
    const groups = await this.groupService.getGroupsByUserId(Number(userId));
    return groups;
  }

  // 특정 그룹의 디테일 정보 조회
  @Get(':groupId/details')
  async getGroupDetail(@Param('groupId') groupId: string) {
    return this.groupService.getGroupDetail(Number(groupId));
  }

  // 그룹에 속한 인원의 스케줄 조회
  @Get(':groupId/schedules')
  async getGroupSchedules(
    @Param('groupId') groupId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.groupService.getGroupSchedules(
      Number(groupId),
      Number(year),
      Number(month),
    );
  }
}
