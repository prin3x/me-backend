import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { ListQueryCalendarDTO } from 'app.dto';
import { StaffContactsService } from 'staff-contacts/staff-contacts.service';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { IAuthPayload } from 'auth/auth.decorator';

import {
  ListQueryCalendarByCategoryDTO,
  ListQueryStringByCategory,
} from './dto/find-event.dto';
import moment from 'moment';

export interface HolidaysData {
  HolidayWeekDay: string;
  HolidayWeekDayThai: string;
  Date: string;
  DateThai: string;
  HolidayDescription: string;
  HolidayDescriptionThai: string;
}

export interface HolidaysResponseTimestamps {
  api: string;
  timestamp: string;
  data: HolidaysData[];
}

export interface HolidaysResponseFromBOT {
  result: HolidaysResponseTimestamps;
}

@Injectable()
export class CalendarEventService {
  private readonly logger = new Logger(CalendarEventService.name);

  constructor(
    @InjectRepository(CalendarEvent)
    private repo: Repository<CalendarEvent>,
    private contactService: StaffContactsService,
    private config: ConfigService,
  ) {}

  /**
   * Find one document by its _id
   * @param _id - The id of the document to find.
   * @returns The promise of the findOne method.
   */
  async findOne(_id) {
    return await this.repo.findOne(_id);
  }

  async findAll(opt: ListQueryCalendarDTO) {
    this.logger.log(`Fn: ${this.findAll.name}`);
    let rfe, rtn, rtc;
    try {
      rfe = await this.repo.find({
        where: {
          start: MoreThanOrEqual(opt.startDate),
          end: LessThanOrEqual(moment(opt.endDate).add(1, 'days').toDate()),
        },
      });
      const set = {} as any;
      set.startDate = opt.startDate;
      rtc = await this.contactService.findAllBirthday(set);
      const tempRtc = rtc?.items.map((_item) => {
        let bd = _item.birthDate.split('-');
        bd[0] = set.startDate.split('-')?.[0];
        bd = bd.join('-');
        return {
          id: nanoid(),
          title: `${_item.nickname} - ${_item.division}`,
          staffId: _item.id,
          description: '',
          start: bd,
          end: bd,
          allDay: true,
          createdDate: _item?.createdDate,
          updatedDate: _item?.updatedDate,
          createdBy: 0,
          categoryName: 'birthday',
          roomIds: null,
        };
      });
      rtn = [...rfe, ...tempRtc];
    } catch (e) {
      this.logger.error(`Fn: ${this.findAll.name}`, e);
      throw new BadRequestException(e);
    }

    return rtn;
  }

  async findFromCategory(opt: ListQueryStringByCategory) {
    this.logger.log(`Fn: ${this.findFromCategory.name}`);
    let rfe, rtn, rtc, paginationRtn, total;
    try {
      if (opt.category !== 'birthday') {
        rfe = await this.repo.find({
          where: {
            start: MoreThan(new Date('2022-01-01')),
            end: LessThan(new Date(parseInt(opt.year) + 1 + '-01-01')),
            categoryName: opt.category,
          },
          skip: opt.skip,
          take: opt.limit,
          order: {
            start: 'ASC',
          },
        });

        const totalFounds = await this.repo.find({
          where: {
            categoryName: opt.category,
          },
        });

        total = totalFounds.length;

        rtn = [...rfe];
      }

      if (opt.category === 'birthday') {
        const set = {} as any;
        set.startDate = opt.year + '-01-01';
        set.endDate = opt.year + 1 + '-01-01';
        rtc = await this.contactService.findAllBirthdayWithoutMonth(set);
        const tempRtc = rtc?.items.map((_item) => {
          let bd = _item.birthDate.split('-');
          bd[0] = set.startDate.split('-')?.[0];
          bd = bd.join('-');
          return {
            id: nanoid(),
            title: `วันเกิด ${_item.nickname} - ${_item.section}`,
            staffId: _item.id,
            description: '',
            start: bd,
            end: bd,
            allDay: true,
            createdDate: _item?.createdDate,
            updatedDate: _item?.updatedDate,
            createdBy: 0,
            categoryName: 'birthday',
            roomIds: null,
          };
        });
        rtn = tempRtc;
        total = tempRtc.length;
      }

      paginationRtn = {
        items: rtn,
        itemCount: rtn.length,
        total: total,
        page: opt.page,
      };
    } catch (e) {
      this.logger.error(`Fn: ${this.findFromCategory.name}`, e);
      throw new BadRequestException(e);
    }

    return paginationRtn;
  }

