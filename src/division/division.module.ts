import { Module } from '@nestjs/common';
import { DivisionService } from './division.service';
import { DivisionController } from './division.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Division } from './entities/division.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Division])],
  controllers: [DivisionController],
  providers: [DivisionService],
  exports: [DivisionService],
})
export class DivisionModule {}
