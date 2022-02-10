import { IsOptional, IsString } from 'class-validator';
import { ListBasicOperation, ListQueryParamsDTO } from 'utils/query.dto';

export class ListQueryParamsPostDTO extends ListQueryParamsDTO {
  @IsString()
  @IsOptional()
  categoryName: string;
}

export interface ListBasicOperationPost extends ListBasicOperation {
  categoryName?: string;
}
