import { PartialType } from '@nestjs/mapped-types';
import { CreateFormsRequestCategoryDto } from './create-forms-request-category.dto';

export class UpdateFormsRequestCategoryDto extends PartialType(CreateFormsRequestCategoryDto) {}
