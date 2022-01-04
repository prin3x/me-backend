import { Module } from '@nestjs/common';
import { PostCategoriesService } from './post-categories.service';
import { PostCategoriesController } from './post-categories.controller';

@Module({
  controllers: [PostCategoriesController],
  providers: [PostCategoriesService]
})
export class PostCategoriesModule {}
