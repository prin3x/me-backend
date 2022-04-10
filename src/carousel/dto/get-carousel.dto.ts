import { IsOptional, IsString } from 'class-validator';
import { ListBasicOperation, ListQueryParamsDTO } from 'utils/query.dto';

export class ListQueryParamsCarouselDTO extends ListQueryParamsDTO {
  @IsString()
  @IsOptional()
  linkOut: string;
}

export interface ListBasicOperationCarousel extends ListBasicOperation {
  linkOut?: string;
}
