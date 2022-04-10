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
import { RolesGuard } from 'auth/roles.guard';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';
import { ListQueryMeetingDTO } from './dto/get-meeting-event.dto';

@Controller('meeting-events')
export class MeetingEventsController {
  constructor(private readonly meetingEventsService: MeetingEventsService) {}

  @Roles(['user'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @Body() createMeetingEventDto: CreateMeetingEventDto,
    @AuthPayload() user: IAuthPayload,
  ) {
    return this.meetingEventsService.create(createMeetingEventDto, user);
  }

  @Roles(['user', 'admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() q: ListQueryMeetingDTO) {
    return this.meetingEventsService.findAll(q);
  }

  @Roles(['user', 'admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/duplicate')
  findDuplicated(@Body() createMeetingEventDto: any) {
    return this.meetingEventsService.findInterval(
      createMeetingEventDto.start,
      createMeetingEventDto.end,
      createMeetingEventDto.roomId,
    );
  }

  @Roles(['user'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: string,
    @AuthPayload() user: IAuthPayload,
  ) {
    return this.meetingEventsService.findOneAndOwner(+id, user);
  }

  @Roles(['user'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMeetingEventDto: UpdateMeetingEventDto,
    @AuthPayload() user: IAuthPayload,
  ) {
    return this.meetingEventsService.update(+id, updateMeetingEventDto, user);
  }

  @Roles(['user'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingEventsService.remove(+id);
  }
}
