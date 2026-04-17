const CACHE = 'glizzy-shell-v1';

const SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  const isDynamic =
    url.pathname.endsWith('/app.js') ||
    url.pathname.endsWith('/assets/manifest.json') ||
    url.pathname.includes('/assets/');

  if (isDynamic) {
    event.respondWith(
      fetch(event.request)
        .then(response => response)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
