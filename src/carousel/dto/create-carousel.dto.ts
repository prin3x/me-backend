import { CAROUSEL_STATUS } from 'carousel/entities/carousel.entity';
import { IsOptional, IsString } from 'class-validator';

export class CreateCarouselDto {
  image: any;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  linkOut: string;

  @IsOptional()
  @IsString()
  status: CAROUSEL_STATUS;
}
