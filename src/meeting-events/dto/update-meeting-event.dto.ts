import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingEventDto } from './create-meeting-event.dto';

export class UpdateMeetingEventDto extends PartialType(CreateMeetingEventDto) {}
