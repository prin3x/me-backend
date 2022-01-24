import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffContactDto } from './dto/create-staff-contact.dto';
import { UpdateStaffContactDto } from './dto/update-staff-contact.dto';
import { StaffContact } from './entities/staff-contact.entity';

@Injectable()
export class StaffContactsService {
  constructor(
    @InjectRepository(StaffContact)
    private repo: Repository<StaffContact>,
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
    // mock
    staffInstance.createdBy = 1;

    try {
      res = await this.repo.save(staffInstance);
    } catch (e) {
      throw Error(e);
    }

    return res;
  }

  async findAll() {
    return await this.repo.find();
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
}
