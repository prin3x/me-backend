import { Module } from '@nestjs/common';
import { CalendarEventCategoryService } from './calendar-event-category.service';
import { CalendarEventCategoryController } from './calendar-event-category.controller';
import { CalendarEventCategory } from './entities/calendar-event-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEventCategory])],
  controllers: [CalendarEventCategoryController],
  providers: [CalendarEventCategoryService],
})
export class CalendarEventCategoryModule {}
