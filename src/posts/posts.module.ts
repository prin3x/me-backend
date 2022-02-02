import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { S3Module } from 's3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), S3Module],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
