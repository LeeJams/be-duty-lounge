import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Patch,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { Auth } from 'src/common/decoration/auth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() userDto: UserDto) {
    const { user, token, refreshToken } = await this.userService.login(userDto);
    return { user, token, refreshToken };
  }

  @Get()
  @Auth()
  async getUserById(@Request() req): Promise<User | null> {
    const userId = req.user.userId; // 토큰에서 추출된 userId 사용
    return this.userService.getUserById(userId);
  }

  @Put()
  @Auth()
  async updateUserNickname(@Request() req, @Body('nickname') nickname: string) {
    const userId = req.user.userId; // 토큰에서 추출된 userId 사용
    return this.userService.updateUserNickname(userId, nickname);
  }

  @Delete()
  @Auth()
  async deleteUser(@Request() req) {
    const userId = req.user.userId; // 토큰에서 추출된 userId 사용
    return this.userService.deleteUser(userId);
  }

  @Get('/company')
  @Auth()
  async getCompanyList() {
    return this.userService.getCompanyList();
  }

  @Patch('/company')
  @Auth()
  async updateCompany(
    @Request() req,
    @Body() body: { code: string; companyId: string },
  ) {
    const userId = req.user.userId; // 토큰에서 추출된 userId 사용
    const { code, companyId } = body;
    return this.userService.authenticateAndUpdateCompany(
      userId,
      code,
      Number(companyId),
    );
  }
}
