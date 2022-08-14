import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from 'auth/auth.decorator';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import {
  ListBasicOperationPost,
  ListQueryParamsPostDTO,
} from './dto/get-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateStatus } from './dto/update-status.dto';
import { Post, POST_STATUS } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private repo: Repository<Post>,
    private config: ConfigService,
  ) {}
  async create(createPostDto: CreatePostDto, authPayload: IAuthPayload) {
    let res;
    const newsInsance = new Post();
    newsInsance.title = createPostDto.title;
    newsInsance.content = createPostDto.content;
    newsInsance.categoryName = createPostDto.categoryName;
    newsInsance.postBy = createPostDto.postBy;
    newsInsance.description = createPostDto.description;
    newsInsance.tag = createPostDto.tag;
    newsInsance.adminId = authPayload.id;
    newsInsance.slug = `${nanoid(12)}`;

    if (createPostDto.image) {
      newsInsance.imageUrl =
        this.config.get('apiAssetURL') +
        createPostDto.image?.path.replace('upload', '');
    }

    if (createPostDto.homeImage) {
      newsInsance.homeImageUrl =
        createPostDto.isSameImage === 'true'
          ? this.config.get('apiAssetURL') +
              createPostDto?.image?.path.replace('upload', '') ||
            newsInsance?.imageUrl?.replace('upload', '')
          : this.config.get('apiAssetURL') +
            createPostDto?.homeImage?.path.replace('upload', '');
    }

    try {
      res = await this.repo.save(newsInsance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async findAll(opt: ListBasicOperationPost) {
    let res, query;
    try {
      query = this.repo.createQueryBuilder('posts');
      query
        .where('(posts.status LIKE :status)', {
          status: `${POST_STATUS.ENABLED}`,
        })
        .andWhere('(posts.categoryName LIKE :categoryName)', {
          categoryName: `%${opt.categoryName}%`,
        })
        .andWhere('(posts.title LIKE :search)', {
          search: `%${opt.search}%`,
        });

      if (opt.tag) {
        query.andWhere('(posts.tag LIKE :tag)', {
          tag: `${opt.tag}`,
        });
      }
      query.orderBy(opt.orderBy, 'DESC').skip(opt.skip).take(opt.limit);

      res = await query.getManyAndCount();
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

  async findAllNoExclude(opt: ListBasicOperationPost) {
    let res, query;
    try {
      query = this.repo.createQueryBuilder('posts');
      query
        .where('(posts.categoryName LIKE :categoryName)', {
          categoryName: `%${opt.categoryName}%`,
        })
        .andWhere('(posts.title LIKE :search)', {
          search: `%${opt.search}%`,
        });

      if (opt.tag) {
        query.andWhere('(posts.tag LIKE :tag)', {
          tag: `${opt.tag}`,
        });
      }
      query.skip(opt.skip).take(opt.limit).orderBy('createdDate', 'DESC');

      res = await query.getManyAndCount();
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
    return await this.repo.find({ where: { categoryDetail: +_id } });
  }

  async findOneBySlug(slug: string) {
    let res: Post;
    try {
      res = await this.repo.findOne({ where: { slug } });
    } catch (error) {
      throw new NotFoundException('Slug Not Found');
    }

    return res;
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async update(
    slug: string,
    updatePostDto: UpdatePostDto,
    authPayload: IAuthPayload,
  ) {
    let res;

    const newsInsance = await this.repo.findOne({ where: { slug } });
    newsInsance.title = updatePostDto.title;
    newsInsance.content = updatePostDto.content;
    newsInsance.categoryName = updatePostDto.categoryName;
    newsInsance.postBy = updatePostDto.postBy;
    newsInsance.description = updatePostDto.description;
    newsInsance.tag = updatePostDto.tag;

    newsInsance.adminId = authPayload.id;
    newsInsance.slug = `${nanoid(12)}`;

    if (updatePostDto.image) {
      newsInsance.imageUrl =
        this.config.get('apiAssetURL') +
        updatePostDto.image?.path.replace('upload', '');
    }

    if (updatePostDto.homeImage) {
      newsInsance.homeImageUrl =
        updatePostDto.isSameImage === 'true'
          ? this.config.get('apiAssetURL') +
              updatePostDto?.image?.path.replace('upload', '') ||
            newsInsance?.imageUrl?.replace('upload', '')
          : this.config.get('apiAssetURL') +
            updatePostDto?.homeImage?.path.replace('upload', '');
    }

    try {
      res = await this.repo.save(newsInsance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async updateStatus(id: number, updateStatus: UpdateStatus) {
    let res;

    try {
      if (updateStatus.status === POST_STATUS.ENABLED) {
        res = this._enablePost(id);
      }
      if (updateStatus.status === POST_STATUS.DISABLED) {
        res = this._disablePost(id);
      }
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async _enablePost(id: number) {
    let res;

    const post = await this.findOne(id);
    post.status = POST_STATUS.ENABLED;

    try {
      res = await this.repo.save(post);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async _disablePost(id: number) {
    let res;

    const post = await this.findOne(id);
    post.status = POST_STATUS.DISABLED;

    try {
      res = await this.repo.save(post);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }

  async incrementReders(slug: string) {
    let res;

    const newsInsance = await this.findOneBySlug(slug);
    newsInsance.readers += 1;

    try {
      res = await this.repo.save(newsInsance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  parseQueryString(q: ListQueryParamsPostDTO): ListBasicOperationPost {
    const rtn: ListBasicOperationPost = {
      page: +q?.page || 1,
      limit: +q?.limit ? (+q?.limit > 100 ? 100 : +q?.limit) : 10,
      skip: (q?.page - 1) * q?.limit,
      orderBy: q?.orderBy || 'createdDate',
      order: 'ASC',
      search: q?.search ? q?.search.trim() : '',
      categoryName: q?.categoryName ? q?.categoryName.trim() : '',
      tag: q?.tag ? q?.tag.trim() : '',
    };

    q.order = q?.order ? q?.order.toUpperCase() : '';
    rtn.order = q?.order != 'ASC' && q?.order != 'DESC' ? 'DESC' : q?.order;
    rtn.skip = (rtn.page - 1) * rtn.limit;

    return rtn;
  }
}
