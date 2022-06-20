import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 's3/s3.service';
import { Repository } from 'typeorm';
import { CreateStaffContactDto } from './dto/create-staff-contact.dto';
import {
  ListBasicOperationContact,
  ListQueryParamsContactDTO,
} from './dto/get-staff-contact.dto';
import { UpdateStaffContactDto } from './dto/update-staff-contact.dto';
import { StaffContact } from './entities/staff-contact.entity';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { IAuthPayload } from 'auth/auth.decorator';

@Injectable()
export class StaffContactsService {
  private readonly logger = new Logger(StaffContactsService.name);
  constructor(
    @InjectRepository(StaffContact)
    private repo: Repository<StaffContact>,
    private s3Service: S3Service,
    private config: ConfigService,
  ) {}

  async create(
    createStaffContactDto: CreateStaffContactDto,
    auth: IAuthPayload,
  ) {
    this.logger.log(
      `Fn: ${this.create.name}, Params: ${createStaffContactDto.name}, Auth: ${auth.id}`,
    );
    let res;

    const staffInstance = new StaffContact();
    staffInstance.email = createStaffContactDto.email;
    staffInstance.company = createStaffContactDto.company;
    staffInstance.department = createStaffContactDto.department;
    staffInstance.ipPhone = createStaffContactDto.ipPhone;
    staffInstance.name = createStaffContactDto.name;
    staffInstance.nameTH = createStaffContactDto.nameTH;
    staffInstance.nickname = createStaffContactDto.nickname;
    staffInstance.birthDate = createStaffContactDto.birthDate;
    staffInstance.staffId = createStaffContactDto.staffId;
    staffInstance.section = createStaffContactDto.section;
    staffInstance.position = createStaffContactDto.position;
    staffInstance.hash = await bcrypt.hash(createStaffContactDto.hash, 3);

    // mock
    staffInstance.createdBy = auth.id;

    try {
      if (createStaffContactDto.profilePicUrl) {
        staffInstance.profilePicUrl = createStaffContactDto.profilePicUrl;
      } else if (createStaffContactDto.image) {
        const key: any = await this.s3Service.uploadImagesS3(
          createStaffContactDto.image,
        );

        staffInstance.profilePicUrl = key;
      } else {
        staffInstance.profilePicUrl = '';
      }

      res = await this.repo.save(staffInstance);
    } catch (e) {
      this.logger
        .error(`Fn: ${this.create.name}, Params: ${createStaffContactDto.name}, Auth: ${auth.id}
  `);
      throw Error(e);
    }

    return res;
  }

  async bulkCreate(createStaffContactDtoArr: any) {
    this.logger.log(`Fn: ${this.bulkCreate.name}`);
    let res;
    try {
      res = await this.repo
        .createQueryBuilder()
        .insert()
        .into('staff_contact')
        .values(JSON.parse(createStaffContactDtoArr.data))
        .execute();
    } catch (e) {
      this.logger.error(`Fn: ${this.bulkCreate.name}
      `);
      throw Error(e);
    }

    return res;
  }

  async findAll(opt: ListBasicOperationContact) {
    this.logger.log(`Fn: ${this.findAll.name}`);
    let res;

    try {
      res = await this.repo
        .createQueryBuilder('StaffContact')
        .where(
          '(StaffContact.name LIKE :name OR StaffContact.nameTH LIKE :name OR StaffContact.nickname LIKE :name2)',
          { name: `%${opt.search}%`, name2: `%${opt.search}%` },
        )
        .andWhere('StaffContact.department LIKE :department', {
          department: `%${opt.department}%`,
        })
        .andWhere('StaffContact.company LIKE :company', {
          company: `${opt.company || '%'}`,
        })
        .skip(opt.skip)
        .take(opt.limit)
        .getManyAndCount();
    } catch (e) {
      this.logger.error(`Fn: ${this.findAll.name}`);
      throw new BadRequestException(e);
    }

    const rtn = {
      items: res?.[0],
      itemCount: res?.[0]?.length,
      total: res?.[1],
      page: opt.page,
    };

    return rtn;
  }

