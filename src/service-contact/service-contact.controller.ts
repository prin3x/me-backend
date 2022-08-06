import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { Roles } from 'auth/roles.decorator';
import { ADMIN_ROLES, RolesGuard } from 'auth/roles.guard';
import { CreateServiceContactDto } from './dto/create-service-contact.dto';
import { UpdateServiceContactDto } from './dto/update-service-contact.dto';
import { ServiceContactService } from './service-conatct.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('service-contact')
export class ServiceContactController {
  constructor(private serviceContactService: ServiceContactService) {}

  @Get('/all')
  async findAll() {
    return this.serviceContactService.findAll();
  }

  @Get('/')
  findAllWithCategory() {
    return this.serviceContactService.findAllWithCategory();
  }

  @Post('/')
  create(
    @Body() createServiceContactDto: CreateServiceContactDto,
    @AuthPayload() admin: IAuthPayload,
  ) {
    return this.serviceContactService.createOne(createServiceContactDto, admin);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateServiceContactDto: UpdateServiceContactDto,
  ) {
    return this.serviceContactService.update(id, updateServiceContactDto);
  }

  @Patch('index/:id/:index')
  updateIndex(@Param('id') id: string, @Param('index') index: number) {
    return this.serviceContactService.updateIndex(id, index);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.serviceContactService.remove(id);
  }
}
