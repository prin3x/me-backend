import { CAROUSEL_STATUS } from 'carousel/entities/carousel.entity';
import { IsEnum } from 'class-validator';
import { CreateCarouselDto } from './create-carousel.dto';

export class UpdateCarouselDto extends CreateCarouselDto {
  @IsEnum(CAROUSEL_STATUS)
  status: CAROUSEL_STATUS;
}
