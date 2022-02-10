import { IsOptional, IsString } from 'class-validator';
import { ListBasicOperation, ListQueryParamsDTO } from 'utils/query.dto';

export class ListQueryParamsContactDTO extends ListQueryParamsDTO {
  @IsString()
  @IsOptional()
  department: string;

  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;
}

export interface ListBasicOperationContact extends ListBasicOperation {
  department?: string;
  company?: string;
}
