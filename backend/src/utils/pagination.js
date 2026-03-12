export const paginate = (query, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { offset, limit: Number(limit), page: Number(page) };
};

export const paginationMeta = (total, page, limit) => ({
  total,
  page: Number(page),
  limit: Number(limit),
  totalPages: Math.ceil(total / limit),
});
