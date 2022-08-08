import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { normalParseQueryString } from 'utils/parseQuery.basic';
import { ListQueryParamsDTO } from 'utils/query.dto';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ADMIN_STATUS } from './entities/admin.entity';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.regisAdmin(createAdminDto);
  }

  @Get()
  findAll(@Query() q: ListQueryParamsDTO) {
    const query = normalParseQueryString(q);
    return this.adminsService.findAll(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminsService.findOne(+id);
  // }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @Patch('/:id')
  changePassword(@Param('id') id: string, @Body('password') password: string) {
    return this.adminsService.changePassword(+id, password);
  }

  @Patch('/:id/status/')
  updateStatus(@Param('id') id: string, @Body('status') status: ADMIN_STATUS) {
    return this.adminsService.updateStatus(+id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id);
  }
}
