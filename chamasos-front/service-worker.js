const APP_CACHE = "chamasos-v1";

const APP_ASSETS = [
  "/", 
  "/index.html",
  "/login.html",
  "/dashboard.html",
  "/ocorrencias.html",
  "/nova-ocorrencia.html",
  "/css/style.css",
  "/js/api.js",
  "/js/auth.js",
  "/js/login.js",
  "/js/dashboard.js",
  "/js/ocorrencias.js",
  "/js/nova-ocorrencia.js",
  "/icons/192.png",
  "/icons/512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(APP_CACHE).then(cache => cache.addAll(APP_ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== APP_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/")) {
    return event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "Offline" }),
          { headers: { "Content-Type": "application/json" } }
        );
      })
    );
  }

  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request);
    })
  );
});
