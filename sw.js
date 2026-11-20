// =========================================================
// PIGPENFAN - SERVICE WORKER (PWA & OFFLINE CACHE)
// =========================================================

const CACHE_NAME = 'pigpenfan-cache-v4';

// Recursos essenciais para pré-cache imediato
const PRECACHE_URLS = [
  './',
  './index.html',
  './artistas/index.html',
  './projetos/index.html',
  './projetos/musicas/index.html',
  './sobre/index.html',
  './assets/css/style.css?v=9',
  './assets/js/site-data.js?v=9',
  './assets/js/render-engine.js?v=9',
  './assets/js/analytics.js?v=9',
  './content/data.json',
  './manifest.webmanifest',
  './assets/imagens/icones/pwa-icon-192.png',
  './assets/imagens/icones/pwa-icon-512.png',
  './assets/imagens/icones/peterc2-icon.webp'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Falha ao pré-cachear alguns itens:', err);
      });
    })
  );
});

// Ativação e limpeza de versões antigas de cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignora requisições não-GET ou de origens externas (como YouTube)
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Para páginas HTML, JSON de dados, JS e CSS: Network-First com fallback para Cache
  const isHTML = req.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  const isDataJson = url.pathname.endsWith('data.json');
  const isAppAsset = url.pathname.endsWith('.js') || url.pathname.endsWith('.css');

  if (isHTML || isDataJson || isAppAsset) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => caches.match(req).then((cachedRes) => {
          if (cachedRes) return cachedRes;
          if (isHTML) return caches.match('./index.html');
        }))
    );
    return;
  }

  // Para assets estáticos (imagens, fontes, manifesto): Cache-First com atualização em background
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      if (cachedRes) {
        // Busca atualização em segundo plano para manter o cache atualizado
        fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes));
          }
        }).catch(() => {});
        return cachedRes;
      }

      // Se não estava no cache, busca na rede e salva
      return fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return networkRes;
      }).catch((err) => {
        console.warn('[SW] Falha de rede para recurso:', req.url);
      });
    })
  );
});
