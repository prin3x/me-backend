import { IsOptional, IsString } from 'class-validator';
import { ListBasicOperation, ListQueryParamsDTO } from 'utils/query.dto';

export class ListQueryCalendarByCategoryDTO extends ListQueryParamsDTO {
  @IsString()
  year: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  month: string;
}

export interface ListQueryStringByCategory extends ListBasicOperation {
  year?: string;
  category?: string;
}
