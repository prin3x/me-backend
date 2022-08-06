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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ServiceContactCategoryService } from './service-contact-categories.service';

@UseGuards(JwtAuthGuard)
@Controller('service-contact-category')
export class ServiceContactCategoryController {
  constructor(
    private readonly serviceContactCategory: ServiceContactCategoryService,
  ) {}

  @Get('/')
  findAll() {
    return this.serviceContactCategory.findAll();
  }

  @Patch('index/:id/:index')
  updateIndex(@Param('id') id: string, @Param('index') index: number) {
    return this.serviceContactCategory.updateIndex(id, index);
  }

  @Post('/')
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @AuthPayload() admin: IAuthPayload,
  ) {
    return this.serviceContactCategory.createOne(createCategoryDto, admin);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateServiceContactDto: UpdateCategoryDto,
  ) {
    return this.serviceContactCategory.update(id, updateServiceContactDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.serviceContactCategory.remove(id);
  }
}
