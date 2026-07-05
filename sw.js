const CACHE = 'bus-share-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(e.request).then(
        (hit) =>
          hit ||
          fetch(e.request)
            .then((res) => {
              cache.put(e.request, res.clone());
              return res;
            })
            .catch(() => hit)
      )
    )
  );
});
