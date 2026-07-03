/* Service worker — maakt Boaz' Eiland offline speelbaar (ook op vakantie zonder internet). */
const CACHE = "boaz-eiland-v2";
const BESTANDEN = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(BESTANDEN)).then(()=> self.skipWaiting()));
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys().then(keys=> Promise.all(keys.filter(k=> k!==CACHE).map(k=> caches.delete(k))))
      .then(()=> self.clients.claim())
  );
});

self.addEventListener("fetch", e=>{
  if(e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached) return cached;
      return fetch(e.request).then(res=>{
        const kopie = res.clone();
        caches.open(CACHE).then(c=> c.put(e.request, kopie)).catch(()=>{});
        return res;
      }).catch(()=> cached);
    })
  );
});
