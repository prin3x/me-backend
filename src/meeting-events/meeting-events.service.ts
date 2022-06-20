import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from 'auth/auth.decorator';
import * as moment from 'moment';
import { RoomsService } from 'rooms/rooms.service';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreateMeetingEventDto } from './dto/create-meeting-event.dto';
import { ListQueryMeetingDTO } from './dto/get-meeting-event.dto';
import { UpdateMeetingEventDto } from './dto/update-meeting-event.dto';
import { MeetingEvent } from './entities/meeting-event.entity';

@Injectable()
export class MeetingEventsService {
  private readonly logger = new Logger(MeetingEventsService.name);
  constructor(
    @InjectRepository(MeetingEvent)
    private repo: Repository<MeetingEvent>,
    private roomsService: RoomsService,
  ) {}

  async create(
    createMeetingEventDto: CreateMeetingEventDto,
    auth: IAuthPayload,
  ) {
    this.logger.log(
      `Fn: ${this.create.name}, Params: ${createMeetingEventDto.title}, Auth: ${auth.id}`,
    );
    const newEvent = new MeetingEvent();
    newEvent.title = createMeetingEventDto.title;
    newEvent.description = createMeetingEventDto.description;

    newEvent.start = createMeetingEventDto.allDay
      ? new Date(
          moment(createMeetingEventDto.start).startOf('day').toISOString(),
        )
      : new Date(createMeetingEventDto.start);
    newEvent.end = createMeetingEventDto.allDay
      ? new Date(
          moment(createMeetingEventDto.start)
            .endOf('day')
            .subtract(1, 'm')
            .toISOString(),
        )
      : new Date(createMeetingEventDto.end);

    newEvent.roomId = createMeetingEventDto.roomId;
    newEvent.type = createMeetingEventDto.type;
    newEvent.allDay = false;
    newEvent.createdBy = auth.id;

    try {
      const start = moment(createMeetingEventDto.start).format(
        'yyyy-MM-DD HH:mm:ss',
      );
      const end = moment(createMeetingEventDto.end).format(
        'yyyy-MM-DD HH:mm:ss',
      );
      const allRoomThisDay = await this.findInterval(
        start,
        end,
        createMeetingEventDto.roomId,
      );

      if (allRoomThisDay.length > 0)
        throw new BadRequestException('Duplicated Booking');

      await this.repo.save(newEvent);
    } catch (e) {
      this.logger.error(
        `Fn: ${this.create.name}, Params: ${createMeetingEventDto.title}, Auth: ${auth.id}`,
      );
      throw new BadRequestException(e);
    }

    return newEvent;
  }

  async findInterval(
    start: string,
    end: string,
    roomId: number,
  ): Promise<MeetingEvent[]> {
    const query = this.repo.createQueryBuilder('meeting');
    query.where('meeting.roomId = :roomId', {
      roomId,
    });
    query
      .where('meeting.start <= :start AND meeting.end >= :end', {
        start: start,
        end: end,
      })
      .orWhere('meeting.start >= :start AND meeting.end <= :end', {
        start: start,
        end: end,
      })
      .orWhere('meeting.start <= :start AND meeting.end >= :start', {
        start: start,
      })
      .orWhere('meeting.start >= :end AND meeting.end <= :end', {
        end: end,
      });

    return await query.getMany();
  }

  async findAll(opt: ListQueryMeetingDTO) {
    return await this.repo.find({
      where: {
        start: MoreThan(opt.startDate),
        end: LessThan(opt.endDate),
      },
      relations: ['staffContactDetail'],
    });
  }

  async findAvailableTimeIntervalByRoomId(targetDate: string, roomId: number) {
    let res;
    try {
      res = await this.repo.find({
        where: {
          roomId: roomId,
          start: MoreThanOrEqual(
            moment(targetDate).startOf('day').toISOString() as unknown as Date,
          ),
          end: LessThanOrEqual(
            moment(targetDate).endOf('day').toISOString() as unknown as Date,
          ),
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }

    return res;
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async findOneAndOwner(id: number, user: IAuthPayload) {
    this.logger.log(`Fn: ${this.findOneAndOwner.name}`);
    let res, rtn;
    try {
      res = await this.repo.findOne({ where: { id } });
      rtn = {
        ...res,
        isOwner: res.createdBy === user.id,
      };
    } catch (e) {
      this.logger.error(`Fn: ${this.findOneAndOwner.name}`);
      throw new BadRequestException('Not Found');
    }

    return rtn;
  }

  async update(
    id: number,
    updateMeetingEventDto: UpdateMeetingEventDto,
    user: IAuthPayload,
  ) {
    this.logger.log(`Fn: ${this.update.name}, Auth: ${user.id}`);
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
      this.logger.error(`Fn: ${this.update.name}, Auth: ${user.id}`);
      throw new BadRequestException();
    }

    return newEvent;
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}
