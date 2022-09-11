import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { Carousel, CAROUSEL_STATUS } from './entities/carousel.entity';
import * as path from 'path';
import { UpdateCarouselStatusDto } from './dto/update-status-carousel.dto';
import { ListBasicOperation } from 'utils/query.dto';
import { RTN_MODEL } from 'utils/rtn.model';
import {
  ListBasicOperationCarousel,
  ListQueryParamsCarouselDTO,
} from './dto/get-carousel.dto';
import { ConfigService } from '@nestjs/config';
import { IAuthPayload } from 'auth/auth.decorator';

@Injectable()
export class CarouselService {
  constructor(
    @InjectRepository(Carousel)
    private repo: Repository<Carousel>,
    private config: ConfigService,
  ) {}

  async create(
    createCarouselDto: CreateCarouselDto,
    authPayload: IAuthPayload,
  ) {
    let res;

    const carousel = new Carousel();
    carousel.title = createCarouselDto.title;
    carousel.linkOut = createCarouselDto.linkOut;
    carousel.adminId = authPayload.username;

    if (createCarouselDto.image) {
      carousel.imageUrl =
        this.config.get('apiAssetURL') +
        createCarouselDto?.image?.path.replace('upload', '');
    }

    try {
      res = await this.repo.save(carousel);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async findAll(): Promise<Carousel[]> {
    let carouselList: Carousel[];
    try {
      const query = this.repo.createQueryBuilder('carousel');
      query.where('(carousel.status LIKE :status)', {
        status: CAROUSEL_STATUS.ENABLED,
      });
      query.orderBy('createdDate', 'DESC');
      carouselList = await query.getMany();
    } catch (e) {
      console.error(e);
    }

    return carouselList;
  }

  async findAllNoExclude(opt: ListBasicOperationCarousel): Promise<RTN_MODEL> {
    let res, query;
    try {
      query = this.repo.createQueryBuilder('carousel');
      query.where('(carousel.title LIKE :search)', {
        search: `%${opt.search}%`,
      });
      query.orderBy('createdDate', 'DESC');
      query.skip(opt.skip).take(opt.limit);

      res = await query.getManyAndCount();
    } catch (e) {
      throw new BadRequestException(e);
    }

    const rtn: RTN_MODEL = {
      items: res?.[0],
      itemCount: res?.[0]?.length,
      total: res?.[1],
      page: opt.page,
    };

    return rtn;
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async findOneById(id: number) {
    let res: Carousel;
    try {
      res = await this.repo.findOne({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Id Not Found');
    }

    return res;
  }

  async updateStatus(
    id: number,
    updateCarouselStatusDto: UpdateCarouselStatusDto,
  ) {
    let res;

    try {
      if (updateCarouselStatusDto.status === CAROUSEL_STATUS.ENABLED) {
        res = this._enableCarousel(id);
      }
      if (updateCarouselStatusDto.status === CAROUSEL_STATUS.DISABLED) {
        res = this._disableCarousel(id);
      }
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async _enableCarousel(id: number) {
    let res;

    const carousel = await this.findOne(id);
    carousel.status = CAROUSEL_STATUS.ENABLED;

    try {
      res = await this.repo.save(carousel);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async _disableCarousel(id: number) {
    let res;

    const carousel = await this.findOne(id);
    carousel.status = CAROUSEL_STATUS.DISABLED;

    try {
      res = await this.repo.save(carousel);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async update(
    id: number,
    updateCarouselDto: UpdateCarouselDto,
    authPayload: IAuthPayload,
  ) {
    let res;

    const carousel = await this.findOne(id);
    carousel.status = updateCarouselDto.status;
    carousel.adminId = authPayload.username;

    try {
      const carouselTarget = await this.findOne(id);

      if (!carouselTarget) throw new NotFoundException('No carousel id found');

      const newStaffInformation = Object.assign(
        carouselTarget,
        updateCarouselDto,
      );

      if (updateCarouselDto.image) {
        newStaffInformation.imageUrl =
          this.config.get('apiAssetURL') +
          updateCarouselDto?.image?.path.replace('upload', '');
      }

      res = await this.repo.save(newStaffInformation);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }

  parseQueryString(q: ListQueryParamsCarouselDTO): ListBasicOperationCarousel {
    const rtn: ListBasicOperationCarousel = {
      page: +q?.page || 1,
      limit: +q?.limit ? (+q?.limit > 100 ? 100 : +q?.limit) : 10,
      skip: (q?.page - 1) * q?.limit,
      orderBy: q?.orderBy || 'createdDate',
      order: 'ASC',
      search: q?.search ? q?.search.trim() : '',
      linkOut: q?.linkOut ? q?.linkOut.trim() : '',
    };

    q.order = q?.order ? q?.order.toUpperCase() : '';
    rtn.order = q?.order != 'ASC' && q?.order != 'DESC' ? 'DESC' : q?.order;
    rtn.skip = (rtn.page - 1) * rtn.limit;

    return rtn;
  }
}
