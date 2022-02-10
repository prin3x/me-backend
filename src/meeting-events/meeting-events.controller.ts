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
} from '@nestjs/common';
import { MeetingEventsService } from './meeting-events.service';
import { CreateMeetingEventDto } from './dto/create-meeting-event.dto';
import { UpdateMeetingEventDto } from './dto/update-meeting-event.dto';
import { Roles } from 'auth/roles.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { RolesGuard } from 'auth/roles.guard';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';

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

  @Get()
  findAll() {
    return this.meetingEventsService.findAll();
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
