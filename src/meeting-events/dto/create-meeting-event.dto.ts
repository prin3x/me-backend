import { IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsNumber()
  roomId: number;
}
