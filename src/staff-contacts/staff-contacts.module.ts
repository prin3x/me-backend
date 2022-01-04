import { Module } from '@nestjs/common';
import { StaffContactsService } from './staff-contacts.service';
import { StaffContactsController } from './staff-contacts.controller';

@Module({
  controllers: [StaffContactsController],
  providers: [StaffContactsService]
})
export class StaffContactsModule {}
