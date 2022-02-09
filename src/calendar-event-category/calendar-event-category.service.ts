import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCalendarEventCategoryDto } from './dto/create-calendar-event-category.dto';
import { UpdateCalendarEventCategoryDto } from './dto/update-calendar-event-category.dto';
import { CalendarEventCategory } from './entities/calendar-event-category.entity';

@Injectable()
export class CalendarEventCategoryService {
  constructor(
    @InjectRepository(CalendarEventCategory)
    private repo: Repository<CalendarEventCategory>,
  ) {}

  async create(createCalendarEventCategoryDto: CreateCalendarEventCategoryDto) {
    const category = new CalendarEventCategory();
    category.title = createCalendarEventCategoryDto.title;

    return await this.repo.save(category);
  }

  async findAll() {
    return await this.repo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} calendarEventCategory`;
  }

  update(
    id: number,
    updateCalendarEventCategoryDto: UpdateCalendarEventCategoryDto,
  ) {
    return `This action updates a #${id} calendarEventCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} calendarEventCategory`;
  }
}
