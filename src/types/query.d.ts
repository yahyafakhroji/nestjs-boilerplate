export interface IPagingResponse {
  meta: {
    total_count: number;
    page_count: number;
    page: number;
    per_page: number;
  };
  items: any[];
}

declare module '@mikro-orm/knex/query/QueryBuilder' {
  interface QueryBuilder<T> {
    getPaged(page?: number, perPage?: number): Promise<IPagingResponse>;
  }
}
