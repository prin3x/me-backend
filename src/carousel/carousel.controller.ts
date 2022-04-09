import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'utils/fileUtils';
import { CarouselService } from './carousel.service';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { UpdateCarouselStatusDto } from './dto/update-status-carousel.dto';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@UploadedFile() image: Express.Multer.File, @Body() createPostDto) {
    const set: CreateCarouselDto = {
      ...createPostDto,
      image,
    };
    return this.carouselService.create(set);
  }

  @Get()
  findAll() {
    return this.carouselService.findAll();
  }

  @Get('/all')
  findAllNoExclude() {
    return this.carouselService.findAllNoExclude();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carouselService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarouselDto: UpdateCarouselDto,
  ) {
    return this.carouselService.update(+id, updateCarouselDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateCarouselStatusDto: UpdateCarouselStatusDto,
  ) {
    return this.carouselService.updateStatus(+id, updateCarouselStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carouselService.remove(+id);
  }
}
