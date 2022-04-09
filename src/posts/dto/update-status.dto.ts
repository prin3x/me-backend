import { IsEnum } from 'class-validator';
import { POST_STATUS } from 'posts/entities/post.entity';

export class UpdateStatus {
  @IsEnum(POST_STATUS)
  status: POST_STATUS;
}
