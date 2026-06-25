const CACHE_NAME = 'simulador-inversiones-v1';
const ASSETS = [
  '/simulador-inversiones/',
  '/simulador-inversiones/index.html',
  '/simulador-inversiones/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(res => { caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone())); return res; })
      .catch(() => caches.match(event.request))
  );
});
