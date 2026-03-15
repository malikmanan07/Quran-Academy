export const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(
    100, 
    Math.max(1, parseInt(query.limit) || 20)
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const paginatedResponse = (
  data, total, page, limit
) => ({
  data,
  total,
  page,
  totalPages: Math.ceil(total / limit),
  limit,
});

// Backward compatibility for existing controllers
export const parsePaginationParams = (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(query.limit || query.pageSize) || 20));
  return { page, pageSize };
};

export const buildPaginatedResponse = (data, total, page, pageSize) => {
  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};
