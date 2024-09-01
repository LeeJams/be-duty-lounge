import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwtToken(payload: { userId: number; email: string }): string {
    return this.jwtService.sign(payload);
  }
}
