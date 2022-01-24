import { IsString } from 'class-validator';

export class CreatePostCategoryDto {
  @IsString()
  title: string;
}
