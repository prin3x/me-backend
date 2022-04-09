import { Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carousel } from './entities/carousel.entity';
import { S3Module } from 's3/s3.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carousel]),
    S3Module,
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
