import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MeetingEventsService } from './meeting-events.service';
import { CreateMeetingEventDto } from './dto/create-meeting-event.dto';
import { UpdateMeetingEventDto } from './dto/update-meeting-event.dto';
import { Roles } from 'auth/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { ADMIN_ROLES, RolesGuard } from 'auth/roles.guard';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';
import { ListQueryMeetingDTO } from './dto/get-meeting-event.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('meeting-events')
export class MeetingEventsController {
  constructor(private readonly meetingEventsService: MeetingEventsService) {}

  @Roles([ADMIN_ROLES.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() createMeetingEventDto: CreateMeetingEventDto,
    @AuthPayload() user: IAuthPayload,
  ) {
    return this.meetingEventsService.create(createMeetingEventDto, user);
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() q: ListQueryMeetingDTO) {
    return this.meetingEventsService.findAll(q);
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/duplicate')
  findDuplicated(@Body() createMeetingEventDto: any) {
    return this.meetingEventsService.findInterval(
      createMeetingEventDto.start,
      createMeetingEventDto.end,
      createMeetingEventDto.roomId,
    );
  }

  @Roles([ADMIN_ROLES.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: string,
    @AuthPayload() user: IAuthPayload,
  ) {
    return this.meetingEventsService.findOneAndOwner(+id, user);
  }

  @Roles([ADMIN_ROLES.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMeetingEventDto: UpdateMeetingEventDto,
    @AuthPayload() user: IAuthPayload,
  ) {
    return this.meetingEventsService.update(id, updateMeetingEventDto, user);
  }

  @Roles([ADMIN_ROLES.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingEventsService.remove(+id);
  }
}
