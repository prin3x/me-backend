import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MeetingEventType } from 'meeting-events/entities/meeting-event.entity';

export class CreateMeetingEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  start: string;

  @IsString()
  end: string;

  @Type(() => Number)
  @IsNumber()
  roomId: number;

  @IsOptional()
  @IsBoolean()
  allDay: boolean;

  @IsEnum(MeetingEventType)
  type: MeetingEventType;
}
