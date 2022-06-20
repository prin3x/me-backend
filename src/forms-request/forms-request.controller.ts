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
import { FormsRequestService } from './forms-request.service';
import { CreateFormsRequestDto } from './dto/create-forms-request.dto';
import { UpdateFormsRequestDto } from './dto/update-forms-request.dto';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('forms-request')
export class FormsRequestController {
  constructor(private readonly formsRequestService: FormsRequestService) {}

  @Get('/all')
  async findAll() {
    return this.formsRequestService.findAll();
  }

  @Get('/')
  findAllWithCategory() {
    return this.formsRequestService.findAllWithCategory();
  }

  @Post('/')
  create(
    @Body() createServiceContactDto: CreateFormsRequestDto,
    @AuthPayload() admin: IAuthPayload,
  ) {
    return this.formsRequestService.createOne(createServiceContactDto, admin);
  }

  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateFormsRequestDto: UpdateFormsRequestDto,
  ) {
    return this.formsRequestService.update(id, updateFormsRequestDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.formsRequestService.remove(id);
  }
}
