import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { Carousel, CAROUSEL_STATUS } from './entities/carousel.entity';
import * as path from 'path';
import { base64Encode } from 'utils/fileUtils';
import { UpdateCarouselStatusDto } from './dto/update-status-carousel.dto';

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
        status: CAROUSEL_STATUS.ENABLED,
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

  async findAllNoExclude(): Promise<Carousel[]> {
    let carouselList: Carousel[];
    try {
      const rawCarouselList = await this.repo.find();
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

  async findOne(id: number) {
    return await this.repo.findOne(id);
  }

  async findOneById(id: number) {
    let res: Carousel;
    try {
      res = await this.repo.findOne({ id });
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
}
