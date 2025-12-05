const CACHE_NAME = 'envyguard-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch(() => {
          console.log('Some resources could not be cached during install');
        });
      })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: Network First, Fall back to Cache
self.addEventListener('fetch', (event) => {
  // Skip no-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API requests - siempre intenta red primero
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cachear respuestas exitosas
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar caché
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first para static assets
  if (event.request.url.includes('/static/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
    return;
  }

  // Network-first con fallback a caché para todo lo demás
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then((response) => response || new Response('Offline - No disponible'));
      })
  );
});
