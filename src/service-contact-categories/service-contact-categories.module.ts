import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceContactCategory } from './entities/service-contact-categories.entity';
import { ServiceContactCategoryController } from './service-contact-categories.controller';
import { ServiceContactCategoryService } from './service-contact-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceContactCategory])],
  controllers: [ServiceContactCategoryController],
  providers: [ServiceContactCategoryService],
  exports: [ServiceContactCategoryService],
})
export class ServiceContactCategoryModule {}
