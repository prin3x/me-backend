import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { S3Service } from 's3/s3.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import {
  ListBasicOperationPost,
  ListQueryParamsPostDTO,
} from './dto/get-post.dto';
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
    newsInsance.categoryName = createPostDto.categoryName;
    newsInsance.tag = createPostDto.tag;
    // mock
    newsInsance.adminId = 1;
    newsInsance.slug = `${nanoid(12)}`;

    try {
      const key: any = await this.s3Service.uploadImagesS3(createPostDto.image);

      newsInsance.imageUrl = key;
      res = await this.repo.save(newsInsance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async findAll(opt: ListBasicOperationPost) {
    let res;
    try {
      res = await this.repo
        .createQueryBuilder('posts')
        .where('(posts.categoryName LIKE :categoryName)', {
          categoryName: `%${opt.categoryName}%`,
        })
        .andWhere('(posts.title LIKE :search)', {
          search: `%${opt.search}%`,
        })
        .skip(opt.skip)
        .take(opt.limit)
        .getManyAndCount();
    } catch (e) {
      throw new BadRequestException(e);
    }

    const rtn = {
      items: res?.[0],
      itemCount: res?.[0]?.length,
      total: res?.[1],
      page: opt.page,
    };

    return rtn;
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
    newsInsance.categoryName = updatePostDto.categoryName;
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

  parseQueryString(q: ListQueryParamsPostDTO): ListBasicOperationPost {
    const rtn: ListBasicOperationPost = {
      page: +q?.page || 1,
      limit: +q?.limit ? (+q?.limit > 100 ? 100 : +q?.limit) : 10,
      skip: (q?.page - 1) * q?.limit,
      orderBy: q?.orderBy || 'id',
      order: 'ASC',
      search: q?.search ? q?.search.trim() : '',
      categoryName: q?.categoryName ? q?.categoryName.trim() : '',
    };

    q.order = q?.order ? q?.order.toUpperCase() : '';
    rtn.order = q?.order != 'ASC' && q?.order != 'DESC' ? 'DESC' : q?.order;
    rtn.skip = (rtn.page - 1) * rtn.limit;

    return rtn;
  }
}
