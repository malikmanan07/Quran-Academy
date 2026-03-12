export const parsePaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(query.pageSize) || 10));
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
};

export const buildPaginatedResponse = (data, total, page, pageSize) => {
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  };
};
