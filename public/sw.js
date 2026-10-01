/* Eu Pescador! — Service Worker (cache offline básico) */
const CACHE_NAME = 'eu-pescador-sites-v3';
const PRECACHE_URLS = ['/offline.html', '/favicon.png', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => undefined))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith('eu-pescador-') && key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Só tratamos GET de mesma origem; requisições de API/auth passam direto.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_serverFn') ||
      url.pathname.startsWith('/signin-with-chatgpt') || url.pathname.startsWith('/signout-with-chatgpt') ||
      url.pathname.startsWith('/auth/') || url.pathname === '/callback') return;

  // Navegações: rede primeiro, com fallback para a shell em cache (offline).
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Cache only public assets. Never store API results or authenticated HTML.
  if (!url.pathname.startsWith('/assets/') && !PRECACHE_URLS.includes(url.pathname)) return;
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
