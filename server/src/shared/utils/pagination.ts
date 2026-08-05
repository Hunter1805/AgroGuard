export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export interface ParsedPagination {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

export function parsePagination(input: PaginationInput): ParsedPagination {
  const page = Math.max(1, Number(input.page) || 1);
  const rawPageSize = Number(input.pageSize) || 25;
  const pageSize = Math.min(100, Math.max(1, rawPageSize));
  const skip = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    skip,
    take: pageSize,
  };
}

export function createPaginationMeta(total: number, page: number, pageSize: number) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  return {
    page,
    pageSize,
    total,
    totalPages,
  };
}
