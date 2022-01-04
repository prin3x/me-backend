import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalendarEventCategoryService } from './calendar-event-category.service';
import { CreateCalendarEventCategoryDto } from './dto/create-calendar-event-category.dto';
import { UpdateCalendarEventCategoryDto } from './dto/update-calendar-event-category.dto';

@Controller('calendar-event-category')
export class CalendarEventCategoryController {
  constructor(private readonly calendarEventCategoryService: CalendarEventCategoryService) {}

  @Post()
  create(@Body() createCalendarEventCategoryDto: CreateCalendarEventCategoryDto) {
    return this.calendarEventCategoryService.create(createCalendarEventCategoryDto);
  }

  @Get()
  findAll() {
    return this.calendarEventCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarEventCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCalendarEventCategoryDto: UpdateCalendarEventCategoryDto) {
    return this.calendarEventCategoryService.update(+id, updateCalendarEventCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarEventCategoryService.remove(+id);
  }
}
