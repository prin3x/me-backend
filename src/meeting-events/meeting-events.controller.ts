import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MeetingEventsService } from './meeting-events.service';
import { CreateMeetingEventDto } from './dto/create-meeting-event.dto';
import { UpdateMeetingEventDto } from './dto/update-meeting-event.dto';

@Controller('meeting-events')
export class MeetingEventsController {
  constructor(private readonly meetingEventsService: MeetingEventsService) {}

  @Post()
  create(@Body() createMeetingEventDto: CreateMeetingEventDto) {
    return this.meetingEventsService.create(createMeetingEventDto);
  }

  @Get()
  findAll() {
    return this.meetingEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingEventsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeetingEventDto: UpdateMeetingEventDto,
  ) {
    return this.meetingEventsService.update(+id, updateMeetingEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingEventsService.remove(+id);
  }
}
