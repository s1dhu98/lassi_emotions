/* Lassi Emotions - Offline ServiceWorker Cache */

const CACHE_NAME = 'lassi-emotions-v3-cache';
const ASSETS = [
  './',
  './index.html',
  './src/css/main.css',
  './src/css/components.css',
  './src/css/animations.css',
  './src/js/main.js',
  './assets/data/emotions_dataset.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
