import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCalendarEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  start: string;

  @IsString()
  end: string;

  @IsBoolean()
  allDay: boolean;

  @IsString()
  categoryName: string;

  @IsOptional()
  @IsString()
  hyperlink: string;
}
