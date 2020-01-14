const version = 2;

const CACHE_NAME = 'frustrated-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/betterstyle.css',
  '/scripts/storage.js',
  '/scripts/script.js',
  '/scripts/socket.io.js',
  '/scripts/display.js',
  '/scripts/utils.js'
];

self.addEventListener('activate', function (event) {
  console.log('activating service worker V' + version);
});

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function (cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    // Cache hit - return response
    .then((response) => response && !navigator.onLine ? response : fetch(event.request))
  );
});
