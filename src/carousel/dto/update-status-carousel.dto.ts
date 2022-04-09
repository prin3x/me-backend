import { CAROUSEL_STATUS } from 'carousel/entities/carousel.entity';
import { IsEnum } from 'class-validator';

export class UpdateCarouselStatusDto {
  @IsEnum(CAROUSEL_STATUS)
  status: CAROUSEL_STATUS;
}