  async findAllBirthday(opt: ListBasicOperationContact) {
    this.logger.log(`Fn: ${this.findAllBirthday.name}`);
    let res;

    const month = moment(opt.startDate).month() + 1;
    const department = opt.department || '';
    try {
      res = await this.repo
        .createQueryBuilder('StaffContact')
        // .where('StaffContact.name LIKE :name', { name: `%${opt.search}%` })
        .where('MONTH(StaffContact.birthDate) = :month', {
          month,
        })
        .andWhere('StaffContact.department LIKE :department', {
          department: `%${department}%`,
        })
        .skip(opt.skip)
        .take(opt.limit)
        .orderBy('StaffContact.birthDate', 'ASC')
        .getManyAndCount();
    } catch (e) {
      this.logger.error(`Fn: ${this.findAllBirthday.name}`);
      throw new BadRequestException(e);
    }

    const rtn = {
      items: res?.[0],
      itemCount: res?.[0]?.length,
      total: res?.[1],
      page: opt.page || 1,
    };

    return rtn;
  }

  async findOne(id: string) {
    return await this.repo.findOne({ where: { id: +id } });
  }

  async findOneByEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    this.logger.log(`Fn: ${this.comparePassword.name}`);
    let res,
      rtn = false;

    try {
      res = await bcrypt.compare(password, hash);
      if (res) {
        rtn = true;
      }
    } catch (e) {
      this.logger.error(`Fn: ${this.comparePassword.name}`);
      throw new UnauthorizedException('Unable to authorized');
    }

    return rtn;
  }

  async update(id: number, updateStaffContactDto: UpdateStaffContactDto) {
    this.logger.log(`Fn: ${this.update.name}`);
    let res;

    const staffContactInstance = new StaffContact();
    staffContactInstance.id = id;
    staffContactInstance.email = updateStaffContactDto.email;
    staffContactInstance.company = updateStaffContactDto.company;
    staffContactInstance.department = updateStaffContactDto.department;
    staffContactInstance.ipPhone = updateStaffContactDto.ipPhone;
    staffContactInstance.name = updateStaffContactDto.name;
    staffContactInstance.nickname = updateStaffContactDto.nickname;

    try {
      res = await this.repo.save(staffContactInstance);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}`);
      throw Error(e);
    }

    return res;
  }

  async changePassword(id: number, hash: string) {
    this.logger.log(`Fn: ${this.changePassword.name}`);
    let res;

    const staffContactInstance = new StaffContact();
    staffContactInstance.id = id;
    staffContactInstance.hash = await bcrypt.hash(hash, 3);

    try {
      res = await this.repo.save(staffContactInstance);
    } catch (e) {
      this.logger.error(`Fn: ${this.changePassword.name}`);
      throw Error(e);
    }

    return res;
  }

  async remove(id: number) {
    this.logger.log(`Fn: ${this.remove.name}`);
    let res;

    const staffContactInstance = new StaffContact();
    staffContactInstance.id = id;

    try {
      res = await this.repo.delete({ id });
    } catch (e) {
      this.logger.error(`Fn: ${this.remove.name}`);
      throw Error(e);
    }

    if (res.affected < 1) {
      throw new BadRequestException('Cannot Find This ID');
    }

    return res;
  }

  parseQueryString(q: ListQueryParamsContactDTO): ListBasicOperationContact {
    const rtn: ListBasicOperationContact = {
      page: +q?.page || 1,
      limit: +q?.limit ? (+q?.limit > 100 ? 100 : +q?.limit) : 10,
      skip: (q?.page - 1) * q?.limit,
      orderBy: q?.orderBy || 'id',
      order: 'ASC',
      search: q?.search ? q?.search.trim() : '',
      department: q?.department || '',
      company: q?.company || '',
      startDate: undefined,
      endDate: undefined,
    };

    rtn.startDate = q?.startDate;
    rtn.endDate = q?.endDate;

    q.order = q?.order ? q?.order.toUpperCase() : '';
    rtn.order = q?.order != 'ASC' && q?.order != 'DESC' ? 'DESC' : q?.order;
    rtn.skip = (rtn.page - 1) * rtn.limit;

    return rtn;
  }
}
