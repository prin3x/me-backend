import { Module } from '@nestjs/common';
import { FormsRequestService } from './forms-request.service';
import { FormsRequestController } from './forms-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsRequest } from './entities/forms-request.entity';
import { FormsRequestCategoriesModule } from 'forms-request-categories/forms-request-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormsRequest]),
    FormsRequestCategoriesModule,
  ],
  controllers: [FormsRequestController],
  providers: [FormsRequestService],
})
export class FormsRequestModule {}