  async create(_calendarEvent: CreateCalendarEventDto, auth: IAuthPayload) {
    this.logger.log(
      `Fn: ${this.create.name}, Params: ${_calendarEvent.title}, Auth: ${auth.id}`,
    );
    let res;

    const calendarEventInstance = new CalendarEvent();
    const newCalendarInstance = Object.assign(
      calendarEventInstance,
      _calendarEvent,
    );

    try {
      res = await this.repo.save(newCalendarInstance);
    } catch (e) {
      this.logger.error(
        `Fn: ${this.create.name}, Params: ${_calendarEvent.title}, Auth: ${auth.id}`,
      );
      throw Error(e);
    }

    return res;
  }

  async update(id: number, _calendarEvent: UpdateCalendarEventDto) {
    this.logger.log(`Fn: ${this.update.name}, Params: id => ${id}`);
    let res;

    try {
      const eventTarget = await this.findOne(`${id}`);

      if (!eventTarget) throw new NotFoundException('No staff id found');

      const newEventUpdated = Object.assign(eventTarget, _calendarEvent);

      res = await this.repo.save(newEventUpdated);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}, Params: id => ${id}`);
      throw Error(e);
    }

    return res;
  }

  async remove(id: number) {
    this.logger.log(`Fn: ${this.remove.name}, Params: id => ${id}`);
    let res;

    try {
      res = await this.repo.delete({ id });
    } catch (e) {
      this.logger.error(`Fn: ${this.remove.name}, Params: id => ${id}`);
      throw Error(e);
    }

    if (res.affected < 1) {
      throw new BadRequestException('Cannot Find This ID');
    }

    return res;
  }

  async saveHolidays() {
    this.logger.log(
      `Fn: ${this.saveHolidays.name}, Params: ${new Date().toISOString()}`,
    );
    let allHolidaysThisYear = [];

    try {
      const query = {
        year: '2022',
        category: 'holiday',
      } as ListQueryCalendarByCategoryDTO;
      const parsedQuery = this.parseQueryString(query);
      allHolidaysThisYear = await this.findFromCategory(parsedQuery);

      const idsToRemove = allHolidaysThisYear.map((_item) => _item.id);

      await this.repo.delete({ id: In(idsToRemove) });
    } catch (error) {
      throw new BadRequestException(error);
    }

    const config = {
      method: 'GET',
      url: 'https://apigw1.bot.or.th/bot/public/financial-institutions-holidays/',
      qs: { year: '2022' },
      headers: {
        'X-IBM-Client-Id': this.config.get('botApiKey'),
        accept: 'application/json',
      },
    };

    const botRes = await axios(config as any)
      .then((res: any) => res.data)
      .catch((e) => console.error(e));

    const res: HolidaysResponseFromBOT = botRes;

    const data = res.result.data;

    const mapData = data.map((_item) => {
      return {
        title: _item.HolidayDescription,
        description: _item.HolidayDescriptionThai,
        start: new Date(_item.Date).toISOString(),
        end: new Date(_item.Date).toISOString(),
        allDay: true,
        categoryName: 'holiday',
        hyperlink: '',
      };
    });

    try {
      for (let i = 0; i < mapData.length; i++) {
        await this.create(mapData[i], {
          id: 0,
          username: 'host',
          role: 'host',
          name: 'host',
          profilePicUrl: '',
        });
      }
    } catch (e) {
      this.logger.error(
        `Fn: ${
          this.saveHolidays.name
        }, Params: id => ${new Date().toISOString()}`,
      );
      throw new BadRequestException(e);
    }
  }

  parseQueryString(
    q: ListQueryCalendarByCategoryDTO,
  ): ListQueryStringByCategory {
    const rtn: ListQueryStringByCategory = {
      page: +q?.page || 1,
      limit: +q?.limit ? (+q?.limit > 100 ? 100 : +q?.limit) : 20,
      skip: (q?.page - 1) * q?.limit,
      orderBy: q?.orderBy || 'id',
      order: q.order === 'DESC' ? 'DESC' : 'ASC',
      search: q?.search ? q?.search.trim() : '',
      year: q?.year || '2022',
      category: q?.category || '',
      startDate: undefined,
      endDate: undefined,
    };

    rtn.startDate = q?.month;

    rtn.skip = (rtn.page - 1) * rtn.limit;

    return rtn;
  }
}
