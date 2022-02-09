import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { StaffContactsService } from './staff-contacts.service';
import { CreateStaffContactDto } from './dto/create-staff-contact.dto';
import { UpdateStaffContactDto } from './dto/update-staff-contact.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListQueryParamsContactDTO } from './dto/get-staff-contact.dto';

@Controller('staff-contacts')
export class StaffContactsController {
  constructor(private readonly staffContactsService: StaffContactsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createStaffContactDto: CreateStaffContactDto,
  ) {
    const set: CreateStaffContactDto = {
      ...createStaffContactDto,
      image,
    };
    return this.staffContactsService.create(set);
  }

  /**
   * It returns all the staff contacts.
   * @param {ListQueryCalendarDTO} q - ListQueryCalendarDTO
   */
  @Get('/')
  findAll(@Query() q: ListQueryParamsContactDTO) {
    const queryString = this.staffContactsService.parseQueryString(q);
    return this.staffContactsService.findAll(queryString);
  }

  @Get('/birthday')
  findAllBirthDay(@Query() q: ListQueryParamsContactDTO) {
    const queryString = this.staffContactsService.parseQueryString(q);
    return this.staffContactsService.findAllBirthday(queryString);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.staffContactsService.findOne(+id);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateStaffContactDto: UpdateStaffContactDto,
  ) {
    return this.staffContactsService.update(+id, updateStaffContactDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.staffContactsService.remove(+id);
  }
}
