import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { getCache, cachedRequest } from '../services/apiCache';

export const useSearch = (fetchFn, initialParams = {}) => {
  const cacheKey = initialParams.cacheKey ? `${initialParams.cacheKey}:${initialParams.page || 1}:${initialParams.search || ''}` : null;
  const initialCache = cacheKey ? getCache(cacheKey) : null;

  const [data, setData] = useState(initialCache?.data || []);
  const [total, setTotal] = useState(initialCache?.total || 0);
  const [loading, setLoading] = useState(initialCache ? false : true);
  const [search, setSearch] = useState(initialParams.search || '');
  const [page, setPage] = useState(initialParams.page || 1);
  const [pageSize, setPageSize] = useState(initialParams.pageSize || 10);
  const [filters, setFilters] = useState(initialParams.filters || {});
  
  const isFirstLoad = useRef(true);
  const debouncedSearch = useDebounce(search, 300);

  const fetchData = useCallback(async () => {
    // True Stale-While-Revalidate: If we have an initial synchronous cache, 
    // let the fetch run in the background but DO NOT trigger the UI blocker.
    if (!initialCache || !isFirstLoad.current) {
      setLoading(true);
    }
    isFirstLoad.current = false;
    try {
      const params = {
        page,
        pageSize,
        search: debouncedSearch,
        ...filters
      };
      
      const currentCacheKey = initialParams.cacheKey ? `${initialParams.cacheKey}:${page}:${debouncedSearch}` : null;
      
      const requestLogic = async () => {
        const response = await fetchFn(params);
        const body = response.data || response;
        const payload = body.data || body;
        const meta = body.meta || {};
        
        let dataArray = Array.isArray(payload) ? payload : (Object.values(payload).find(val => Array.isArray(val)) || []);
        return { data: dataArray, total: meta.total || dataArray.length || 0 };
      };

      const result = currentCacheKey ? await cachedRequest(currentCacheKey, requestLogic, 60) : await requestLogic();
      
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Keep existing data if we have any (don't clear UI on revalidation error)
      if (data.length === 0) setData([]);
    } finally {
      if (!initialCache && !isFirstLoad.current) {
        setLoading(false);
      } else {
        setLoading(false);
      }
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
