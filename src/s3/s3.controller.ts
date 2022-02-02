import { Controller, Get, Param } from '@nestjs/common';

import { S3Service } from './s3.service';

/*
===================
TODO: Controller
===================
*/
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  // TODO: Get List
  @Get('/:id')
  async getS3Url(@Param('id') id: string) {
    return this.s3Service.getS3Url(id);
  }
}
