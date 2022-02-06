import { Module } from '@nestjs/common';
import { CalendarEventService } from './calendar-event.service';
import { CalendarEventController } from './calendar-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';
import { StaffContactsModule } from 'staff-contacts/staff-contacts.module';
import configuration from 'config/configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEvent]),
    StaffContactsModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [CalendarEventController],
  providers: [CalendarEventService],
  exports: [CalendarEventService],
})
export class CalendarEventModule {}
