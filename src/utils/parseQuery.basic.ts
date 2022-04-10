import { ListBasicOperation, ListQueryParamsDTO } from './query.dto';

export function normalParseQueryString(
  q: ListQueryParamsDTO,
): ListBasicOperation {
  const rtn: ListBasicOperation = {
    page: +q?.page || 1,
    limit: +q?.limit ? (+q?.limit > 100 ? 100 : +q?.limit) : 10,
    skip: (q?.page - 1) * q?.limit,
    orderBy: q?.orderBy || 'createdDate',
    order: 'ASC',
    search: q?.search ? q?.search.trim() : '',
  };

  q.order = q?.order ? q?.order.toUpperCase() : '';
  rtn.order = q?.order != 'ASC' && q?.order != 'DESC' ? 'DESC' : q?.order;
  rtn.skip = (rtn.page - 1) * rtn.limit;

  return rtn;
}
