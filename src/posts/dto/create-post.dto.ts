import { IsNumber, IsOptional, IsString } from 'class-validator';
import { POST_STATUS } from 'posts/entities/post.entity';

export class CreatePostDto {
  @IsOptional()
  image: any;

  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  status: POST_STATUS;

  @IsOptional()
  @IsString()
  tag: string;

  @IsString()
  categoryName: string;
}
