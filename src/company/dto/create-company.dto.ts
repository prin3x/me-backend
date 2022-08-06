import { IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  company: string;
}
