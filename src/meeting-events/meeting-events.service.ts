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
import { MEETING_STAFF_SELECT } from 'utils/list-select';

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
      const conflict = await this.findInterval(
        createMeetingEventDto.start,
        createMeetingEventDto.end,
        createMeetingEventDto.roomId,
      );

      if (conflict) throw new BadRequestException('Duplicated Booking');

      await this.repo.save(newEvent);
    } catch (e) {
      this.logBookingError(
        this.create.name,
        e,
        `title: ${createMeetingEventDto.title}, roomId: ${createMeetingEventDto.roomId}, Auth: ${auth.id}`,
      );
      throw this.toBookingException(e);
    }

    return newEvent;
  }

  async findInterval(
    start: string,
    end: string,
    roomId: number,
    excludeEventId?: number,
  ): Promise<MeetingEvent> {
    start = moment(start).subtract(7, 'h').format('YYYY-MM-DD HH:mm:ss');
    end = moment(end).subtract(7, 'h').format('YYYY-MM-DD HH:mm:ss');

    const query = this.repo.createQueryBuilder('meeting');
    query
      .where('meeting.roomId = :roomId', { roomId })
      .andWhere(
        '((meeting.start < :end AND meeting.end > :start) OR (meeting.start > :start AND meeting.end < :end) OR (meeting.start < :start AND meeting.end > :start) OR (meeting.start > :end AND meeting.end < :end) OR (meeting.start = :start AND meeting.end = :end))',
      )
      .setParameters({ start, end });

    if (excludeEventId != null) {
      query.andWhere('meeting.id != :excludeEventId', { excludeEventId });
    }

    return query.getOne();
  }

  async findAll(opt: ListQueryMeetingDTO) {
    const rangeStart = moment(opt.startDate).startOf('day').toDate();
    const rangeEnd = moment(opt.endDate).endOf('day').toDate();

    return await this.repo
      .createQueryBuilder('meeting')
      .leftJoin('meeting.staffContactDetail', 'staffContactDetail')
      .addSelect([...MEETING_STAFF_SELECT])
      .where('meeting.start < :rangeEnd', { rangeEnd })
      .andWhere('meeting.end > :rangeStart', { rangeStart })
      .getMany();
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
      newEvent.start = updateMeetingEventDto.allDay
        ? new Date(
            moment(updateMeetingEventDto.start).startOf('day').toISOString(),
          )
        : new Date(updateMeetingEventDto.start);
      newEvent.end = updateMeetingEventDto.allDay
        ? new Date(
            moment(updateMeetingEventDto.start)
              .endOf('day')
              .subtract(1, 'm')
              .toISOString(),
          )
        : new Date(updateMeetingEventDto.end);
      newEvent.type = updateMeetingEventDto.type;

      const conflict = await this.findInterval(
        updateMeetingEventDto.start,
        updateMeetingEventDto.end,
        newEvent.roomId,
        id,
      );

      if (conflict) throw new BadRequestException('Duplicated Booking');

      await this.repo.save(newEvent);
    } catch (e) {
      this.logBookingError(
        this.update.name,
        e,
        `booking id: ${id}, roomId: ${newEvent?.roomId}, Auth: ${user.id}`,
      );
      throw this.toBookingException(e);
    }

    return newEvent;
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }

  private logBookingError(fn: string, error: unknown, context: string) {
    const message = this.getErrorMessage(error);
    this.logger.error(`Fn: ${fn} failed — ${message}, ${context}`);
  }

  private toBookingException(error: unknown): BadRequestException {
    if (error instanceof BadRequestException) return error;
    if (error instanceof NotFoundException) {
      return new BadRequestException(this.getErrorMessage(error));
    }
    return new BadRequestException(this.getErrorMessage(error));
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof BadRequestException) {
      const response = error.getResponse();
      if (typeof response === 'string') return response;
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const message = (response as { message?: string | string[] }).message;
        return Array.isArray(message)
          ? message.join(', ')
          : message ?? error.message;
      }
    }
    if (error instanceof Error) return error.message;
    return String(error);
  }
}
