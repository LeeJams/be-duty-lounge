import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        'Refresh token is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const tokens = await this.authService.refreshTokens(refreshToken);
      return tokens;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(error.message, HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
