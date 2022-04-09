import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { ROOM_STATUS } from 'rooms/entities/room.entity';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  @IsEnum(ROOM_STATUS)
  status: ROOM_STATUS;
}

export class UpdateRoomStatusDto {
  @IsEnum(ROOM_STATUS)
  status: ROOM_STATUS;
}
