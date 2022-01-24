import { Module } from '@nestjs/common';
import { StaffContactsService } from './staff-contacts.service';
import { StaffContactsController } from './staff-contacts.controller';
import { StaffContact } from './entities/staff-contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StaffContact])],
  controllers: [StaffContactsController],
  providers: [StaffContactsService],
})
export class StaffContactsModule {}
