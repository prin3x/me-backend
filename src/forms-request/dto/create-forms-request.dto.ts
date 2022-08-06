import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFormsRequestDto {
  @IsString()
  content: string;

  @IsString()
  downloadLink: string;

  @IsNumberString()
  categoryId: number;

  @IsOptional()
  file: any;

  @IsNumber()
  index: number;
}
