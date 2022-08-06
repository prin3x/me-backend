import { IsString } from 'class-validator';

export class CreateDivisionDto {
  @IsString()
  division: string;
}
