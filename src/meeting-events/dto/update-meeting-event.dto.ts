import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { MeetingEventType } from 'meeting-events/entities/meeting-event.entity';

export class UpdateMeetingEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  start: string;

  @IsString()
  end: string;

  @IsOptional()
  @IsBoolean()
  allDay: boolean;

  @IsEnum(MeetingEventType)
  type: MeetingEventType;
}
