import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetUserByEmailDto } from './dto/get-user-by-email.dto';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() userDto: UserDto) {
    const { user, token } = await this.userService.login(userDto);
    return { user, token };
  }

  @Get()
  async getUserByEmail(
    @Query() query: GetUserByEmailDto,
  ): Promise<User | null> {
    return this.userService.getUserByEmail(query);
  }
}
