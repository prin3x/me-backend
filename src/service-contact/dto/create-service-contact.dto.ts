import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateServiceContactDto {
  @IsString()
  objective: string;

  @IsString()
  contactID: string;

  @IsOptional()
  @IsString()
  contactPhoneNumber: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsNumberString()
  categoryId: number;

  @IsNumber()
  index: number;
}
