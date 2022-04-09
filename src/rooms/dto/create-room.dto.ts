import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  image: any;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  floor: string;
}
