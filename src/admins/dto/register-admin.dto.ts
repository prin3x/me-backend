import { IsString } from 'class-validator';

export class RegisterAdminDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
