import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FormsRequestService } from './forms-request.service';
import { CreateFormsRequestDto } from './dto/create-forms-request.dto';
import { UpdateFormsRequestDto } from './dto/update-forms-request.dto';
import { AuthPayload, IAuthPayload } from 'auth/auth.decorator';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createServiceContactDto: CreateFormsRequestDto,
    @AuthPayload() admin: IAuthPayload,
  ) {
    createServiceContactDto = { ...createServiceContactDto, file };
    return this.formsRequestService.createOne(createServiceContactDto, admin);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateFormsRequestDto: UpdateFormsRequestDto,
  ) {
    updateFormsRequestDto = { ...updateFormsRequestDto, file };
    return this.formsRequestService.update(id, updateFormsRequestDto);
  }

  @Patch('index/:id/:index')
  updateIndex(@Param('id') id: string, @Param('index') index: number) {
    return this.formsRequestService.updateIndex(id, index);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.formsRequestService.remove(id);
  }
}
