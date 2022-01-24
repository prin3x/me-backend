import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostCategoryDto } from './dto/create-post-category.dto';
import { UpdatePostCategoryDto } from './dto/update-post-category.dto';
import { PostCategory } from './entities/post-category.entity';

@Injectable()
export class PostCategoriesService {
  constructor(
    @InjectRepository(PostCategory)
    private repo: Repository<PostCategory>,
  ) {}

  async create(createPostCategoryDto: CreatePostCategoryDto) {
    const category = new PostCategory();
    category.title = createPostCategoryDto.title;

    return await this.repo.save(category);
  }

  async findAll() {
    return await this.repo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} postCategory`;
  }

  update(id: number, updatePostCategoryDto: UpdatePostCategoryDto) {
    return `This action updates a #${id} postCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} postCategory`;
  }
}
