import { ADMIN_ROLES } from 'auth/roles.guard';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RegisterAdminDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(ADMIN_ROLES)
  role: ADMIN_ROLES;
}
