import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMeetingEventDto } from './dto/create-meeting-event.dto';
import { UpdateMeetingEventDto } from './dto/update-meeting-event.dto';
import { MeetingEvent } from './entities/meeting-event.entity';

@Injectable()
export class MeetingEventsService {
  constructor(
    @InjectRepository(MeetingEvent)
    private repo: Repository<MeetingEvent>,
  ) {}

  async create(createMeetingEventDto: CreateMeetingEventDto) {
    const newEvent = new MeetingEvent();
    newEvent.title = createMeetingEventDto.title;
    newEvent.description = createMeetingEventDto.description;
    newEvent.start = new Date(createMeetingEventDto.start);
    newEvent.end = new Date(createMeetingEventDto.end);
    newEvent.roomId = createMeetingEventDto.roomId;

    try {
      await this.repo.save(newEvent);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return newEvent;
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    return await this.repo.findOne(id);
  }

  async update(id: number, updateMeetingEventDto: UpdateMeetingEventDto) {
    let newEvent;
    try {
      newEvent = await this.findOne(id);
      if (!newEvent) throw new NotFoundException();

      newEvent.title = updateMeetingEventDto.title;
      newEvent.description = updateMeetingEventDto.description;
      newEvent.start = updateMeetingEventDto.start;
      newEvent.end = updateMeetingEventDto.end;
      newEvent.roomId = updateMeetingEventDto.roomId;

      await this.repo.save(newEvent);
    } catch (e) {
      throw new BadRequestException();
    }

    return newEvent;
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}
