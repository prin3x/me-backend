import { Module } from '@nestjs/common';
import { PostCategoriesService } from './post-categories.service';
import { PostCategoriesController } from './post-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCategory } from './entities/post-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory])],
  controllers: [PostCategoriesController],
  providers: [PostCategoriesService],
})
export class PostCategoriesModule {}
