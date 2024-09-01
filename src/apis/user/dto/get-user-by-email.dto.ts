import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserByEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Auth provider is required' })
  authProvider: string;
}
