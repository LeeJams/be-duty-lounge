import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../apis/auth/guards/jwt-auth.guard';

export function Auth() {
  return applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard));
}
