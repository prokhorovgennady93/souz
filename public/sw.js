const CACHE_NAME = 'dopog-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // 1. Navigation (HTML Snapshots): Network-first, then Static Cache Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        // Look for the specific HTML snapshot of this page
        const cached = await caches.match(event.request);
        if (cached) return cached;
        
        // If it's a course sub-page or home, and we don't have the specific link,
        // try to find any course-related shell or root.
        if (url.pathname.startsWith('/course/')) {
           return caches.match(url.pathname) || caches.match('/');
        }
        
        return caches.match('/');
      })
    );
    return;
  }

  // 2. Master Asset Interceptor (Cache-First)
  if (event.request.method === 'GET' && isSameOrigin) {
    if (url.pathname.startsWith('/api/auth')) return;

    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        }).catch(() => null);

        // Always return cache first for speed and offline stability
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 3. Fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
