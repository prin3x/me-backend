import { IsOptional, IsString } from 'class-validator';
import { CONTACT_STATUS } from 'staff-contacts/entities/staff-contact.entity';

export class CreateStaffContactDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  department: string;

  @IsOptional()
  @IsString()
  division: string;

  @IsOptional()
  @IsString()
  ipPhone: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  status: CONTACT_STATUS;

  @IsOptional()
  @IsString()
  birthDate: string;
}
