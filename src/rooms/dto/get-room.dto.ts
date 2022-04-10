import { IsOptional, IsString } from 'class-validator';
import { ListBasicOperation, ListQueryParamsDTO } from 'utils/query.dto';

export class ListQueryParamsRoomDTO extends ListQueryParamsDTO {
  @IsString()
  @IsOptional()
  floor: string;
}

export interface ListBasicOperationRoom extends ListBasicOperation {
  floor?: string;
}
