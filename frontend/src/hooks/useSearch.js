import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

export const useSearch = (fetchFn, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialParams.search || '');
  const [page, setPage] = useState(initialParams.page || 1);
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 10);
  const [filters, setFilters] = useState(initialParams.filters || {});

  const debouncedSearch = useDebounce(search, 300);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
        search: debouncedSearch,
        ...filters
      };
      const result = await fetchFn(params);
      
      // Standard response format handling
      const responseData = result.data?.data || result.data || [];
      const meta = result.data?.meta || {};
      
      setData(Array.isArray(responseData) ? responseData : (responseData.users || responseData.data || []));
      setTotal(meta.total || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, pageSize, debouncedSearch, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  return {
    data,
    loading,
    total,
    page,
    pageSize,
    search,
    setSearch,
    setFilters,
    setPage,
    setPageSize,
    refresh: fetchData
  };
};
