import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // JWT 비밀 키 설정
      signOptions: { expiresIn: '1h' }, // 토큰 만료 시간 설정
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
