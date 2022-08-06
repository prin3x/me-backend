import { Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carousel } from './entities/carousel.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carousel]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
  ],
  controllers: [CarouselController],
  providers: [CarouselService],
})
export class CarouselModule {}
