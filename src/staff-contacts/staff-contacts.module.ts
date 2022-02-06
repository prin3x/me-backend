import { Module } from '@nestjs/common';
import { StaffContactsService } from './staff-contacts.service';
import { StaffContactsController } from './staff-contacts.controller';
import { StaffContact } from './entities/staff-contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 's3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([StaffContact]), S3Module],
  controllers: [StaffContactsController],
  providers: [StaffContactsService],
  exports: [StaffContactsService],
})
export class StaffContactsModule {}
