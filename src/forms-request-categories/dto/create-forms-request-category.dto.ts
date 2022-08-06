import { IsNumber, IsString } from 'class-validator';

export class CreateFormsRequestCategoryDto {
  @IsString()
  title: string;

  @IsNumber()
  index: number;
}
