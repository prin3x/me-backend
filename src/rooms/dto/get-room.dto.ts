import { ListBasicOperation, ListQueryParamsDTO } from 'utils/query.dto';

export class ListQueryParamsRoomDTO extends ListQueryParamsDTO {}

export interface ListBasicOperationRoom extends ListBasicOperation {
  floor?: string;
}
