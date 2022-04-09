import { IsString, IsOptional } from 'class-validator';

export class ListQueryMeetingDTO {
  @IsString()
  @IsOptional()
  startDate: Date;

  @IsString()
  @IsOptional()
  endDate: Date;
}
