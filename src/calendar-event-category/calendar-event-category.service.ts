import { Injectable } from '@nestjs/common';
import { CreateCalendarEventCategoryDto } from './dto/create-calendar-event-category.dto';
import { UpdateCalendarEventCategoryDto } from './dto/update-calendar-event-category.dto';

@Injectable()
export class CalendarEventCategoryService {
  create(createCalendarEventCategoryDto: CreateCalendarEventCategoryDto) {
    return 'This action adds a new calendarEventCategory';
  }

  findAll() {
    return `This action returns all calendarEventCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} calendarEventCategory`;
  }

  update(id: number, updateCalendarEventCategoryDto: UpdateCalendarEventCategoryDto) {
    return `This action updates a #${id} calendarEventCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} calendarEventCategory`;
  }
}
