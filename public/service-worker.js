const CACHE_NAME = 'envyguard-v1.0.0';
const RUNTIME_CACHE = 'envyguard-runtime';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.ico',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache abierto:', CACHE_NAME);
        return cache.addAll(STATIC_ASSETS).catch((error) => {
          console.warn('[SW] Error al cachear algunos archivos:', error);
          // Continuar aunque algunos archivos fallen
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('[SW] Saltando fase de espera');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error durante instalación:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
    .then(() => {
      console.log('[SW] Service Worker activado');
      return self.clients.claim();
    })
  );
});

// Estrategia de caché: Network First, Fall back to Cache
self.addEventListener('fetch', (event) => {
  // Solo cachear solicitudes GET
  if (event.request.method !== 'GET') {
    return;
  }

  // No cachear solicitudes a dominios externos (excepto fonts)
  const url = new URL(event.request.url);
  if (url.hostname !== self.location.hostname && !event.request.url.includes('fonts.googleapis')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // No cachear respuestas no válidas
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clonar la respuesta
        const responseToCache = response.clone();
        const cacheName = event.request.url.includes('static') ? CACHE_NAME : RUNTIME_CACHE;
        
        caches.open(cacheName)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          })
          .catch((error) => {
            console.warn('[SW] Error al cachear:', error);
          });

        return response;
      })
      .catch(() => {
        // Si falla la red, usar el cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }

            // Fallback para documentos HTML
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }

            // Fallback genérico
            return new Response('No disponible offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Escuchar mensajes desde el cliente
self.addEventListener('message', (event) => {
  console.log('[SW] Mensaje recibido:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING ejecutado');
    self.skipWaiting();
  }
});

// Evento de cambio de conexión
self.addEventListener('online', () => {
  console.log('[SW] Conexión restaurada');
});

self.addEventListener('offline', () => {
  console.log('[SW] Conexión perdida - usando cache');
});

console.log('[SW] Service Worker cargado');
