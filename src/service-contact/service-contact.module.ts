import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceContactCategoryModule } from 'service-contact-categories/service-contact-categories.module';
import { ServiceContact } from './entities/service-contact.entity';
import { ServiceContactService } from './service-conatct.service';
import { ServiceContactController } from './service-contact.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceContact]),
    ServiceContactCategoryModule,
  ],
  controllers: [ServiceContactController],
  providers: [ServiceContactService],
})
export class ServiceContactModule {}
