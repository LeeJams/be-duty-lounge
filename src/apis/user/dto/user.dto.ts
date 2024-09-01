import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  authProvider: string;

  @IsString()
  authProviderId: string;

  @IsOptional()
  @IsString()
  nickname?: string; // 선택적 필드로 설정
}
