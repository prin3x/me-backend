import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListQueryCalendarDTO } from 'app.dto';
import { CalendarEventService } from './calendar-event.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { Cron } from '@nestjs/schedule';
import { Roles } from 'auth/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { ADMIN_ROLES, RolesGuard } from 'auth/roles.guard';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';
import { ListQueryCalendarByCategoryDTO } from './dto/find-event.dto';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calendar-event')
export class CalendarEventController {
  constructor(private readonly calendarEventService: CalendarEventService) {}

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() createCalendarEventDto: CreateCalendarEventDto,
    @AuthPayload() admin: IAuthPayload,
  ) {
    return this.calendarEventService.create(createCalendarEventDto, admin);
  }

  @Cron('1 1 1 1 *')
  @Post('/holidays')
  createHoliday() {
    return this.calendarEventService.saveHolidays();
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() q: ListQueryCalendarDTO) {
    return this.calendarEventService.findAll(q);
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/list')
  findFromCategory(@Query() q: ListQueryCalendarByCategoryDTO) {
    const parsedQuery = this.calendarEventService.parseQueryString(q);
    return this.calendarEventService.findFromCategory(parsedQuery);
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarEventService.findOne(+id);
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalendarEventDto: UpdateCalendarEventDto,
  ) {
    return this.calendarEventService.update(+id, updateCalendarEventDto);
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarEventService.remove(+id);
  }
}
