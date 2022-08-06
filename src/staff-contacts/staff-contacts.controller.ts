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
  UseGuards,
  Req,
} from '@nestjs/common';
import { StaffContactsService } from './staff-contacts.service';
import { CreateStaffContactDto } from './dto/create-staff-contact.dto';
import { UpdateStaffContactDto } from './dto/update-staff-contact.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListQueryParamsContactDTO } from './dto/get-staff-contact.dto';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { ADMIN_ROLES, RolesGuard } from 'auth/roles.guard';
import { Roles } from 'auth/roles.decorator';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';

@Controller('staff-contacts')
export class StaffContactsController {
  constructor(private readonly staffContactsService: StaffContactsService) {}

  @Roles([ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createStaffContactDto: CreateStaffContactDto,
    @AuthPayload() admin: IAuthPayload,
  ) {
    const set: CreateStaffContactDto = {
      ...createStaffContactDto,
      image,
    };
    return this.staffContactsService.create(set, admin);
  }

  /**
   * It returns all the staff contacts.
   * @param {ListQueryCalendarDTO} q - ListQueryCalendarDTO
   */
  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/')
  findAll(@Query() q: ListQueryParamsContactDTO) {
    const queryString = this.staffContactsService.parseQueryString(q);
    return this.staffContactsService.findAll(queryString);
  }

  @Get('/options')
  retrieveAllStaffOptions() {
    return this.staffContactsService.retrieveAllStaffOptions();
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/birthday')
  findAllBirthDay(@Query() q: ListQueryParamsContactDTO) {
    const queryString = this.staffContactsService.parseQueryString(q);
    return this.staffContactsService.findAllBirthday(queryString);
  }

  @Roles([ADMIN_ROLES.USER, ADMIN_ROLES.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.staffContactsService.findOne(id);
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/bulk')
  bulkCreate(@Body() createStaffContactDtoArr: any) {
    return this.staffContactsService.bulkCreate(createStaffContactDtoArr);
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateStaffContactDto: UpdateStaffContactDto,
  ) {
    return this.staffContactsService.update(+id, updateStaffContactDto);
  }

  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.staffContactsService.remove(+id);
  }
}
