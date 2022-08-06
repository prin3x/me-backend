import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { POST_STATUS } from 'posts/entities/post.entity';

export class CreatePostDto {
  @IsOptional()
  image: any;

  @IsOptional()
  homeImage: any;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsString()
  status: POST_STATUS;

  @IsOptional()
  @IsString()
  tag: string;

  @IsString()
  categoryName: string;

  @IsString()
  postBy: string;

  @IsString()
  isSameImage: string;
}
