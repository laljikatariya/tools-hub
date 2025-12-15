// ⚡ Service Worker for Caching & Offline Support

const CACHE_NAME = 'utilo-v1';
const STATIC_CACHE = 'utilo-static-v1';
const DYNAMIC_CACHE = 'utilo-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('⚡ Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('⚡ Removing old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome extension and external requests
  if (
    request.url.startsWith('chrome-extension://') ||
    !request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      // Return cached response if available
      if (cached) {
        return cached;
      }

      // Otherwise fetch from network
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache dynamic content (with size limit)
          caches.open(DYNAMIC_CACHE).then((cache) => {
            // Only cache GET requests under 5MB
            const contentLength = response.headers.get('content-length');
            if (!contentLength || parseInt(contentLength) < 5000000) {
              cache.put(request, responseToCache);
            }
          });

          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.destination === 'document') {
            return caches.match('/offline');
          }
        });
    })
  );
});

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Implement analytics syncing logic here
  console.log('⚡ Syncing analytics data');
}
