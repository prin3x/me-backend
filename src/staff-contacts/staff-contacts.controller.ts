import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaffContactsService } from './staff-contacts.service';
import { CreateStaffContactDto } from './dto/create-staff-contact.dto';
import { UpdateStaffContactDto } from './dto/update-staff-contact.dto';

@Controller('staff-contacts')
export class StaffContactsController {
  constructor(private readonly staffContactsService: StaffContactsService) {}

  @Post()
  create(@Body() createStaffContactDto: CreateStaffContactDto) {
    return this.staffContactsService.create(createStaffContactDto);
  }

  @Get()
  findAll() {
    return this.staffContactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffContactsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffContactDto: UpdateStaffContactDto) {
    return this.staffContactsService.update(+id, updateStaffContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffContactsService.remove(+id);
  }
}
