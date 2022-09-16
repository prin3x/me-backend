import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { DepartmentService } from 'department/department.service';
import { DivisionService } from 'division/division.service';
import { CompanyService } from 'company/company.service';
import { Company } from 'company/entities/company.entity';
import { Department } from 'department/entities/department.entity';
import { Division } from 'division/entities/division.entity';
import { User } from 'users/entities/user.entity';

@Injectable()
export class StaffContactsService {
  private readonly logger = new Logger(StaffContactsService.name);
  constructor(
    @InjectRepository(StaffContact)
    private repo: Repository<StaffContact>,
    private config: ConfigService,
    private departmentService: DepartmentService,
    private divisionService: DivisionService,
    private companyService: CompanyService,
  ) {}

  async retrieveAllStaffOptions() {
    let company: Company[] = [];
    let department: Department[] = [];
    let division: Division[] = [];
    let res;
    try {
      company = await this.companyService.findAll();
      department = await this.departmentService.findAll();
      division = await this.divisionService.findAll();

      res = {
        company,
        division,
        department,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }

    return res;
  }

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
    staffInstance.division = createStaffContactDto.division;
    staffInstance.position = createStaffContactDto.position;
    staffInstance.hash = await bcrypt.hash('123456', 3);
    staffInstance.profilePicUrl = '';

    // mock
    staffInstance.createdBy = auth.id;

    if (createStaffContactDto.profilePicUrl) {
      staffInstance.profilePicUrl = createStaffContactDto.profilePicUrl;
    } else if (createStaffContactDto.image) {
      staffInstance.profilePicUrl =
        this.config.get('apiAssetURL') +
        `${createStaffContactDto.image.path}`.replace('upload', '');
    }
    try {
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
        .orderBy(opt.orderBy, opt.order)
        .skip(opt.skip)
        .take(opt.limit)
        .getManyAndCount();
    } catch (e) {
      this.logger.error(`Fn: ${this.findAll.name}`, e);
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
    this.logger.log(`Fn: ${this.findAllBirthday.name}, ${JSON.stringify(opt)}`);
    let res;

    const month = moment(opt.startDate).month() + 1;
    const department = opt.department || '';
    try {
      const query = this.repo.createQueryBuilder('StaffContact');

      if (!isNaN(month)) {
        query.where('MONTH(StaffContact.birthDate) = :month', {
          month,
        });
      }
      query.andWhere('StaffContact.department LIKE :department', {
        department: `%${department}%`,
      });
      query.skip(opt.skip);
      query.take(opt.limit);
      query.orderBy('StaffContact.birthDate', 'ASC');
      res = await query.getManyAndCount();
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

  async findAllBirthdayWithoutMonth(opt: ListBasicOperationContact) {
    this.logger.log(`Fn: ${this.findAllBirthday.name}`);
    let res;

    const department = opt.department || '';
    try {
      res = await this.repo
        .createQueryBuilder('StaffContact')
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

    const n = await bcrypt.hash(password, 3);

    try {
      res = await bcrypt.compareSync(password, hash);
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

    try {
      const staffTarget = await this.findOne(`${id}`);

      if (!staffTarget) throw new NotFoundException('No staff id found');

      const newStaffInformation = Object.assign(
        staffTarget,
        updateStaffContactDto,
      );

      if (updateStaffContactDto.profilePicUrl) {
        newStaffInformation.profilePicUrl = updateStaffContactDto.profilePicUrl;
      } else if (updateStaffContactDto.image) {
        newStaffInformation.profilePicUrl =
          this.config.get('apiAssetURL') +
          `${updateStaffContactDto.image.path}`.replace('upload', '');
      }

      res = await this.repo.save(newStaffInformation);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}`);
      throw Error(e);
    }

    return res;
  }

  async updateByEmail(
    email: string,
    updateStaffContactDto: UpdateStaffContactDto,
  ) {
    this.logger.log(`Fn: ${this.update.name}`);
    let res;

    try {
      const staffTarget = await this.findOneByEmail(`${email}`);

      if (!staffTarget) throw new NotFoundException(`No staff email found, ${email}`);

      const newStaffInformation = Object.assign(
        staffTarget,
        updateStaffContactDto,
      );

      if (updateStaffContactDto.profilePicUrl) {
        newStaffInformation.profilePicUrl = updateStaffContactDto.profilePicUrl;
      } else if (updateStaffContactDto.image) {
        newStaffInformation.profilePicUrl =
          this.config.get('apiAssetURL') +
          `${updateStaffContactDto.image.path}`.replace('upload', '');
      }

      res = await this.repo.save(newStaffInformation);
    } catch (e) {
      this.logger.error(`Fn: ${this.update.name}`);
      throw Error(e);
    }

    return res;
  }

  async changePassword(_user: StaffContact, newPassword: string) {
    this.logger.log(`Fn: ${this.changePassword.name}, ${_user.email}`);
    let res;

    const newHash = await bcrypt.hash(newPassword, 3);

    try {
      res = await this.repo.save(Object.assign(_user, { hash: newHash }));
    } catch (e) {
      this.logger.error(`Fn: ${this.changePassword.name}`);
      throw Error(e);
    }

    return res;
  }

  async remove(id: number) {
    this.logger.log(`Fn: ${this.remove.name}`);
    let res;

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
      order: q.order === 'descend' ? 'DESC' : 'ASC',
      search: q?.search ? q?.search.trim() : '',
      department: q?.department || '',
      company: q?.company || '',
      startDate: undefined,
      endDate: undefined,
    };

    rtn.startDate = q?.startDate;
    rtn.endDate = q?.endDate;

    rtn.skip = (rtn.page - 1) * rtn.limit;

    return rtn;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return await this.repo.update(userId, {
      refreshToken: currentHashedRefreshToken,
    });
  }

  async resetPassword(id: string) {
    let res: StaffContact;
    try {
      const staff = await this.findOne(id);

      if (staff) {
        staff.hash = await bcrypt.hash('123456', 3);
      }

      res = await this.repo.save(staff);
    } catch (e) {
      this.logger.error(`Fn: ${this.resetPassword.name}`);
      throw Error(e);
    }

    return res;
  }

  async removeRefreshToken(email: string) {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.repo.update(
      { email },
      {
        refreshToken: null,
      },
    );
  }
}
