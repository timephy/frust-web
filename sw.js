const CACHE_NAME = 'frustrated-cache';

const urlsToCache = [
  '/',
  '/index.html',
  '/styles/betterstyle.css',
  '/scripts/storage.js',
  '/scripts/script.js',
  '/scripts/socket.io.js',
  '/scripts/display.js',
  '/scripts/utils.js',
  '/images/teemo.jpg',
  '/images/elmo.jpg',
  '/images/einstein.svg',
  '/images/einsteinBW.svg',
  '/version.json',
  '/images/fu-meme.jpg'
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
    // Cache hit - return response, or a new version is available, then get
    .then((response) => (response && !navigator.onLine) ? response : fetch(event.request))
  );
  return;
});
