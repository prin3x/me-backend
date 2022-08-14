import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { Roles } from 'auth/roles.decorator';
import { ADMIN_ROLES, RolesGuard } from 'auth/roles.guard';
import { CalendarEventCategoryService } from './calendar-event-category.service';
import { CreateCalendarEventCategoryDto } from './dto/create-calendar-event-category.dto';
import { UpdateCalendarEventCategoryDto } from './dto/update-calendar-event-category.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calendar-event-category')
export class CalendarEventCategoryController {
  constructor(
    private readonly calendarEventCategoryService: CalendarEventCategoryService,
  ) {}

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() createCalendarEventCategoryDto: CreateCalendarEventCategoryDto,
  ) {
    return this.calendarEventCategoryService.create(
      createCalendarEventCategoryDto,
    );
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.calendarEventCategoryService.findAll();
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarEventCategoryService.findOne(+id);
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalendarEventCategoryDto: UpdateCalendarEventCategoryDto,
  ) {
    return this.calendarEventCategoryService.update(
      +id,
      updateCalendarEventCategoryDto,
    );
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarEventCategoryService.remove(+id);
  }
}
