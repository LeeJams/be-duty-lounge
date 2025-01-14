import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: { userId: number; email: string }): string {
    // Access Token 생성
    return this.jwtService.sign(payload, { expiresIn: '1h' }); // Access Token 만료 시간 (1시간)
  }

  generateRefreshToken(payload: { userId: number; email: string }): string {
    // Refresh Token 생성
    return this.jwtService.sign(payload, { expiresIn: '30d' }); // Refresh Token 만료 시간 (30일)
  }

  generateJwtTokens(payload: { userId: number; email: string }): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  verifyJwtToken(token: string): any {
    return this.jwtService.verify(token); // 토큰 검증
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Refresh Token 검증
      const decoded = this.jwtService.verify(refreshToken); // 비밀키는 환경변수로 관리하세요.
      const payload = { userId: decoded.userId, email: decoded.email };

      // 새로운 Access Token과 Refresh Token 발급
      const accessToken = this.generateAccessToken(payload);
      const newRefreshToken = this.generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.log('error in refresh token', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
