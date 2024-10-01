import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReportDto {
  @IsInt()
  userId: number;

  @IsInt()
  @IsOptional()
  postId?: number;

  @IsInt()
  @IsOptional()
  commentId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
