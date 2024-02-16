import { RequestHelper } from '@lib/helpers/request.helper';
import { EntityManager, QueryBuilder } from '@mikro-orm/mysql';

import { IPagingResponse } from '@type/query';

export const getPageInfo = (page?: number, perPage?: number) => {
  let currentPage: number = parseInt(page || RequestHelper.getQuery('page', 1), 10);
  let take: number = parseInt(perPage || RequestHelper.getQuery('per_page', 25), 10);

  if (Number.isNaN(currentPage) || currentPage <= 0) {
    currentPage = 1;
  }

  if (Number.isNaN(take) || take <= 0) {
    take = 25;
  }

  const skip = (currentPage - 1) * take;

  return { skip, take, page: currentPage };
};

export const getPageCount = (totalCount: number, take: number) => {
  if (take < 1) {
    return totalCount > 0 ? 1 : 0;
  }

  totalCount = totalCount < 0 ? 0 : totalCount;
  return parseInt(String((totalCount + take - 1) / take), 10);
};

QueryBuilder.prototype.getPaged = async function (page?: number, perPage?: number): Promise<IPagingResponse> {
  const { skip, take, page: curPage } = getPageInfo(page, perPage);
  const [collection, count] = await this.offset(skip).limit(take).getResultAndCount();

  return {
    meta: {
      total_count: count,
      page_count: getPageCount(count, take),
      page: curPage,
      per_page: take,
    },
    items: collection,
  };
};

export { EntityManager };
