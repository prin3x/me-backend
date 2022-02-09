import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class StaffContactsService {
  constructor(
    @InjectRepository(StaffContact)
    private repo: Repository<StaffContact>,
    private s3Service: S3Service,
  ) {}

  async create(createStaffContactDto: CreateStaffContactDto) {
    let res;

    const staffInstance = new StaffContact();
    staffInstance.email = createStaffContactDto.email;
    staffInstance.company = createStaffContactDto.company;
    staffInstance.department = createStaffContactDto.department;
    staffInstance.ipPhone = createStaffContactDto.ipPhone;
    staffInstance.name = createStaffContactDto.name;
    staffInstance.nickname = createStaffContactDto.nickname;
    staffInstance.birthDate = createStaffContactDto.birthDate;
    staffInstance.hash = createStaffContactDto.email;

    // mock
    staffInstance.createdBy = 1;

    try {
      const key: any = await this.s3Service.uploadImagesS3(
        createStaffContactDto.image,
      );

      staffInstance.profilePicUrl = key;

      res = await this.repo.save(staffInstance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async findAll(opt: ListBasicOperationContact) {
    let res;

    try {
      res = await this.repo
        .createQueryBuilder('StaffContact')
        .where('StaffContact.name LIKE :name', { name: `%${opt.search}%` })
        .andWhere('StaffContact.department LIKE :department', {
          department: `%${opt.department}%`,
        })
        .skip(opt.skip)
        .take(opt.limit)
        .getManyAndCount();
    } catch (e) {
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
    let res;

    const month = moment(opt.startDate).month() + 1;
    try {
      res = await this.repo
        .createQueryBuilder('StaffContact')
        // .where('StaffContact.name LIKE :name', { name: `%${opt.search}%` })
        // .andWhere('StaffContact.department LIKE :department', {
        //   department: `%${opt.department}%`,
        // })
        .andWhere('MONTH(StaffContact.birthDate) = :month', {
          month,
        })
        .skip(opt.skip)
        .take(opt.limit)
        .orderBy('StaffContact.birthDate', 'ASC')
        .getManyAndCount();
    } catch (e) {
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

  async findOne(id: number) {
    return await this.repo.findOne(id);
  }

  async update(id: number, updateStaffContactDto: UpdateStaffContactDto) {
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
      throw Error(e);
    }

    return res;
  }

  async remove(id: number) {
    let res;

    const staffContactInstance = new StaffContact();
    staffContactInstance.id = id;

    try {
      res = await this.repo.delete({ id });
    } catch (e) {
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
