import { IsString } from 'class-validator';

export class CreateCalendarEventCategoryDto {
  @IsString()
  title: string;
}
