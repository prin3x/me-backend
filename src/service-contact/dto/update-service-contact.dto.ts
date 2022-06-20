import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateServiceContactDto } from './create-service-contact.dto';

export class UpdateServiceContactDto extends PartialType(
  CreateServiceContactDto,
) {}
