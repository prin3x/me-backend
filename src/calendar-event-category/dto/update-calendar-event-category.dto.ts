import { PartialType } from '@nestjs/mapped-types';
import { CreateCalendarEventCategoryDto } from './create-calendar-event-category.dto';

export class UpdateCalendarEventCategoryDto extends PartialType(CreateCalendarEventCategoryDto) {}
