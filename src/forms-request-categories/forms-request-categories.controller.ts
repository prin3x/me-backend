import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FormsRequestCategoriesService } from './forms-request-categories.service';
import { CreateFormsRequestCategoryDto } from './dto/create-forms-request-category.dto';
import { UpdateFormsRequestCategoryDto } from './dto/update-forms-request-category.dto';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('forms-request-category')
export class FormsRequestCategoriesController {
  constructor(
    private readonly formsRequestCategoriesService: FormsRequestCategoriesService,
  ) {}

  @Get('/')
  findAll() {
    return this.formsRequestCategoriesService.findAll();
  }

  @Post('/')
  create(
    @Body() createCategoryDto: CreateFormsRequestCategoryDto,
    @AuthPayload() admin: IAuthPayload,
  ) {
    return this.formsRequestCategoriesService.createOne(
      createCategoryDto,
      admin,
    );
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateServiceContactDto: UpdateFormsRequestCategoryDto,
  ) {
    return this.formsRequestCategoriesService.update(
      id,
      updateServiceContactDto,
    );
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.formsRequestCategoriesService.remove(id);
  }
}
