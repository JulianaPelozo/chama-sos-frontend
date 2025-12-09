const CACHE_NAME = "chama-sos-v1";
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/home.html",
    "/usuarios.html",
    "/ocorrencias.html",
    "/cadastro-ocorrencia.html",
    "/configuracoes.html",

    "/css/style.css",
    "/css/pages.css",

    "/js/login.js",
    "/js/register.js",
    "/js/dashboard.js",

    "/img/logo.jpg"
];

self.addEventListener("install", event => {
    console.log("[SW] Instalando service worker...");
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("[SW] Fazendo cache dos arquivos...");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    console.log("[SW] Ativo!");
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log("[SW] Removendo cache antigo", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return (
                response ||
                fetch(event.request).catch(() => {
                    console.warn("[SW] Offline e sem cache:", event.request.url);
                })
            );
        })
    );
});
