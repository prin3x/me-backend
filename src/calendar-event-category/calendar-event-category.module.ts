import { Module } from '@nestjs/common';
import { CalendarEventCategoryService } from './calendar-event-category.service';
import { CalendarEventCategoryController } from './calendar-event-category.controller';

@Module({
  controllers: [CalendarEventCategoryController],
  providers: [CalendarEventCategoryService]
})
export class CalendarEventCategoryModule {}
