const CACHE_NAME = "chama-sos-cache-v2";
const urlsToCache = [
    "/",
    "/index.html",
    "/home.html",
    "/dashboard.html",
    "/usuarios.html",
    "/ocorrencias.html",
    "/cadastro-ocorrencia.html",
    "/configuracoes.html",
    "/register.html",
    "/css/style.css",
    "/css/pages.css",
    "/css/ocorrencias.css",
    "/js/login.js",
    "/js/register.js",
    "/js/home.js",
    "/js/dashboard.js",
    "/js/usuarios.js",
    "/js/ocorrencias-list.js",
    "/js/nova-ocorrencia.js",
    "/js/configuracoes.js",
    "/img/logo.jpg",
    "/icons/icon-192.png",
    "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Arquivos em cache");
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        )
    );
});


self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
