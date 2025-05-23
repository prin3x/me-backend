import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthPayload } from 'auth/auth.decorator';
import * as moment from 'moment';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateMeetingEventDto } from './dto/create-meeting-event.dto';
import { ListQueryMeetingDTO } from './dto/get-meeting-event.dto';
import { UpdateMeetingEventDto } from './dto/update-meeting-event.dto';
import { MeetingEvent } from './entities/meeting-event.entity';
import { StaffContactsService } from '@/staff-contacts/staff-contacts.service';

@Injectable()
export class MeetingEventsService {
  private readonly logger = new Logger(MeetingEventsService.name);
  constructor(
    @InjectRepository(MeetingEvent)
    private repo: Repository<MeetingEvent>,
    private staffContactService: StaffContactsService,
  ) {}

  async create(
    createMeetingEventDto: CreateMeetingEventDto,
    auth: IAuthPayload,
  ) {
    this.logger.log(
      `Fn: ${this.create.name}, Params: ${createMeetingEventDto.title}, Auth: ${
        auth.id
      } ${JSON.stringify(createMeetingEventDto)}`,
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
      const allRoomThisDay = await this.findInterval(
        createMeetingEventDto.start,
        createMeetingEventDto.end,
        createMeetingEventDto.roomId,
      );

      if (allRoomThisDay) throw new BadRequestException('Duplicated Booking');

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
  ): Promise<MeetingEvent> {
    start = moment(start).subtract(7, 'h').format('YYYY-MM-DD HH:mm:ss');
    end = moment(end).subtract(7, 'h').format('YYYY-MM-DD HH:mm:ss');

    const query = this.repo.createQueryBuilder('meeting');
    const result = await query
      .where('meeting.roomId = :roomId', { roomId })
      .andWhere(
        '((meeting.start < :end AND meeting.end > :start) OR (meeting.start > :start AND meeting.end < :end) OR (meeting.start < :start AND meeting.end > :start) OR (meeting.start > :end AND meeting.end < :end) OR (meeting.start = :start AND meeting.end = :end))',
      )
      .setParameters({ start, end })
      .getOne();

    return result;
  }

  async findAll(opt: ListQueryMeetingDTO) {
    return await this.repo.find({
      where: {
        start: MoreThanOrEqual(opt.startDate),
        end: LessThanOrEqual(moment(opt.endDate).add(1, 'days').toDate()),
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
    return await this.repo.findOne({
      where: { id },
      relations: {
        room: true,
      },
    });
  }

  async findOneAndOwner(id: number, user: IAuthPayload) {
    this.logger.log(`Fn: ${this.findOneAndOwner.name}`);
    let res, rtn;
    try {
      res = await this.repo.findOne({
        where: { id },
        relations: {
          room: true,
        },
      });
      const creator = await this.staffContactService.findOne(res.createdBy);
      rtn = {
        ...res,
        isOwner: res.createdBy === user.id,
        creator: {
          id: creator.id,
          name: creator.name,
          nameTH: creator.nameTH,
        },
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
    this.logger.log(
      `Fn: ${this.update.name}, Auth: ${
        user.id
      }, booking id: ${id} , ${JSON.stringify(updateMeetingEventDto)}`,
    );
    let newEvent;
    try {
      newEvent = await this.repo.findOne({
        where: { id },
      });
      if (!newEvent) throw new NotFoundException('Not found');

      newEvent.title = updateMeetingEventDto.title;
      newEvent.description = updateMeetingEventDto.description;
      newEvent.start = updateMeetingEventDto.start;
      newEvent.end = updateMeetingEventDto.end;
      newEvent.roomId = id;
      newEvent.createdBy = user.id;
      const allRoomThisDay = await this.findInterval(
        updateMeetingEventDto.start,
        updateMeetingEventDto.end,
        id,
      );

      if (allRoomThisDay && allRoomThisDay.createdBy !== user.id)
        throw new BadRequestException('Duplicated Booking');

      await this.repo.save(newEvent);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}, Auth: ${user.id}`);
      throw new BadRequestException(`${e}`);
    }

    return newEvent;
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}
