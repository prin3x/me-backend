import { IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsOptional()
  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  floor: string;
}
