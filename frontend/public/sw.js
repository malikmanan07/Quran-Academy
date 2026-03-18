const CACHE_NAME = 'qa-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('Failed to cache completely:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests, API requests, and development modules/HMR
  const isDevModule = event.request.url.includes('.jsx') || 
                     event.request.url.includes('/node_modules/') ||
                     event.request.url.includes('?v=') ||
                     event.request.url.includes('?t=');

  if (!event.request.url.startsWith(self.location.origin) || 
      event.request.url.includes('/api/') ||
      isDevModule) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache new successful GET requests
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // In case of completely offline and page request, try to return index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html').then(res => res || new Response('Network error, please check connection.', { status: 408 }));
        }
        return new Response('Network error occurred', {
          status: 408,
          statusText: 'Network Error'
        });
      });
    })
  );
});
