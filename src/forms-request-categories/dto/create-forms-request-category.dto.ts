import { IsString } from 'class-validator';

export class CreateFormsRequestCategoryDto {
  @IsString()
  title: string;
}
