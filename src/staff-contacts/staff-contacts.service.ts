import { Injectable } from '@nestjs/common';
import { CreateStaffContactDto } from './dto/create-staff-contact.dto';
import { UpdateStaffContactDto } from './dto/update-staff-contact.dto';

@Injectable()
export class StaffContactsService {
  create(createStaffContactDto: CreateStaffContactDto) {
    return 'This action adds a new staffContact';
  }

  findAll() {
    return `This action returns all staffContacts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staffContact`;
  }

  update(id: number, updateStaffContactDto: UpdateStaffContactDto) {
    return `This action updates a #${id} staffContact`;
  }

  remove(id: number) {
    return `This action removes a #${id} staffContact`;
  }
}
