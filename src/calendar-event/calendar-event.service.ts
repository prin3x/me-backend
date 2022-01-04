import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CalendarEventService {
  constructor(
    @InjectRepository(CalendarEvent)
    private repo: Repository<CalendarEvent>,
  ) {}

  async findOne(_id) {
    return await this.repo.findOne(_id);
  }

  async findAll() {
    return await this.repo.find();
  }

  async create(_calendarEvent: CreateCalendarEventDto) {
    let res;

    const calendarEventInstance = new CalendarEvent();
    calendarEventInstance.title = _calendarEvent.title;
    calendarEventInstance.description = _calendarEvent.description;
    calendarEventInstance.start = _calendarEvent.start;
    calendarEventInstance.end = _calendarEvent.end;
    calendarEventInstance.categoryId = _calendarEvent.categoryId;

    try {
      res = await this.repo.save(calendarEventInstance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async update(id: number, _calendarEvent: UpdateCalendarEventDto) {
    let res;

    const calendarEventInstance = new CalendarEvent();
    calendarEventInstance.id = id;
    calendarEventInstance.title = _calendarEvent.title;
    calendarEventInstance.description = _calendarEvent.description;
    calendarEventInstance.start = _calendarEvent.start;
    calendarEventInstance.end = _calendarEvent.end;
    calendarEventInstance.categoryId = _calendarEvent.categoryId;

    try {
      res = await this.repo.save(calendarEventInstance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async remove(id: number) {
    let res;

    const calendarEventInstance = new CalendarEvent();
    calendarEventInstance.id = id;

    try {
      res = await this.repo.delete({ id });
    } catch (e) {
      throw Error(e);
    }

    if (res.affected < 1) {
      throw new BadRequestException('Cannot Find This ID');
    }

    return res;
  }
}
