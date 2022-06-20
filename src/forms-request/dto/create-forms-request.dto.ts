import { IsNumberString, IsString } from 'class-validator';

export class CreateFormsRequestDto {
  @IsString()
  content: string;

  @IsString()
  downloadLink: string;

  @IsNumberString()
  categoryDetail: number;
}
