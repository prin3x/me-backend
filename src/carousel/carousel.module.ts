import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carousel } from './entities/carousel.entity';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carousel]),
    MulterModule.registerAsync({
      useFactory: () => ({
        fileFilter: (req: any, file: any, cb: any) => {
          if (file.mimetype.match('text.*|image.*|application.*')) {
            // Allow storage of file
            cb(null, true);
          } else {
            // Reject file
            cb(
              new HttpException(
                `Unsupported file type ${extname(file.originalname)}`,
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          }
        },
        limits: {
          fileSize: +10 * 1024 * 1024,
        },
        storage: diskStorage({
          destination: './upload/',
          filename: (req: any, file: any, cb: any) => {
            cb(null, `${uuid()}${extname(file.originalname)}`);
          },
        }),
      }),
    }),
  ],
  controllers: [CarouselController],
  providers: [CarouselService],
})
export class CarouselModule {}
