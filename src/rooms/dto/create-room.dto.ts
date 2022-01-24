import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  floor: number;
}
