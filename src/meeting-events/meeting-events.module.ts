import { Module } from '@nestjs/common';
import { MeetingEventsService } from './meeting-events.service';
import { MeetingEventsController } from './meeting-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEvent } from './entities/meeting-event.entity';
import { RoomsModule } from 'rooms/rooms.module';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEvent]), RoomsModule],
  controllers: [MeetingEventsController],
  providers: [MeetingEventsService],
})
export class MeetingEventsModule {}
