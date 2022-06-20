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
import { base64Encode } from 'utils/fileUtils';
import { UpdateCarouselStatusDto } from './dto/update-status-carousel.dto';
import { ListBasicOperation } from 'utils/query.dto';
import { RTN_MODEL } from 'utils/rtn.model';
import {
  ListBasicOperationCarousel,
  ListQueryParamsCarouselDTO,
} from './dto/get-carousel.dto';

@Injectable()
export class CarouselService {
  constructor(
    @InjectRepository(Carousel)
    private repo: Repository<Carousel>,
  ) {}

  async create(createCarouselDto: CreateCarouselDto) {
    let res;

    const newsInsance = new Carousel();
    newsInsance.title = createCarouselDto.title;
    newsInsance.linkOut = createCarouselDto.linkOut;
    // mock
    newsInsance.adminId = 1;
    newsInsance.imageUrl = createCarouselDto.image.filename;

    try {
      res = await this.repo.save(newsInsance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async findAll(): Promise<Carousel[]> {
    let carouselList: Carousel[];
    try {
      const rawCarouselList = await this.repo.find({
        where: {
          status: CAROUSEL_STATUS.ENABLED,
        },
      });
      carouselList = rawCarouselList.map((_carouselInfo: Carousel) => {
        const imageBase64 = base64Encode(
          path.join('./upload', _carouselInfo.imageUrl),
        );
        _carouselInfo.imageUrl = `data:image/png;base64, ${imageBase64}`;

        return _carouselInfo;
      });
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

    rtn.items = rtn.items.map((_item: Carousel) => {
      const imageBase64 = base64Encode(path.join('./upload', _item.imageUrl));
      _item.imageUrl = `data:image/png;base64, ${imageBase64}`;

      return _item;
    });

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

    if (res.imageUrl) {
      const imageBase64 = base64Encode(path.join('./upload', res.imageUrl));
      res.imageUrl = `data:image/png;base64, ${imageBase64}`;
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

  async update(id: number, updateCarouselDto: UpdateCarouselDto) {
    let res;

    const carousel = await this.findOne(id);
    carousel.status = updateCarouselDto.status;

    try {
      res = await this.repo.save(carousel);
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
