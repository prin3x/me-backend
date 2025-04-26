import { StaffContactsModule } from '@/staff-contacts/staff-contacts.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsModule } from 'rooms/rooms.module';
import { MeetingEvent } from './entities/meeting-event.entity';
import { MeetingEventsController } from './meeting-events.controller';
import { MeetingEventsService } from './meeting-events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingEvent]),
    RoomsModule,
    StaffContactsModule,
  ],
  controllers: [MeetingEventsController],
  providers: [MeetingEventsService],
})
export class MeetingEventsModule {}
