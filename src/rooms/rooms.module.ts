import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 's3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), S3Module],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
