// Version bei jedem Release hochzählen, damit alte Caches invalidiert werden
const SW_VERSION = 'v3';
const CACHE_NAME = `curamain-${SW_VERSION}`;
const RUNTIME_CACHE = `curamain-runtime-${SW_VERSION}`;
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Failed to cache some assets:', err);
      }),
    ),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Nur GET-Requests; alles andere (POST/PUT/...) immer direkt durchreichen.
  if (request.method !== 'GET') return;

  // Nur same-origin (CORS-Probleme mit Fonts/GA vermeiden)
  if (url.origin !== self.location.origin) return;

  // API-Endpoints komplett am SW vorbei: kein Caching, kein Offline-Stub.
  // Verhindert, dass SW versehentlich JSON-Antworten cached oder mit
  // einem 503-Stub den Client verwirrt.
  if (url.pathname.startsWith('/api/')) return;

  // Admin-Routen nicht cachen (Auth-Risiken vermeiden)
  if (url.pathname.startsWith('/admin')) return;

  // Network first für HTML/CSS/JS
  if (
    request.headers.get('accept')?.includes('text/html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseToCache));
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || new Response('Offline - Page not available', { status: 503 }),
          ),
        ),
    );
    return;
  }

  // Cache first für Bilder & sonstige Assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseToCache));
          return response;
        })
        .catch(() => new Response('Offline - Asset not available', { status: 503 }));
    }),
  );
});
