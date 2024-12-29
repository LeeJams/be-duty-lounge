import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  Request,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { RespondInviteDto } from './dto/respond-invite.dto';
import { Auth } from 'src/common/decoration/auth';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // 그룹 생성 API
  @Post()
  @Auth()
  async createGroup(@Request() req, @Body() createGroupDto: CreateGroupDto) {
    const userId = req.user.userId; // JWT에서 추출한 userId 사용
    return this.groupService.createGroup(userId, createGroupDto);
  }

  // 사용자의 그룹 리스트 조회
  @Get()
  @Auth()
  async getUserGroups(@Request() req) {
    const userId = req.user.userId; // JWT에서 추출한 userId 사용
    return this.groupService.getGroupsByUserId(userId);
  }

  // 특정 그룹의 디테일 정보 조회
  @Get(':groupId/details')
  @Auth()
  async getGroupDetail(@Request() req, @Param('groupId') groupId: string) {
    const userId = req.user.userId;
    return this.groupService.getGroupDetail(userId, Number(groupId));
  }

  // 그룹에 속한 인원의 스케줄 조회
  @Get(':groupId/schedules')
  @Auth()
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

  // 그룹에 대한 초대 API
  @Post(':groupId/invite')
  @Auth()
  async inviteUserToGroup(
    @Param('groupId') groupId: string,
    @Body() inviteUserDto: InviteUserDto,
  ) {
    return this.groupService.inviteUserToGroup(Number(groupId), inviteUserDto);
  }

  // 초대받은 사용자가 초대를 수락 또는 거절하는 API
  @Patch('invite/:inviteId')
  @Auth()
  async respondToInvite(
    @Param('inviteId') inviteId: string,
    @Body() respondInviteDto: RespondInviteDto,
  ) {
    return this.groupService.respondToInvite(
      Number(inviteId),
      respondInviteDto,
    );
  }

  // 그룹에서 사용자를 강퇴하는 API
  @Delete(':groupId/users/:inviteId')
  @Auth()
  async removeUserFromGroup(
    @Param('groupId') groupId: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.groupService.removeUserFromGroup(
      Number(groupId),
      Number(inviteId),
    );
  }

  // 그룹을 삭제하는 API
  @Delete(':groupId')
  @Auth()
  async deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.deleteGroup(Number(groupId));
  }
}
