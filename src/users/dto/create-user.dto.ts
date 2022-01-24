import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
