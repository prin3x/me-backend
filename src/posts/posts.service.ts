import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import * as path from 'path';
import { S3Service } from 's3/s3.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private repo: Repository<Post>,
    private s3Service: S3Service,
  ) {}
  async create(createPostDto: CreatePostDto) {
    let res;

    const newsInsance = new Post();
    newsInsance.title = createPostDto.title;
    newsInsance.content = createPostDto.content;
    newsInsance.categoryId = createPostDto.categoryId;
    // mock
    newsInsance.adminId = 1;
    newsInsance.slug = `${createPostDto.title.split(' ').join('-')}-${nanoid(
      6,
    )}`;

    try {
      const key: any = await this.s3Service.uploadImagesS3(createPostDto.image);

      newsInsance.imageUrl = key;
      res = await this.repo.save(newsInsance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async findAll() {
    return await this.repo.find();
  }

  async findByCategoryId(_id: string) {
    return await this.repo.find({ where: { categoryId: _id } });
  }

  async findOne(slug: string) {
    return await this.repo.findOne({ slug });
  }

  async update(slug: string, updatePostDto: UpdatePostDto) {
    let res;

    const newsInsance = await this.findOne(slug);
    newsInsance.title = updatePostDto.title;
    newsInsance.content = updatePostDto.content;
    newsInsance.categoryId = updatePostDto.categoryId;
    // mock
    newsInsance.adminId = 1;

    try {
      res = await this.repo.save(newsInsance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
