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
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { Roles } from 'auth/roles.decorator';
import { RolesGuard } from 'auth/roles.guard';
import { CarouselService } from './carousel.service';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import {
  ListBasicOperationCarousel,
  ListQueryParamsCarouselDTO,
} from './dto/get-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { UpdateCarouselStatusDto } from './dto/update-status-carousel.dto';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@UploadedFile() image: Express.Multer.File, @Body() createPostDto) {
    const set: CreateCarouselDto = {
      ...createPostDto,
      image,
    };
    return this.carouselService.create(set);
  }

  @Roles(['user', 'admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.carouselService.findAll();
  }

  @Roles(['user', 'admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/all')
  findAllNoExclude(@Query() q: ListQueryParamsCarouselDTO) {
    const queryString: ListBasicOperationCarousel =
      this.carouselService.parseQueryString(q);
    return this.carouselService.findAllNoExclude(queryString);
  }

  @Roles(['user', 'admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carouselService.findOneById(+id);
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarouselDto: UpdateCarouselDto,
  ) {
    return this.carouselService.update(+id, updateCarouselDto);
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateCarouselStatusDto: UpdateCarouselStatusDto,
  ) {
    return this.carouselService.updateStatus(+id, updateCarouselStatusDto);
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carouselService.remove(+id);
  }
}
