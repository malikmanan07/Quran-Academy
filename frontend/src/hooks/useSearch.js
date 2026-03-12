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
      
      const response = await fetchFn(params);
      
      // Extraction logic: find the payload (usually response.data.data or response.data)
      const body = response.data || response;
      const payload = body.data || body;
      const meta = body.meta || {};
      
      // Intelligent data finder: find the first array in the payload
      let dataArray = [];
      if (Array.isArray(payload)) {
        dataArray = payload;
      } else if (typeof payload === 'object' && payload !== null) {
        // Find any direct array property (users, students, etc.)
        const foundArray = Object.values(payload).find(val => Array.isArray(val));
        dataArray = foundArray || [];
      }
      
      setData(dataArray);
      setTotal(meta.total || dataArray.length || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
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
