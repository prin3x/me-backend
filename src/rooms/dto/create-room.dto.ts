import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  image: any;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  floor: string;

  @Type(() => Number)
  @IsNumber()
  capacity: number;
}
