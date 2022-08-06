import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    MulterModule.registerAsync({
      useFactory: () => ({
        fileFilter: (req: any, file: any, cb: any) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
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
          fileSize: +4 * 1024 * 1024,
        },
        storage: diskStorage({
          destination: './upload/room',
          filename: (req: any, file: any, cb: any) => {
            cb(null, `${uuid()}${extname(file.originalname)}`);
          },
        }),
      }),
    }),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
