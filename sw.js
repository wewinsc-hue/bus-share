const CACHE = 'bus-share-v2';
 
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
 
// 네트워크 우선: 온라인이면 항상 최신 파일을 받아오고, 캐시는 오프라인 대비용으로만 사용
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
 
