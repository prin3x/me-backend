import { Module } from '@nestjs/common';
import { FormsRequestCategoriesService } from './forms-request-categories.service';
import { FormsRequestCategoriesController } from './forms-request-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsRequestCategory } from './entities/forms-request-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormsRequestCategory])],
  controllers: [FormsRequestCategoriesController],
  providers: [FormsRequestCategoriesService],
  exports: [FormsRequestCategoriesService],
})
export class FormsRequestCategoriesModule {}
