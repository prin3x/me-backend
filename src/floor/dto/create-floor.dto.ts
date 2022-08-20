import { IsString } from 'class-validator';

export class CreateFloorDto {
  @IsString()
  floor: string;
}
