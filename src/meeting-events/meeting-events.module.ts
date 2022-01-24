import { Module } from '@nestjs/common';
import { MeetingEventsService } from './meeting-events.service';
import { MeetingEventsController } from './meeting-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEvent } from './entities/meeting-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEvent])],
  controllers: [MeetingEventsController],
  providers: [MeetingEventsService],
})
export class MeetingEventsModule {}
