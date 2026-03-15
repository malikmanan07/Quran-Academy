const cache = new Map();

export const getCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }
  return null;
};

export const cachedRequest = async (key, requestFn, ttlSeconds = 300) => {
  const cachedData = getCache(key);
  if (cachedData) return cachedData;

  const data = await requestFn();
  cache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000
  });
  return data;
};

export const invalidateCache = (pattern) => {
  if (!pattern) return;
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key);
  }
};

export const clearCache = () => cache.clear();
