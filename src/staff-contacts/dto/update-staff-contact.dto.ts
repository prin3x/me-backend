import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffContactDto } from './create-staff-contact.dto';

export class UpdateStaffContactDto extends PartialType(CreateStaffContactDto) {}
