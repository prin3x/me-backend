import { PartialType } from '@nestjs/mapped-types';
import { CreateFormsRequestDto } from './create-forms-request.dto';

export class UpdateFormsRequestDto extends PartialType(CreateFormsRequestDto) {}
