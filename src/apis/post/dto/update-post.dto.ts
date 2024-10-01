import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  userId: string; // 작성자 ID

  @IsOptional() // 삭제된 파일은 선택적 필드로 지정
  @IsArray() // 배열 타입 지정
  @IsString({ each: true }) // 배열의 각 요소가 문자열 타입
  deletedFileIds?: string[]; // 삭제된 파일의 ID 리스트 (선택적)
}
