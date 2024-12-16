import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwtToken(payload: { userId: number; email: string }): string {
    // Refresh Token 생성
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '365d' }); // Refresh Token 만료 시간 (1년)

    // Access Token에 Refresh Token 포함
    return this.jwtService.sign(
      { ...payload, refreshToken },
      { expiresIn: '1h' }, // Access Token 만료 시간 (1시간)
    );
  }

  verifyJwtToken(token: string): any {
    return this.jwtService.verify(token); // 토큰 검증
  }
}
