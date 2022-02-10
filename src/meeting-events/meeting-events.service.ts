import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from 'auth/auth.decorator';
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

  async create(
    createMeetingEventDto: CreateMeetingEventDto,
    user: IAuthPayload,
  ) {
    const newEvent = new MeetingEvent();
    newEvent.title = createMeetingEventDto.title;
    newEvent.description = createMeetingEventDto.description;
    newEvent.start = new Date(createMeetingEventDto.start);
    newEvent.end = new Date(createMeetingEventDto.end);
    newEvent.roomId = createMeetingEventDto.roomId;
    newEvent.createdBy = user.id;

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

  async findOneAndOwner(id: number, user: IAuthPayload) {
    let res, rtn;
    try {
      res = await this.repo.findOne(id);
      rtn = {
        ...res,
        isOwner: res.createdBy === user.id,
      };
    } catch (e) {
      throw new BadRequestException('Not Found');
    }

    return rtn;
  }

  async update(
    id: number,
    updateMeetingEventDto: UpdateMeetingEventDto,
    user: IAuthPayload,
  ) {
    let newEvent;
    try {
      newEvent = await this.findOne(id);
      if (!newEvent) throw new NotFoundException();

      newEvent.title = updateMeetingEventDto.title;
      newEvent.description = updateMeetingEventDto.description;
      newEvent.start = updateMeetingEventDto.start;
      newEvent.end = updateMeetingEventDto.end;
      newEvent.roomId = updateMeetingEventDto.roomId;
      newEvent.createdBy = user.id;

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
