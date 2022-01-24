import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ListQueryCalendarDTO } from 'app.dto';
import { CalendarEventService } from './calendar-event.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Controller('calendar-event')
export class CalendarEventController {
  constructor(private readonly calendarEventService: CalendarEventService) {}

  @Post()
  create(@Body() createCalendarEventDto: CreateCalendarEventDto) {
    return this.calendarEventService.create(createCalendarEventDto);
  }

  @Get()
  findAll(@Query() q: ListQueryCalendarDTO) {
    return this.calendarEventService.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarEventService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalendarEventDto: UpdateCalendarEventDto,
  ) {
    return this.calendarEventService.update(+id, updateCalendarEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarEventService.remove(+id);
  }
}
