import { IsString, IsOptional } from 'class-validator';

export class ListQueryCalendarDTO {
  @IsString()
  @IsOptional()
  startDate: Date;

  @IsString()
  @IsOptional()
  endDate: Date;
}
