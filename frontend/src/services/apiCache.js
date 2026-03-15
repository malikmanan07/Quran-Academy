const cache = new Map();

export const cachedRequest = async (key, requestFn, ttlSeconds = 300) => {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

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
