import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { ListQueryCalendarDTO } from 'app.dto';
import { StaffContactsService } from 'staff-contacts/staff-contacts.service';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { IAuthPayload } from 'auth/auth.decorator';

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
        start: MoreThan(opt.startDate),
        end: LessThan(opt.endDate),
      });
      const set = {} as any;
      set.startDate = opt.startDate;
      rtc = await this.contactService.findAllBirthday(set);
      const tempRtc = rtc?.items.map((_item) => {
        let bd = _item.birthDate.split('-');
        bd[0] = '2022';
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
      rtn = [...rfe, ...tempRtc];
    } catch (e) {
      this.logger.error(`Fn: ${this.findAll.name}`);
      throw new BadRequestException(e);
    }

    return rtn;
  }

  async create(_calendarEvent: CreateCalendarEventDto, auth: IAuthPayload) {
    this.logger.log(
      `Fn: ${this.create.name}, Params: ${_calendarEvent.title}, Auth: ${auth.id}`,
    );
    let res;

    const calendarEventInstance = new CalendarEvent();
    calendarEventInstance.title = _calendarEvent.title;
    calendarEventInstance.description = _calendarEvent.description;
    calendarEventInstance.start = new Date(_calendarEvent.start);
    calendarEventInstance.end = new Date(_calendarEvent.end);
    calendarEventInstance.allDay = _calendarEvent.allDay;
    calendarEventInstance.categoryName = _calendarEvent.categoryName;
    calendarEventInstance.createdBy = auth.id;

    try {
      res = await this.repo.save(calendarEventInstance);
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

    const calendarEventInstance = new CalendarEvent();
    calendarEventInstance.id = id;
    calendarEventInstance.title = _calendarEvent.title;
    calendarEventInstance.description = _calendarEvent.description;
    calendarEventInstance.start = new Date(_calendarEvent.start);
    calendarEventInstance.end = new Date(_calendarEvent.end);
    calendarEventInstance.allDay = false;
    calendarEventInstance.categoryName = _calendarEvent.categoryName;

    try {
      res = await this.repo.save(calendarEventInstance);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}, Params: id => ${id}`);
      throw Error(e);
    }

    return res;
  }

  async remove(id: number) {
    this.logger.log(`Fn: ${this.remove.name}, Params: id => ${id}`);
    let res;

    const calendarEventInstance = new CalendarEvent();
    calendarEventInstance.id = id;

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
      `Fn: ${
        this.saveHolidays.name
      }, Params: id => ${new Date().toISOString()}`,
    );
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
        title: _item.HolidayDescriptionThai,
        description: _item.HolidayDescriptionThai,
        start: new Date(_item.Date).toISOString(),
        end: new Date(_item.Date).toISOString(),
        allDay: true,
        categoryName: 'holiday',
      };
    });

    try {
      for (let i = 0; i < mapData.length; i++) {
        await this.create(mapData[i], {
          id: 0,
          profilePicUrl: '',
          name: '',
          nameTH: '',
          nickname: '',
          company: '',
          department: '',
          division: '',
          ipPhone: '',
          email: '',
          position: '',
          staffId: '',
          status: '',
          birthDate: undefined,
          hash: '',
          createdBy: 0,
          createdDate: undefined,
          updatedDate: undefined,
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
}
