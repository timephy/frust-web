self.addEventListener('install', function(event) {
  console.log('a service worker has successfully been installed')
});

var CACHE_NAME = 'frustrated-cache';
const OFFLINE_URL = '/offline.html';
var urlsToCache = [
  '/',
  '/index.html',
  '/styles/betterstyle.css',
  '/scripts/storage.js',
  '/scripts/script.js',
  '/scripts/socket.io.js',
  '/scripts/display.js',
  '/scripts/utils.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
