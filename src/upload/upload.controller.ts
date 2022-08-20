import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'auth/jwt-auth-guard';
import { Roles } from 'auth/roles.decorator';
import { RolesGuard } from 'auth/roles.guard';
import { UploadService } from './upload.service';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return (
      this.configService.get('apiAssetURL') +
      `${file.path}`.replace('upload', '')
    );
  }
}
